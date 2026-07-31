import { eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { defaultContent } from "@/lib/content";
import { ensureContentTable } from "@/lib/content-server";

export type EditorIdentity =
  | { ok: true; email: string }
  | { ok: false; status: 401 | 403 | 503; message: string };

export const EDITOR_COOKIE = "dylan-editor-session";

function isLocalRequest(request: Request) {
  const hostname = new URL(request.url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function editorPasswordConfigured() {
  return Boolean(env.EDITOR_PASSWORD && env.EDITOR_SESSION_TOKEN);
}

function cookieValue(cookieHeader: string, name: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export function requestHasEditorPasswordSession(request: Request) {
  if (isLocalRequest(request) && !editorPasswordConfigured()) return true;
  const value = cookieValue(request.headers.get("cookie") || "", EDITOR_COOKIE);
  return Boolean(
    value &&
      env.EDITOR_SESSION_TOKEN &&
      decodeURIComponent(value) === env.EDITOR_SESSION_TOKEN,
  );
}

export async function browserHasEditorPasswordSession() {
  if (!editorPasswordConfigured()) return false;
  const requestHeaders = await headers();
  const value = cookieValue(
    requestHeaders.get("cookie") || "",
    EDITOR_COOKIE,
  );
  return Boolean(
    value &&
      env.EDITOR_SESSION_TOKEN &&
      decodeURIComponent(value) === env.EDITOR_SESSION_TOKEN,
  );
}

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
}

export async function editorPasswordIsValid(value: string) {
  if (!env.EDITOR_PASSWORD) return false;
  const [provided, expected] = await Promise.all([
    digest(value),
    digest(env.EDITOR_PASSWORD),
  ]);
  return provided.every((byte, index) => byte === expected[index]);
}

export async function authorizeEditorIdentity(
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

export async function authorizeEditor(
  request: Request,
): Promise<EditorIdentity> {
  const identity = await authorizeEditorIdentity(request);
  if (!identity.ok) return identity;

  if (!editorPasswordConfigured()) {
    if (isLocalRequest(request)) return identity;
    return {
      ok: false,
      status: 503,
      message: "The editor password has not been configured.",
    };
  }

  if (!requestHasEditorPasswordSession(request)) {
    return {
      ok: false,
      status: 401,
      message: "Enter the editor password again.",
    };
  }

  return identity;
}
