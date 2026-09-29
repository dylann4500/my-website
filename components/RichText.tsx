import { Fragment, type ReactNode } from "react";
import { parseInline, type InlineNode } from "@/lib/rich-text";

function renderNodes(nodes: InlineNode[], keyPrefix = ""): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}${index}`;
    if (typeof node === "string") return <Fragment key={key}>{node}</Fragment>;
    if ("url" in node) {
      return (
        <a
          className="inline-link"
          href={node.url}
          target="_blank"
          rel="noreferrer"
          key={key}
        >
          {node.label}
        </a>
      );
    }
    const Style = node.style;
    return <Style key={key}>{renderNodes(node.children, `${key}-`)}</Style>;
  });
}

export function RichText({
  text,
  formatting = false,
}: {
  text: string;
  // Bold, italic, and underline markers; only writing pieces use them.
  formatting?: boolean;
}) {
  return <>{renderNodes(parseInline(text, formatting))}</>;
}
