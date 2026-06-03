import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, FileText, ListTodo, Search, MessageSquare, Sparkles, TrendingUp, Zap, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — AI Workplace" }] }),
  component: Dashboard,
});

const tools = [
  { title: "Smart Email Generator", desc: "Draft polished emails in seconds.", url: "/email", icon: Mail },
  { title: "Meeting Summarizer", desc: "Turn notes into action items.", url: "/summarizer", icon: FileText },
  { title: "Task Planner", desc: "Prioritize and schedule your work.", url: "/planner", icon: ListTodo },
  { title: "Research Assistant", desc: "Get insights on any topic fast.", url: "/research", icon: Search },
  { title: "AI Chatbot", desc: "Ask anything, anytime.", url: "/chat", icon: MessageSquare },
];

const stats = [
  { label: "Tasks automated", value: "128", icon: Zap },
  { label: "Hours saved this week", value: "9.4", icon: Clock },
  { label: "Productivity index", value: "+24%", icon: TrendingUp },
];

function Dashboard() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-6 text-primary-foreground shadow-lg md:p-8">
        <div className="flex items-center gap-2 text-sm opacity-90">
          <Sparkles className="h-4 w-4" /> Welcome back
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Your AI productivity workspace
        </h1>
        <p className="mt-2 max-w-2xl text-sm opacity-90 md:text-base">
          Draft emails, summarize meetings, plan your day, research topics, and chat with an AI assistant — all in one place.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild variant="secondary"><Link to="/email">Generate an email</Link></Button>
          <Button asChild variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link to="/chat">Open AI chat</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <PageHeader title="Quick actions" description="Jump into any AI tool below." />
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.url} to={t.url} className="group">
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-3 text-base">{t.title}</CardTitle>
                  <CardDescription>{t.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
          <CardDescription>Your latest AI-assisted work will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border text-sm">
            <li className="flex items-center justify-between py-3"><span>Drafted email to client</span><span className="text-muted-foreground">2h ago</span></li>
            <li className="flex items-center justify-between py-3"><span>Summarized weekly standup</span><span className="text-muted-foreground">Yesterday</span></li>
            <li className="flex items-center justify-between py-3"><span>Planned tasks for sprint</span><span className="text-muted-foreground">Mon</span></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
