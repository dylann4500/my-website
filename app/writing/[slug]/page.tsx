import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WritingArticleView } from "@/components/WritingArticleView";
import { getPublishedContent } from "@/lib/content-server";
import { getPublishedWritingArticle } from "@/lib/writing-server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const content = await getPublishedContent();
  if (!content.writingVisible) return { title: "Not found", robots: { index: false } };
  const article = await getPublishedWritingArticle((await params).slug);
  if (!article) return { title: "Not found", robots: { index: false } };
  const description = article.blocks.find((block) => block.type === "paragraph" && block.text.trim())?.text.slice(0, 155)
    || "An essay by Dylan.";
  return {
    title: article.title || "Untitled",
    description,
    openGraph: { title: article.title || "Untitled", description, images: [] },
    twitter: { card: "summary", title: article.title || "Untitled", description, images: [] },
  };
}

export default async function WritingArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const content = await getPublishedContent();
  if (!content.writingVisible) notFound();
  const article = await getPublishedWritingArticle((await params).slug);
  if (!article) notFound();
  return (
    <main className="writing-public-shell">
      <header className="writing-public-nav">
        <Link href="/writing">← writing</Link>
        <ThemeToggle />
      </header>
      <WritingArticleView article={article} />
    </main>
  );
}
