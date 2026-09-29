import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { WritingArticleView } from "@/components/WritingArticleView";
import { plainText } from "@/lib/rich-text";
import { getPublishedWritingArticle } from "@/lib/writing-server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const article = await getPublishedWritingArticle((await params).slug);
  if (!article) return { title: "Not found", robots: { index: false, follow: false } };
  const firstParagraph = article.blocks.find((block) => block.type === "paragraph" && block.text.trim());
  const description = (firstParagraph && plainText(firstParagraph.text).slice(0, 155))
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
  const article = await getPublishedWritingArticle((await params).slug);
  if (!article) notFound();
  return (
    <SiteShell backHref="/writing">
      <WritingArticleView article={article} />
    </SiteShell>
  );
}
