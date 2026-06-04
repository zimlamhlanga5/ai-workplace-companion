# AI Workplace Productivity Assistant

## Project Overview

AI Workplace Productivity Assistant is a modern, responsive web application that helps professionals automate everyday workplace tasks using Artificial Intelligence. The platform unifies multiple AI-powered productivity tools into a single, intuitive dashboard — improving efficiency in communication, planning, research, and task management.

Built as an educational project, it demonstrates practical AI implementation, prompt engineering, professional UI/UX design, and responsible AI usage. The application resembles a premium SaaS productivity platform with polished design, fast performance, and scalable architecture.

---

## Features

### 1. Smart Email Generator
Quickly draft professional emails tailored to recipients, purposes, and desired tones. Choose from Formal, Friendly, Professional, or Persuasive styles. Generated emails include subject lines and full body copy, ready for editing before sending.

### 2. Meeting Notes Summarizer
Paste raw meeting notes and receive structured, executive-quality summaries. Output includes an Executive Summary, Key Discussion Points, Decisions Made, Action Items, Deadlines, and Follow-up Recommendations.

### 3. AI Task Planner
Enter a list of tasks with priorities and deadlines, and the AI generates an organized productivity plan. Output includes a Daily Schedule, Weekly Planner, Priority Ranking, and Productivity Recommendations.

### 4. AI Research Assistant
Input any workplace topic or question and receive concise, structured research analysis. Results include a Topic Summary, Key Insights, Recommendations, Advantages, Disadvantages, and Suggested Next Steps.

### 5. AI Workplace Chatbot
An interactive assistant for general workplace questions, idea generation, summarization, writing help, and productivity planning. Maintains conversation context for natural, back-and-forth interactions.

### Additional Capabilities
- **Responsive Dashboard Interface** — Works seamlessly on desktop, tablet, and mobile.
- **Editable AI Outputs** — All generated content can be reviewed and modified before use.
- **Responsible AI Disclaimer** — Reminds users that AI outputs should be verified before business decisions.
- **Dark Mode Support** — Toggle between light and dark themes for comfortable viewing.

---

## Tools & Technologies Used

| Category | Technology |
|----------|------------|
| Frontend Framework | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Routing & SSR | TanStack Start (v1) |
| State & Data | TanStack Query |
| AI Backend | Lovable AI Gateway (Gemini 3 Flash) |
| Server Functions | TanStack `createServerFn` |
| Build Tool | Vite 7 |
| Package Manager | Bun |

---

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-workplace-productivity-assistant
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```
   *(or `npm install` if you prefer npm)*

3. **Set up environment variables**
   Create a `.env` file in the project root and add:
   ```
   LOVABLE_API_KEY=your_lovable_api_key_here
   ```
   The AI features require a Lovable API key to access the AI Gateway.

4. **Start the development server**
   ```bash
   bun run dev
   ```
   *(or `npm run dev`)*

5. **Open the application**
   Navigate to `http://localhost:3000` in your browser.

---

## Project Structure

```
src/
  components/          # Reusable UI components (Sidebar, MarkdownView, etc.)
  components/ui/       # shadcn/ui components
  hooks/               # Custom React hooks
  lib/                 # Utility functions & server functions
  lib/ai.functions.ts  # AI-powered server functions
  routes/              # TanStack Start file-based routes
  styles.css            # Global styles & design tokens
```

---

## Responsible AI

This application provides AI-generated content that may contain inaccuracies, biases, or outdated information. Users should always review and verify AI outputs before making business decisions or sharing them externally. This application is designed to assist productivity and does not replace professional judgment.

---

## Future Improvements

- Calendar Integration (sync tasks with Google/Outlook calendars)
- User Authentication & Profiles (save history, preferences)
- Export to PDF / Word
- Task Notifications & Reminders
- Team Collaboration Features (shared workspaces, comments)
- Multi-language Support

---

## Author

**Khazimla Mhlanga**

Educational Project — CAPACITI ASA_5
