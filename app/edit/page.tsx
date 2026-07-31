import type { Metadata } from "next";
import { EditorApp } from "@/components/EditorApp";
import { EditorLogin } from "@/components/EditorLogin";
import { getPublishedContent } from "@/lib/content-server";
import {
  browserHasEditorSession,
  editorAuthConfigured,
} from "@/lib/editor-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site editor",
  robots: { index: false, follow: false },
};

async function EditorGate() {
  const configured = editorAuthConfigured();
  if (!configured || !(await browserHasEditorSession())) {
    return <EditorLogin configured={configured} />;
  }

  const content = await getPublishedContent();
  return <EditorApp initialContent={content} />;
}

export default function EditorPage() {
  return <EditorGate />;
}
