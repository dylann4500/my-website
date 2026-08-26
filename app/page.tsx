import { PortfolioFrame } from "@/components/PortfolioFrame";
import { getPublishedContent } from "@/lib/content-server";
import { getPublishedWritingSummaries } from "@/lib/writing-server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPublishedContent();
  const writing = content.writingVisible ? await getPublishedWritingSummaries() : [];
  return <PortfolioFrame active="home" content={content} writing={writing} />;
}
