import { env } from "cloudflare:workers";

type UploadManifest = {
  contentType: string;
  fileName: string;
  size: number;
  chunks: string[];
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string }> },
) {
  const { key } = await context.params;
  if (!/^[a-zA-Z0-9._-]+$/.test(key)) {
    return new Response("Not found", { status: 404 });
  }

  const object = await env.MEDIA.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");

  if (object.customMetadata?.chunked !== "true") {
    object.writeHttpMetadata(headers);
    return new Response(object.body, { headers });
  }

  const manifest = JSON.parse(await object.text()) as UploadManifest;
  headers.set("content-type", manifest.contentType);
  headers.set("content-length", String(manifest.size));
  headers.set(
    "content-disposition",
    `inline; filename="${manifest.fileName.replace(/["\r\n]/g, "")}"`,
  );

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (const chunkKey of manifest.chunks) {
          const chunk = await env.MEDIA.get(chunkKey);
          if (!chunk) throw new Error("Missing image chunk");
          const reader = chunk.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(body, { headers });
}
