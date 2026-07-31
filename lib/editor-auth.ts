import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

export const EDITOR_COOKIE = "dylan_portfolio_editor";
const SESSION_VALUE = "editor-session-v1";

export type EditorIdentity =
  | { ok: true }
  | { ok: false; status: 401 | 503; message: string };

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEqual(first: string, second: string) {
  return timingSafeEqual(digest(first), digest(second));
}

function sessionToken() {
  const secret = process.env.EDITOR_SESSION_SECRET;
  const password = process.env.EDITOR_PASSWORD;
  if (!secret || !password) return "";
  return createHmac("sha256", secret)
    .update(`${SESSION_VALUE}:${password}`)
    .digest("hex");
}

export function editorAuthConfigured() {
  return Boolean(
    process.env.EDITOR_PASSWORD && process.env.EDITOR_SESSION_SECRET,
  );
}

export function passwordIsValid(password: string) {
  const expected = process.env.EDITOR_PASSWORD;
  return Boolean(expected && safeEqual(password, expected));
}

export function requestHasEditorSession(request: Request) {
  const expected = sessionToken();
  if (!expected) return false;

  const cookieHeader = request.headers.get("cookie") || "";
  const value = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${EDITOR_COOKIE}=`))
    ?.slice(EDITOR_COOKIE.length + 1);

  return Boolean(value && safeEqual(decodeURIComponent(value), expected));
}

export async function browserHasEditorSession() {
  const expected = sessionToken();
  if (!expected) return false;
  const value = (await cookies()).get(EDITOR_COOKIE)?.value;
  return Boolean(value && safeEqual(value, expected));
}

export function createEditorSession() {
  return sessionToken();
}

export async function authorizeEditor(
  request: Request,
): Promise<EditorIdentity> {
  if (!editorAuthConfigured()) {
    return {
      ok: false,
      status: 503,
      message:
        "Editor authentication is not configured. Add EDITOR_PASSWORD and EDITOR_SESSION_SECRET.",
    };
  }

  if (!requestHasEditorSession(request)) {
    return {
      ok: false,
      status: 401,
      message: "Your editor session has expired. Sign in again.",
    };
  }

  return { ok: true };
}
