import type { Metadata } from "next";
import { PortfolioFrame } from "@/components/PortfolioFrame";
import { getPublishedContent } from "@/lib/content-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos",
};

export default async function VideosPage() {
  const content = await getPublishedContent();
  return <PortfolioFrame active="videos" content={content} />;
}
