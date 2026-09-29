import { SiteShell } from "@/components/SiteShell";
import { MeSection, SocialLinks } from "@/components/SiteSections";
import { getPublishedContent } from "@/lib/content-server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPublishedContent();
  return (
    <SiteShell active="me" footer={<SocialLinks content={content} />}>
      <MeSection content={content} />
    </SiteShell>
  );
}
