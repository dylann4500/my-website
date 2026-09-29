export type InlineStyle = "strong" | "em" | "u";

export type InlineNode =
  | string
  | { label: string; url: string }
  | { style: InlineStyle; children: InlineNode[] };

// Markdown-style emphasis written by the writing editor's format buttons.
// A marker must hug the text it wraps and close on the same line, so notes
// like "** in hindsight" or words like "c++" and "snake_case" stay literal.
const emphasisMarkers = [
  { marker: "**", style: "strong", intraword: true },
  { marker: "++", style: "u", intraword: false },
  { marker: "*", style: "em", intraword: true },
  { marker: "_", style: "em", intraword: false },
] as const;

// A [label](https://…) link starting exactly at `index`.
function linkAt(text: string, index: number) {
  const labelEnd = text.indexOf("](", index + 1);
  if (labelEnd === -1) return null;
  const label = text.slice(index + 1, labelEnd);
  if (!label || /[[\]\n]/.test(label)) return null;

  const urlStart = labelEnd + 2;
  let nestedParentheses = 0;
  for (let cursor = urlStart; cursor < text.length; cursor += 1) {
    const character = text[cursor];
    if (/\s/.test(character)) return null;
    if (character === "(") {
      nestedParentheses += 1;
    } else if (character === ")") {
      if (nestedParentheses > 0) {
        nestedParentheses -= 1;
        continue;
      }
      try {
        const url = new URL(text.slice(urlStart, cursor));
        if (!["http:", "https:"].includes(url.protocol)) return null;
        return { label, url: url.toString(), end: cursor + 1 };
      } catch {
        return null;
      }
    }
  }
  return null;
}

// A formatted span opening exactly at `index`.
function emphasisAt(text: string, index: number) {
  for (const { marker, style, intraword } of emphasisMarkers) {
    if (!text.startsWith(marker, index)) continue;
    const start = index + marker.length;
    const first = text[start] ?? "";
    if (!first.trim() || first === marker[0]) continue;
    if (!intraword && /\w/.test(text[index - 1] ?? "")) continue;

    const lineEnd = text.indexOf("\n", start);
    const limit = lineEnd === -1 ? text.length : lineEnd;
    for (
      let close = text.indexOf(marker, start + 1);
      close !== -1 && close + marker.length <= limit;
      close = text.indexOf(marker, close + 1)
    ) {
      const before = text[close - 1];
      const after = text[close + marker.length] ?? "";
      if (!before.trim() || after === marker[0]) continue;
      if (marker.length === 1 && before === marker) continue;
      if (!intraword && /\w/.test(after)) continue;
      return {
        style,
        inner: text.slice(start, close),
        end: close + marker.length,
      };
    }
  }
  return null;
}

export function parseInline(text: string, formatting = false): InlineNode[] {
  const nodes: InlineNode[] = [];
  let plainStart = 0;
  let index = 0;

  while (index < text.length) {
    const link = text[index] === "[" ? linkAt(text, index) : null;
    const emphasis = !link && formatting ? emphasisAt(text, index) : null;
    const token = link ?? emphasis;
    if (!token) {
      index += 1;
      continue;
    }

    if (index > plainStart) nodes.push(text.slice(plainStart, index));
    nodes.push(
      link
        ? { label: link.label, url: link.url }
        : { style: emphasis!.style, children: parseInline(emphasis!.inner, true) },
    );
    index = plainStart = token.end;
  }

  if (plainStart < text.length) nodes.push(text.slice(plainStart));
  return nodes;
}

function nodeText(node: InlineNode): string {
  if (typeof node === "string") return node;
  if ("url" in node) return node.label;
  return node.children.map(nodeText).join("");
}

// Reading text without link or formatting syntax, e.g. for link previews.
export function plainText(text: string) {
  return parseInline(text, true).map(nodeText).join("");
}
