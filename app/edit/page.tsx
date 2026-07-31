import type { Metadata } from "next";
import { headers } from "next/headers";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { EditorApp } from "@/components/EditorApp";
import { EditorPasswordGate } from "@/components/EditorPasswordGate";
import { getPublishedContent } from "@/lib/content-server";
import {
  browserHasEditorPasswordSession,
  editorPasswordConfigured,
} from "@/lib/editor-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site editor",
  robots: { index: false, follow: false },
};

async function EditorGate() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  if (!isLocal) await requireChatGPTUser("/edit");
  if (
    !isLocal &&
    (!editorPasswordConfigured() ||
      !(await browserHasEditorPasswordSession()))
  ) {
    return (
      <EditorPasswordGate configured={editorPasswordConfigured()} />
    );
  }

  const content = await getPublishedContent();
  return <EditorApp initialContent={content} />;
}

export default function EditorPage() {
  return <EditorGate />;
}
