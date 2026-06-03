import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Loader2, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Generator — AI Workplace" }] }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Professional" | "Persuasive";

function EmailPage() {
  const call = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [info, setInfo] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!purpose.trim()) return toast.error("Please enter a purpose.");
    setLoading(true);
    try {
      const res = await call({ data: { recipient, purpose, info, tone } });
      setSubject(res.subject);
      setBody(res.body);
      toast.success("Email generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied`));
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader title="Smart Email Generator" description="Draft professional emails in seconds." icon={<Mail className="h-5 w-5" />} />
      <AiDisclaimer />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label>Recipient name</Label>
              <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah Johnson" />
            </div>
            <div className="space-y-2">
              <Label>Email purpose</Label>
              <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Follow up on project proposal" />
            </div>
            <div className="space-y-2">
              <Label>Key information</Label>
              <Textarea rows={6} value={info} onChange={(e) => setInfo(e.target.value)} placeholder="Bullet points or context to include..." />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Formal", "Friendly", "Professional", "Persuasive"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Generating..." : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Subject</Label>
                {subject && <Button size="sm" variant="ghost" onClick={() => copy(subject, "Subject")}><Copy className="h-3.5 w-3.5" /></Button>}
              </div>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Generated subject will appear here" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Body</Label>
                <div className="flex gap-1">
                  {body && <Button size="sm" variant="ghost" onClick={() => copy(body, "Email")}><Copy className="h-3.5 w-3.5" /></Button>}
                  {body && <Button size="sm" variant="ghost" onClick={run} disabled={loading}><RefreshCw className="h-3.5 w-3.5" /></Button>}
                </div>
              </div>
              <Textarea rows={16} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Your generated email will appear here..." />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
