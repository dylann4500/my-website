import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteContent = sqliteTable("site_content", {
  id: integer("id").primaryKey(),
  content: text("content").notNull(),
  ownerEmail: text("owner_email"),
  updatedAt: text("updated_at").notNull(),
});
