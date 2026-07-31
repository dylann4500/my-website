import { authorizeEditor } from "@/lib/editor-auth";
import {
  getPublishedContent,
  savePublishedContent,
} from "@/lib/content-server";

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
    const content = await savePublishedContent(payload.content);

    return Response.json({ content, saved: true });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The site could not be published. Please try again.",
      },
      { status: 500 },
    );
  }
}
