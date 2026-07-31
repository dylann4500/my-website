import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import {
  authorizeEditorIdentity,
  EDITOR_COOKIE,
  editorPasswordConfigured,
  editorPasswordIsValid,
} from "@/lib/editor-auth";

export async function POST(request: Request) {
  const identity = await authorizeEditorIdentity(request);
  if (!identity.ok) {
    return NextResponse.json(
      { error: identity.message },
      { status: identity.status },
    );
  }

  if (!editorPasswordConfigured()) {
    return NextResponse.json(
      { error: "The editor password has not been configured." },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as { password?: unknown };
  const password =
    typeof payload.password === "string" ? payload.password.slice(0, 500) : "";
  if (!(await editorPasswordIsValid(password))) {
    return NextResponse.json(
      { error: "That password is incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ signedIn: true });
  response.cookies.set(EDITOR_COOKIE, env.EDITOR_SESSION_TOKEN, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ signedOut: true });
  response.cookies.set(EDITOR_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
