import { PortfolioFrame } from "@/components/PortfolioFrame";
import { getPublishedContent } from "@/lib/content-server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPublishedContent();
  return <PortfolioFrame active="home" content={content} />;
}
