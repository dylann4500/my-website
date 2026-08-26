import type { Metadata } from "next";
import { headers } from "next/headers";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { EditorPasswordGate } from "@/components/EditorPasswordGate";
import { WritingEditor } from "@/components/WritingEditor";
import { getPublishedContent } from "@/lib/content-server";
import {
  browserHasEditorPasswordSession,
  editorPasswordConfigured,
} from "@/lib/editor-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing editor",
  robots: { index: false, follow: false },
};

async function WritingEditorGate() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  if (!isLocal) await requireChatGPTUser("/edit/writing");
  if (!isLocal && (!editorPasswordConfigured() || !(await browserHasEditorPasswordSession()))) {
    return <EditorPasswordGate configured={editorPasswordConfigured()} />;
  }
  const content = await getPublishedContent();
  return <WritingEditor writingVisible={content.writingVisible} />;
}

export default function WritingEditorPage() {
  return <WritingEditorGate />;
}
