import type { Metadata } from "next";
import { PortfolioFrame } from "@/components/PortfolioFrame";
import { getPublishedContent } from "@/lib/content-server";
import { getPublishedWritingSummaries } from "@/lib/writing-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Photos",
};

export default async function PhotosPage() {
  const content = await getPublishedContent();
  const writing = content.writingVisible ? await getPublishedWritingSummaries() : [];
  return <PortfolioFrame active="photos" content={content} writing={writing} />;
}
