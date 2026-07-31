import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { defaultContent } from "@/lib/content";
import { ensureContentTable } from "@/lib/content-server";

export type EditorIdentity =
  | { ok: true; email: string }
  | { ok: false; status: 401 | 403; message: string };

function isLocalRequest(request: Request) {
  const hostname = new URL(request.url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export async function authorizeEditor(
  request: Request,
): Promise<EditorIdentity> {
  const user = await getChatGPTUser();
  const email = user?.email ?? (isLocalRequest(request) ? "local-preview" : "");

  if (!email) {
    return {
      ok: false,
      status: 401,
      message: "Sign in with ChatGPT to edit this site.",
    };
  }

  await ensureContentTable();
  const db = getDb();
  const [row] = await db
    .select({
      id: siteContent.id,
      ownerEmail: siteContent.ownerEmail,
    })
    .from(siteContent)
    .where(eq(siteContent.id, 1))
    .limit(1);

  if (!row) {
    await db.insert(siteContent).values({
      id: 1,
      content: JSON.stringify(defaultContent),
      ownerEmail: email,
      updatedAt: new Date().toISOString(),
    });
    return { ok: true, email };
  }

  if (!row.ownerEmail) {
    await db
      .update(siteContent)
      .set({ ownerEmail: email })
      .where(eq(siteContent.id, 1));
    return { ok: true, email };
  }

  if (row.ownerEmail !== email && row.ownerEmail !== "local-preview") {
    return {
      ok: false,
      status: 403,
      message: "This editor belongs to another account.",
    };
  }

  return { ok: true, email };
}
