import { authorizeEditor } from "@/lib/editor-auth";
import {
  deleteWritingArticle,
  getAllWritingArticles,
  saveWritingArticle,
} from "@/lib/writing-server";

export async function GET(request: Request) {
  const auth = await authorizeEditor(request);
  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }
  return Response.json({ articles: await getAllWritingArticles() });
}

export async function POST(request: Request) {
  try {
    const auth = await authorizeEditor(request);
    if (!auth.ok) {
      return Response.json({ error: auth.message }, { status: auth.status });
    }
    const raw = await request.text();
    if (raw.length > 1_500_000) {
      return Response.json({ error: "This piece is too large." }, { status: 413 });
    }
    const payload = JSON.parse(raw) as { article?: unknown };
    const article = await saveWritingArticle(payload.article);
    return Response.json({ article, saved: true });
  } catch {
    return Response.json(
      { error: "This piece could not be saved. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await authorizeEditor(request);
    if (!auth.ok) {
      return Response.json({ error: auth.message }, { status: auth.status });
    }
    const id = new URL(request.url).searchParams.get("id") || "";
    if (!/^[a-zA-Z0-9-]{1,100}$/.test(id)) {
      return Response.json({ error: "Invalid piece." }, { status: 400 });
    }
    await deleteWritingArticle(id);
    return Response.json({ deleted: true });
  } catch {
    return Response.json(
      { error: "This piece could not be deleted." },
      { status: 500 },
    );
  }
}
