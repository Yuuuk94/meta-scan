import { parseInline } from "@/services/parseInline";

// issue #76 — renders blog text with `code` spans and [links](url).
export function InlineText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((t, i) => {
        if (t.type === "code")
          return (
            <code key={i} className="bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground">
              {t.value}
            </code>
          );
        if (t.type === "bold")
          return (
            <strong key={i} className="font-bold text-foreground">
              {t.value}
            </strong>
          );
        if (t.type === "link") {
          const external = /^https?:\/\//.test(t.href);
          return (
            <a
              key={i}
              href={t.href}
              className="text-accent underline underline-offset-2"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {t.value}
            </a>
          );
        }
        return <span key={i}>{t.value}</span>;
      })}
    </>
  );
}
