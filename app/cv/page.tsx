import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { CvSection } from "@/components/SiteSections";
import { getPublishedContent } from "@/lib/content-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "cv",
};

export default async function CvPage() {
  const content = await getPublishedContent();
  return (
    <SiteShell active="cv" heading="cv">
      <CvSection
        experience={content.experience}
        awards={content.awards}
        projects={content.projects}
      />
    </SiteShell>
  );
}
