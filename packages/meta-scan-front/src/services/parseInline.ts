// issue #76 — blog text supports only `code` spans, **bold** and [text](url) links.
export type InlineToken =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "bold"; value: string }
  | { type: "link"; value: string; href: string };

const pattern = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseInline(input: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  for (const m of input.matchAll(pattern)) {
    const index = m.index ?? 0;
    if (index > last) tokens.push({ type: "text", value: input.slice(last, index) });
    if (m[1] !== undefined) tokens.push({ type: "code", value: m[1] });
    else if (m[2] !== undefined) tokens.push({ type: "bold", value: m[2] });
    else tokens.push({ type: "link", value: m[3], href: m[4] });
    last = index + m[0].length;
  }
  if (last < input.length) tokens.push({ type: "text", value: input.slice(last) });
  return tokens;
}
