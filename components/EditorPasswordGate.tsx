"use client";

import { useState, type FormEvent } from "react";

export function EditorPasswordGate({
  configured,
}: {
  configured: boolean;
}) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function unlock(event: FormEvent<HTMLFormElement>) {
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
      if (!response.ok) throw new Error(result.error || "Could not unlock.");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not unlock.");
      setSubmitting(false);
    }
  }

  return (
    <main className="editor-password-shell">
      <form className="editor-password-card" onSubmit={unlock}>
        <div>
          <h1>site editor</h1>
          <p>
            {configured
              ? "enter your editor password."
              : "the editor password is not configured yet."}
          </p>
        </div>
        {configured && (
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
              {submitting ? "unlocking…" : "unlock"}
            </button>
          </>
        )}
        {message && <p className="editor-password-error">{message}</p>}
        <a href="/">← back to site</a>
      </form>
    </main>
  );
}
