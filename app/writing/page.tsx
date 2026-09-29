import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { WritingList } from "@/components/SiteSections";
import { getPublishedWritingSummaries } from "@/lib/writing-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "writing",
  description: "Essays and notes by Dylan.",
};

export default async function WritingPage() {
  const articles = await getPublishedWritingSummaries();
  return (
    <SiteShell active="writing" heading="writing">
      <p className="writing-intro">
        you found me! below are some of my unfiltered thoughts.
      </p>
      <WritingList articles={articles} />
    </SiteShell>
  );
}
