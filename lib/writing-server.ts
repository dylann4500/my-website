import { desc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { writingArticles } from "@/db/schema";
import {
  sanitizeArticleInput,
  sanitizeBlocks,
  type WritingArticle,
  type WritingSummary,
} from "@/lib/writing";

const CREATE_WRITING_TABLE = `
  CREATE TABLE IF NOT EXISTS writing_articles (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    written_at TEXT NOT NULL,
    blocks TEXT NOT NULL,
    published INTEGER DEFAULT 0 NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

const CREATE_WRITING_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_writing_articles_published_written_at
  ON writing_articles (published, written_at DESC)
`;

export async function ensureWritingTable() {
  if (!env.DB) throw new Error("Database unavailable");
  await env.DB.batch([
    env.DB.prepare(CREATE_WRITING_TABLE),
    env.DB.prepare(CREATE_WRITING_INDEX),
  ]);
}

function toArticle(row: typeof writingArticles.$inferSelect): WritingArticle {
  return {
    ...row,
    published: Boolean(row.published),
    blocks: sanitizeBlocks(JSON.parse(row.blocks)),
  };
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72) || "untitled";
}

async function uniqueSlug(title: string, id: string) {
  const base = slugify(title);
  let slug = base;
  let suffix = 2;
  while (true) {
    const [existing] = await getDb()
      .select({ id: writingArticles.id })
      .from(writingArticles)
      .where(eq(writingArticles.slug, slug))
      .limit(1);
    if (!existing || existing.id === id) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function getAllWritingArticles(): Promise<WritingArticle[]> {
  await ensureWritingTable();
  const rows = await getDb()
    .select()
    .from(writingArticles)
    .orderBy(desc(writingArticles.writtenAt));
  return rows.map(toArticle);
}

export async function getPublishedWritingSummaries(): Promise<WritingSummary[]> {
  try {
    await ensureWritingTable();
    const rows = await getDb()
      .select({
        id: writingArticles.id,
        slug: writingArticles.slug,
        title: writingArticles.title,
        writtenAt: writingArticles.writtenAt,
        published: writingArticles.published,
        updatedAt: writingArticles.updatedAt,
      })
      .from(writingArticles)
      .where(eq(writingArticles.published, true))
      .orderBy(desc(writingArticles.writtenAt));
    return rows.map((row) => ({ ...row, published: Boolean(row.published) }));
  } catch {
    return [];
  }
}

export async function getPublishedWritingArticle(slug: string) {
  try {
    await ensureWritingTable();
    const [row] = await getDb()
      .select()
      .from(writingArticles)
      .where(eq(writingArticles.slug, slug))
      .limit(1);
    return row?.published ? toArticle(row) : null;
  } catch {
    return null;
  }
}

export async function saveWritingArticle(value: unknown) {
  await ensureWritingTable();
  const input = sanitizeArticleInput(value);
  const now = new Date().toISOString();
  const id = input.id || crypto.randomUUID();
  const slug = await uniqueSlug(input.title, id);
  const [existing] = await getDb()
    .select({ createdAt: writingArticles.createdAt })
    .from(writingArticles)
    .where(eq(writingArticles.id, id))
    .limit(1);

  const row: typeof writingArticles.$inferInsert = {
    id,
    slug,
    title: input.title,
    writtenAt: input.writtenAt,
    blocks: JSON.stringify(input.blocks),
    published: input.published,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  if (existing) {
    await getDb()
      .update(writingArticles)
      .set(row)
      .where(eq(writingArticles.id, id));
  } else {
    await getDb().insert(writingArticles).values(row);
  }

  const [saved] = await getDb()
    .select()
    .from(writingArticles)
    .where(eq(writingArticles.id, id))
    .limit(1);
  return toArticle(saved);
}

export async function deleteWritingArticle(id: string) {
  await ensureWritingTable();
  await getDb().delete(writingArticles).where(eq(writingArticles.id, id));
}
