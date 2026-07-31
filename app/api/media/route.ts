import {
  handleUpload,
  type HandleUploadBody,
} from "@vercel/blob/client";
import { authorizeEditor } from "@/lib/editor-auth";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_BYTES = 50 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    if (body.type === "blob.generate-client-token") {
      const auth = await authorizeEditor(request);
      if (!auth.ok) {
        return Response.json(
          { error: auth.message },
          { status: auth.status },
        );
      }
    }

    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("portfolio/photos/")) {
          throw new Error("Invalid upload destination.");
        }
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_FILE_BYTES,
          addRandomSuffix: true,
          cacheControlMaxAge: 31_536_000,
        };
      },
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The image could not be uploaded.",
      },
      { status: 400 },
    );
  }
}
