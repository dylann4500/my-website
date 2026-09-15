export const writingBlockTypes = [
  "paragraph",
  "heading",
  "subheading",
  "image",
] as const;

export type WritingBlockType = (typeof writingBlockTypes)[number];

export type WritingBlock = {
  id: string;
  type: WritingBlockType;
  text: string;
  url: string;
  alt: string;
};

export type WritingArticle = {
  id: string;
  slug: string;
  title: string;
  writtenAt: string;
  blocks: WritingBlock[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WritingSummary = Pick<
  WritingArticle,
  "id" | "slug" | "title" | "writtenAt" | "published" | "updatedAt"
>;

function cleanText(value: unknown, maxLength = 20_000) {
  return typeof value === "string"
    ? value.replace(/\r\n?/g, "\n").slice(0, maxLength)
    : "";
}

function cleanImageUrl(value: unknown) {
  const text = cleanText(value, 2_000).trim();
  if (!text) return "";
  if (text.startsWith("/api/media/")) return text;
  try {
    const url = new URL(text);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export function sanitizeBlocks(value: unknown): WritingBlock[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 300).flatMap((candidate, index) => {
    if (!candidate || typeof candidate !== "object") return [];
    const block = candidate as Partial<WritingBlock>;
    const type = writingBlockTypes.includes(block.type as WritingBlockType)
      ? (block.type as WritingBlockType)
      : "paragraph";
    return [{
      id: cleanText(block.id, 100) || `block-${index}`,
      type,
      text: cleanText(block.text),
      url: cleanImageUrl(block.url),
      alt: cleanText(block.alt, 500),
    }];
  });
}

export function sanitizeArticleInput(value: unknown) {
  const candidate = value && typeof value === "object"
    ? (value as Partial<WritingArticle>)
    : {};
  const writtenDate = new Date(cleanText(candidate.writtenAt, 100));
  return {
    id: cleanText(candidate.id, 100),
    title: cleanText(candidate.title, 300).trim(),
    writtenAt: Number.isNaN(writtenDate.valueOf())
      ? new Date().toISOString()
      : writtenDate.toISOString(),
    blocks: sanitizeBlocks(candidate.blocks),
    published: candidate.published === true,
  };
}

export function formatWritingDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    hourCycle: "h23",
    minute: "2-digit",
  }).format(date);
}
