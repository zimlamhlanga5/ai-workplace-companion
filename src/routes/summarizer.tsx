import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { MarkdownView } from "@/components/MarkdownView";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/summarizer")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — AI Workplace" }] }),
  component: Page,
});

function Page() {
  const call = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (notes.trim().length < 10) return toast.error("Please paste your meeting notes.");
    setLoading(true);
    try {
      const res = await call({ data: { notes } });
      setSummary(res.summary);
      toast.success("Summary ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader title="Meeting Notes Summarizer" description="Extract decisions, action items and deadlines." icon={<FileText className="h-5 w-5" />} />
      <AiDisclaimer />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label>Meeting notes</Label>
              <Textarea rows={18} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste raw meeting notes, transcript, or bullet points..." />
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Summarizing..." : "Summarize"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="flex items-center justify-between">
              <Label>Summary</Label>
              {summary && <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(summary); toast.success("Copied"); }}><Copy className="h-3.5 w-3.5" /></Button>}
            </div>
            <div className="min-h-[400px] rounded-md border border-border bg-muted/20 p-4">
              {summary ? <MarkdownView text={summary} /> : <p className="text-sm text-muted-foreground">Your structured summary will appear here.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
