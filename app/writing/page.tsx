import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getPublishedContent } from "@/lib/content-server";
import { formatWritingDate } from "@/lib/writing";
import { getPublishedWritingSummaries } from "@/lib/writing-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays and notes by Dylan.",
};

export default async function WritingPage() {
  const content = await getPublishedContent();
  if (!content.writingVisible) notFound();
  const articles = await getPublishedWritingSummaries();
  return (
    <main className="writing-public-shell">
      <header className="writing-public-nav">
        <Link href="/">← home</Link>
        <ThemeToggle />
      </header>
      <section className="writing-public-index">
        <h1>writing</h1>
        <p>essays, observations, and unfinished thoughts.</p>
        <div className="writing-public-list">
          {articles.length ? articles.map((article) => (
            <Link href={`/writing/${article.slug}`} key={article.id}>
              <strong>{article.title || "Untitled"}</strong>
              <span>{formatWritingDate(article.writtenAt)}</span>
            </Link>
          )) : <p>nothing here yet.</p>}
        </div>
      </section>
    </main>
  );
}
