import type { Metadata } from "next";
import { PortfolioFrame } from "@/components/PortfolioFrame";
import { getPublishedContent } from "@/lib/content-server";
import { getPublishedWritingSummaries } from "@/lib/writing-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Résumé",
};

export default async function ResumePage() {
  const content = await getPublishedContent();
  const writing = content.writingVisible ? await getPublishedWritingSummaries() : [];
  return <PortfolioFrame active="resume" content={content} writing={writing} />;
}
