import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { ProjectsSection } from "@/components/SiteSections";
import { getPublishedContent } from "@/lib/content-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "projects",
};

export default async function ProjectsPage() {
  const content = await getPublishedContent();
  return (
    <SiteShell active="projects" heading="projects">
      <ProjectsSection projects={content.projects} />
    </SiteShell>
  );
}
