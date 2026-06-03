// Minimal markdown renderer: headings, bold, lists. No external deps.
export function MarkdownView({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuf: string[] = [];
  const flushList = (key: number) => {
    if (listBuf.length) {
      out.push(
        <ul key={`ul-${key}`} className="my-2 list-disc space-y-1 pl-5 text-sm">
          {listBuf.map((li, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inline(li) }} />
          ))}
        </ul>,
      );
      listBuf = [];
    }
  };
  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (/^\s*[-*]\s+/.test(line)) {
      listBuf.push(line.replace(/^\s*[-*]\s+/, ""));
      return;
    }
    flushList(i);
    if (/^###\s+/.test(line)) {
      out.push(<h3 key={i} className="mt-3 text-sm font-semibold">{line.replace(/^###\s+/, "")}</h3>);
    } else if (/^##\s+/.test(line)) {
      out.push(<h2 key={i} className="mt-4 text-base font-semibold text-primary">{line.replace(/^##\s+/, "")}</h2>);
    } else if (/^#\s+/.test(line)) {
      out.push(<h1 key={i} className="mt-4 text-lg font-semibold">{line.replace(/^#\s+/, "")}</h1>);
    } else if (line.trim() === "") {
      out.push(<div key={i} className="h-2" />);
    } else {
      out.push(<p key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: inline(line) }} />);
    }
  });
  flushList(lines.length);
  return <div className="prose-sm max-w-none">{out}</div>;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function inline(s: string) {
  let t = escapeHtml(s);
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  t = t.replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-xs">$1</code>');
  return t;
}
