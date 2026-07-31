import { NextResponse } from "next/server";
import {
  createEditorSession,
  EDITOR_COOKIE,
  editorAuthConfigured,
  passwordIsValid,
} from "@/lib/editor-auth";

export async function POST(request: Request) {
  if (!editorAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Editor authentication is not configured. Add EDITOR_PASSWORD and EDITOR_SESSION_SECRET in Vercel.",
      },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as { password?: unknown };
  const password =
    typeof payload.password === "string" ? payload.password.slice(0, 500) : "";
  if (!passwordIsValid(password)) {
    return NextResponse.json(
      { error: "That password is incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ signedIn: true });
  response.cookies.set(EDITOR_COOKIE, createEditorSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
