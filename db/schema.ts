import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteContent = sqliteTable("site_content", {
  id: integer("id").primaryKey(),
  content: text("content").notNull(),
  ownerEmail: text("owner_email"),
  updatedAt: text("updated_at").notNull(),
});

export const writingArticles = sqliteTable(
  "writing_articles",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    writtenAt: text("written_at").notNull(),
    blocks: text("blocks").notNull(),
    published: integer("published", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("idx_writing_articles_published_written_at").on(
      table.published,
      table.writtenAt,
    ),
  ],
);
