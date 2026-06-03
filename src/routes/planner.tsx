import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListTodo, Loader2, Plus, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { MarkdownView } from "@/components/MarkdownView";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Task Planner — AI Workplace" }] }),
  component: Page,
});

type Task = { title: string; priority: "Low" | "Medium" | "High"; deadline?: string };

function Page() {
  const call = useServerFn(planTasks);
  const [tasks, setTasks] = useState<Task[]>([{ title: "", priority: "Medium", deadline: "" }]);
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  function update(i: number, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  }
  function add() { setTasks((p) => [...p, { title: "", priority: "Medium", deadline: "" }]); }
  function remove(i: number) { setTasks((p) => p.filter((_, idx) => idx !== i)); }

  async function run() {
    const clean = tasks.filter((t) => t.title.trim()).map((t) => ({ ...t, deadline: t.deadline || undefined }));
    if (!clean.length) return toast.error("Add at least one task.");
    setLoading(true);
    try {
      const res = await call({ data: { tasks: clean } });
      setPlan(res.plan);
      toast.success("Plan generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader title="AI Task Planner" description="Organize, prioritize and schedule your work." icon={<ListTodo className="h-5 w-5" />} />
      <AiDisclaimer />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <Label>Your tasks</Label>
            <div className="space-y-3">
              {tasks.map((t, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <Input className="col-span-6" placeholder="Task title" value={t.title} onChange={(e) => update(i, { title: e.target.value })} />
                  <Select value={t.priority} onValueChange={(v) => update(i, { priority: v as Task["priority"] })}>
                    <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Low", "Medium", "High"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input className="col-span-2" placeholder="Deadline" value={t.deadline ?? ""} onChange={(e) => update(i, { deadline: e.target.value })} />
                  <Button variant="ghost" size="icon" className="col-span-1" onClick={() => remove(i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={add} className="w-full"><Plus className="mr-2 h-4 w-4" /> Add task</Button>
            <Button onClick={run} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Planning..." : "Generate plan"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="flex items-center justify-between">
              <Label>AI Plan</Label>
              {plan && <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(plan); toast.success("Copied"); }}><Copy className="h-3.5 w-3.5" /></Button>}
            </div>
            <div className="min-h-[400px] rounded-md border border-border bg-muted/20 p-4">
              {plan ? <MarkdownView text={plan} /> : <p className="text-sm text-muted-foreground">Your daily schedule and priorities will appear here.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
