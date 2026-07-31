import { get, put } from "@vercel/blob";
import {
  defaultContent,
  sanitizeContent,
  type SiteContent,
} from "@/lib/content";

const CONTENT_PATH = "portfolio/content.json";

export function isContentStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function getPublishedContent(): Promise<SiteContent> {
  if (!isContentStorageConfigured()) {
    return sanitizeContent(defaultContent);
  }

  try {
    const stored = await get(CONTENT_PATH, {
      access: "public",
      useCache: false,
    });
    if (!stored || stored.statusCode !== 200) {
      return sanitizeContent(defaultContent);
    }

    const raw = await new Response(stored.stream).text();
    return sanitizeContent(JSON.parse(raw));
  } catch {
    return sanitizeContent(defaultContent);
  }
}

export async function savePublishedContent(
  value: unknown,
): Promise<SiteContent> {
  if (!isContentStorageConfigured()) {
    throw new Error(
      "Vercel Blob is not connected. Add BLOB_READ_WRITE_TOKEN first.",
    );
  }

  const content = sanitizeContent(value);
  await put(CONTENT_PATH, JSON.stringify(content), {
    access: "public",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  return content;
}
