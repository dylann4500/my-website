import { env } from "cloudflare:workers";
import { authorizeEditor } from "@/lib/editor-auth";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_FILE_BYTES = 50 * 1024 * 1024;
const MAX_CHUNK_BYTES = 1.5 * 1024 * 1024;
const MAX_PARTS = 40;

type UploadManifest = {
  contentType: string;
  fileName: string;
  size: number;
  chunks: string[];
};

function safeExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() || "jpg";
  return /^[a-z0-9]{1,8}$/.test(extension) ? extension : "jpg";
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

    const action = new URL(request.url).searchParams.get("action");
    const payload = (await request.json()) as {
      contentType?: string;
      fileName?: string;
      key?: string;
      uploadId?: string;
      size?: number;
      parts?: number;
    };

    if (action === "create") {
      const contentType = payload.contentType || "";
      const fileName = payload.fileName || "photo.jpg";
      const size = Number(payload.size || 0);
      const parts = Number(payload.parts || 0);

      if (!ALLOWED_TYPES.has(contentType)) {
        return Response.json(
          { error: "Use a JPEG, PNG, WebP, or GIF image." },
          { status: 415 },
        );
      }
      if (size <= 0 || size > MAX_FILE_BYTES) {
        return Response.json(
          { error: "Images must be smaller than 50 MB." },
          { status: 413 },
        );
      }
      if (parts <= 0 || parts > MAX_PARTS) {
        return Response.json(
          { error: "This image requires too many upload pieces." },
          { status: 413 },
        );
      }

      const uploadId = crypto.randomUUID();
      const key = `${crypto.randomUUID()}.${safeExtension(fileName)}`;
      return Response.json({ key, uploadId });
    }

    if (action === "complete") {
      const key = payload.key || "";
      const uploadId = payload.uploadId || "";
      const contentType = payload.contentType || "";
      const fileName = payload.fileName || "photo";
      const size = Number(payload.size || 0);
      const parts = Number(payload.parts || 0);

      if (
        !/^[a-zA-Z0-9._-]+$/.test(key) ||
        !/^[a-zA-Z0-9-]+$/.test(uploadId) ||
        !ALLOWED_TYPES.has(contentType) ||
        parts <= 0 ||
        parts > MAX_PARTS
      ) {
        return Response.json({ error: "Invalid upload." }, { status: 400 });
      }

      const chunks = Array.from(
        { length: parts },
        (_, index) => `__chunks/${uploadId}/${index + 1}`,
      );
      let storedSize = 0;
      for (const chunk of chunks) {
        const object = await env.MEDIA.head(chunk);
        if (!object) {
          return Response.json(
            { error: "One upload piece is missing. Please try again." },
            { status: 409 },
          );
        }
        storedSize += object.size;
      }
      if (storedSize !== size) {
        return Response.json(
          { error: "The uploaded image was incomplete. Please try again." },
          { status: 409 },
        );
      }

      const manifest: UploadManifest = {
        contentType,
        fileName,
        size,
        chunks,
      };
      await env.MEDIA.put(key, JSON.stringify(manifest), {
        httpMetadata: { contentType: "application/json" },
        customMetadata: {
          owner: auth.email,
          chunked: "true",
          originalType: contentType,
        },
      });

      return Response.json({ url: `/api/media/${key}` }, { status: 201 });
    }

    return Response.json({ error: "Unknown upload action." }, { status: 400 });
  } catch {
    return Response.json(
      { error: "The image could not be uploaded." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await authorizeEditor(request);
    if (!auth.ok) {
      return Response.json(
        { error: auth.message },
        { status: auth.status },
      );
    }

    const params = new URL(request.url).searchParams;
    const uploadId = params.get("uploadId") || "";
    const part = Number(params.get("part") || 0);
    if (
      !/^[a-zA-Z0-9-]+$/.test(uploadId) ||
      part <= 0 ||
      part > MAX_PARTS
    ) {
      return Response.json({ error: "Invalid upload piece." }, { status: 400 });
    }

    const chunk = await request.arrayBuffer();
    if (chunk.byteLength <= 0 || chunk.byteLength > MAX_CHUNK_BYTES) {
      return Response.json(
        { error: "Invalid upload piece size." },
        { status: 413 },
      );
    }

    await env.MEDIA.put(`__chunks/${uploadId}/${part}`, chunk, {
      httpMetadata: { contentType: "application/octet-stream" },
      customMetadata: { owner: auth.email },
    });
    return Response.json({ uploaded: true, part });
  } catch {
    return Response.json(
      { error: "An upload piece could not be stored." },
      { status: 500 },
    );
  }
}
