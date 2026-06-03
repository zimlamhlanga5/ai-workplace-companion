import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callAI(messages: Array<{ role: string; content: string }>) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });
  if (res.status === 429) throw new Error("Rate limit exceeded. Please try again shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in your workspace.");
  if (!res.ok) throw new Error(`AI error: ${res.status}`);
  const json = (await res.json()) as { choices: Array<{ message: { content: string } }> };
  return json.choices[0]?.message?.content ?? "";
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      recipient: z.string().max(200),
      purpose: z.string().min(1).max(500),
      info: z.string().max(4000),
      tone: z.enum(["Formal", "Friendly", "Professional", "Persuasive"]),
    }),
  )
  .handler(async ({ data }) => {
    const content = await callAI([
      {
        role: "system",
        content:
          "You are a professional business communication expert. Generate a clear, concise, and professional email. Respond strictly as JSON with keys: subject (string), body (string). No markdown, no code fences.",
      },
      {
        role: "user",
        content: `Recipient: ${data.recipient}\nPurpose: ${data.purpose}\nKey information: ${data.info}\nTone: ${data.tone}`,
      },
    ]);
    try {
      const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
      return { subject: String(parsed.subject ?? ""), body: String(parsed.body ?? "") };
    } catch {
      return { subject: "Generated Email", body: content };
    }
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(10).max(20000) }))
  .handler(async ({ data }) => {
    return {
      summary: await callAI([
        {
          role: "system",
          content:
            "You are an executive assistant. Summarize meeting notes into clearly labeled markdown sections: ## Executive Summary, ## Key Discussion Points, ## Decisions Made, ## Action Items, ## Deadlines, ## Follow-up Recommendations. Be concise and structured.",
        },
        { role: "user", content: data.notes },
      ]),
    };
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tasks: z
        .array(
          z.object({
            title: z.string().min(1).max(300),
            priority: z.enum(["Low", "Medium", "High"]),
            deadline: z.string().max(100).optional(),
          }),
        )
        .min(1)
        .max(50),
    }),
  )
  .handler(async ({ data }) => {
    return {
      plan: await callAI([
        {
          role: "system",
          content:
            "You are a productivity coach. Organize tasks by urgency, importance, and deadlines. Output markdown with sections: ## Daily Schedule, ## Weekly Planner, ## Priority Ranking, ## Productivity Recommendations.",
        },
        { role: "user", content: `Tasks:\n${JSON.stringify(data.tasks, null, 2)}` },
      ]),
    };
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      topic: z.string().min(2).max(300),
      question: z.string().max(1000).optional(),
    }),
  )
  .handler(async ({ data }) => {
    return {
      result: await callAI([
        {
          role: "system",
          content:
            "You are a research analyst. Provide markdown with: ## Topic Summary, ## Key Insights, ## Recommendations, ## Advantages, ## Disadvantages, ## Suggested Next Steps. Be concise and practical.",
        },
        {
          role: "user",
          content: `Topic: ${data.topic}${data.question ? `\nQuestion: ${data.question}` : ""}`,
        },
      ]),
    };
  });

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      messages: z
        .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(8000) }))
        .min(1)
        .max(40),
    }),
  )
  .handler(async ({ data }) => {
    return {
      reply: await callAI([
        {
          role: "system",
          content:
            "You are an AI Workplace Assistant. Help with workplace questions, idea generation, summarization, writing, and productivity planning. Be helpful, concise, and professional. Use markdown when appropriate.",
        },
        ...data.messages,
      ]),
    };
  });
