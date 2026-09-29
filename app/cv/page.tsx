import type { Metadata } from "next";
import { CvSectionRail, type CvSectionId } from "@/components/CvSectionRail";
import { SiteShell } from "@/components/SiteShell";
import { CvSection } from "@/components/SiteSections";
import { getPublishedContent } from "@/lib/content-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "cv",
};

export default async function CvPage() {
  const content = await getPublishedContent();
  const sections: CvSectionId[] = [];
  if (content.experience.length) sections.push("work");
  if (content.awards.length) sections.push("awards");
  if (content.projects.length) sections.push("projects");

  return (
    <SiteShell active="cv" heading="cv">
      <CvSectionRail sections={sections} />
      <CvSection
        experience={content.experience}
        awards={content.awards}
        projects={content.projects}
      />
    </SiteShell>
  );
}
