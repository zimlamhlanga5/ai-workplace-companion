import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { MarkdownView } from "@/components/MarkdownView";
import { chatWithAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — AI Workplace" }] }),
  component: Page,
});

type Msg = { role: "user" | "assistant"; content: string };

function Page() {
  const call = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your AI workplace assistant. Ask me anything — drafting, planning, brainstorming, summarizing." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await call({ data: { messages: next.slice(-20) } });
      setMessages((p) => [...p, { role: "assistant", content: res.reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col gap-4">
      <PageHeader title="AI Chatbot" description="Your interactive workplace assistant." icon={<MessageSquare className="h-5 w-5" />} />
      <AiDisclaimer />
      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden p-4">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  {m.role === "assistant" ? <MarkdownView text={m.content} /> : <p className="whitespace-pre-wrap">{m.content}</p>}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-2 text-sm text-muted-foreground">
                  <Loader2 className="inline h-3.5 w-3.5 animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 border-t border-border pt-3">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." disabled={loading} />
            <Button type="submit" disabled={loading || !input.trim()}><Send className="h-4 w-4" /></Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
