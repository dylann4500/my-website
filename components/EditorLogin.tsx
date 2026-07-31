"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export function EditorLogin({
  configured,
}: {
  configured: boolean;
}) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/editor-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Could not sign in.");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not sign in.");
      setSubmitting(false);
    }
  }

  return (
    <main className="editor-login-shell">
      <form className="editor-login-card" onSubmit={signIn}>
        <div>
          <h1>site editor</h1>
          <p>
            {configured
              ? "enter your editor password."
              : "editor setup is incomplete."}
          </p>
        </div>
        {configured ? (
          <>
            <label>
              password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoFocus
              />
            </label>
            <button type="submit" disabled={submitting || !password}>
              {submitting ? "signing in…" : "sign in"}
            </button>
          </>
        ) : (
          <p className="editor-login-setup">
            Add <code>EDITOR_PASSWORD</code> and{" "}
            <code>EDITOR_SESSION_SECRET</code> in Vercel, then redeploy.
          </p>
        )}
        {message && <p className="editor-login-error">{message}</p>}
        <Link href="/">← back to site</Link>
      </form>
    </main>
  );
}
