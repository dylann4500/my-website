import { eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import {
  defaultContent,
  sanitizeContent,
  type SiteContent,
} from "@/lib/content";

const CREATE_CONTENT_TABLE = `
  CREATE TABLE IF NOT EXISTS site_content (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    owner_email TEXT,
    updated_at TEXT NOT NULL
  )
`;

export async function ensureContentTable() {
  if (!env.DB) throw new Error("Database unavailable");
  await env.DB.prepare(CREATE_CONTENT_TABLE).run();
}

export async function getPublishedContent(): Promise<SiteContent> {
  try {
    await ensureContentTable();
    const [row] = await getDb()
      .select({ content: siteContent.content })
      .from(siteContent)
      .where(eq(siteContent.id, 1))
      .limit(1);

    if (!row) return sanitizeContent(defaultContent);
    return sanitizeContent(JSON.parse(row.content));
  } catch {
    return sanitizeContent(defaultContent);
  }
}
