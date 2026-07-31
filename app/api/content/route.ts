import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { authorizeEditor } from "@/lib/editor-auth";
import { getPublishedContent } from "@/lib/content-server";
import { sanitizeContent } from "@/lib/content";

export async function GET() {
  const content = await getPublishedContent();
  return Response.json({ content });
}

export async function POST(request: Request) {
  try {
    const auth = await authorizeEditor(request);
    if (!auth.ok) {
      return Response.json(
        { error: auth.message },
        { status: auth.status },
      );
    }

    const raw = await request.text();
    if (raw.length > 250_000) {
      return Response.json({ error: "Content is too large." }, { status: 413 });
    }

    const payload = JSON.parse(raw) as { content?: unknown };
    const content = sanitizeContent(payload.content);
    await getDb()
      .update(siteContent)
      .set({
        content: JSON.stringify(content),
        ownerEmail: auth.email,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(siteContent.id, 1));

    return Response.json({ content, saved: true });
  } catch {
    return Response.json(
      { error: "The site could not be published. Please try again." },
      { status: 500 },
    );
  }
}
