import { env } from "cloudflare:workers";
import { authorizeEditor } from "@/lib/editor-auth";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  try {
    const auth = await authorizeEditor(request);
    if (!auth.ok) {
      return Response.json(
        { error: auth.message },
        { status: auth.status },
      );
    }

    const data = await request.formData();
    const file = data.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "Choose an image first." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return Response.json(
        { error: "Use a JPEG, PNG, WebP, or GIF image." },
        { status: 415 },
      );
    }
    if (file.size > 12 * 1024 * 1024) {
      return Response.json(
        { error: "Images must be smaller than 12 MB." },
        { status: 413 },
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const key = `${crypto.randomUUID()}.${extension}`;
    await env.MEDIA.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
      customMetadata: { owner: auth.email },
    });

    return Response.json({ url: `/api/media/${key}` }, { status: 201 });
  } catch {
    return Response.json(
      { error: "The image could not be uploaded." },
      { status: 500 },
    );
  }
}
