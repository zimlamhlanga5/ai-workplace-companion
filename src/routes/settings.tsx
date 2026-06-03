import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — AI Workplace" }] }),
  component: Page,
});

function Page() {
  const [name, setName] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setName(localStorage.getItem("aw_name") ?? "");
    const d = localStorage.getItem("aw_dark") === "1";
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);

  function save() {
    localStorage.setItem("aw_name", name);
    toast.success("Settings saved");
  }

  function toggleDark(v: boolean) {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    localStorage.setItem("aw_dark", v ? "1" : "0");
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader title="Settings" description="Personalize your workspace." icon={<SettingsIcon className="h-5 w-5" />} />
      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <Label>Display name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <div className="text-sm font-medium">Dark mode</div>
              <div className="text-xs text-muted-foreground">Switch between light and dark appearance.</div>
            </div>
            <Switch checked={dark} onCheckedChange={toggleDark} />
          </div>
          <Button onClick={save}>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
