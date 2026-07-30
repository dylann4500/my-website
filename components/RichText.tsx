import { Fragment, type ReactNode } from "react";

type LinkPart = {
  label: string;
  url: string;
};

function findNextLink(text: string, from: number) {
  const labelStart = text.indexOf("[", from);
  if (labelStart === -1) return null;

  const labelEnd = text.indexOf("](", labelStart + 1);
  if (labelEnd === -1) return null;

  const urlStart = labelEnd + 2;
  let nestedParentheses = 0;

  for (let index = urlStart; index < text.length; index += 1) {
    const character = text[index];
    if (character === "(") {
      nestedParentheses += 1;
    } else if (character === ")") {
      if (nestedParentheses > 0) {
        nestedParentheses -= 1;
      } else {
        const url = text.slice(urlStart, index);
        try {
          const parsed = new URL(url);
          if (!["http:", "https:"].includes(parsed.protocol)) return null;
          return {
            start: labelStart,
            end: index + 1,
            label: text.slice(labelStart + 1, labelEnd),
            url: parsed.toString(),
          };
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

export function RichText({ text }: { text: string }) {
  const parts: Array<string | LinkPart> = [];
  let cursor = 0;

  while (cursor < text.length) {
    const link = findNextLink(text, cursor);
    if (!link) {
      parts.push(text.slice(cursor));
      break;
    }

    if (link.start > cursor) parts.push(text.slice(cursor, link.start));
    parts.push({ label: link.label, url: link.url });
    cursor = link.end;
  }

  return (
    <>
      {parts.map((part, index): ReactNode =>
        typeof part === "string" ? (
          <Fragment key={`text-${index}`}>{part}</Fragment>
        ) : (
          <a
            className="inline-link"
            href={part.url}
            target="_blank"
            rel="noreferrer"
            key={`${part.url}-${index}`}
          >
            {part.label}
          </a>
        ),
      )}
    </>
  );
}
