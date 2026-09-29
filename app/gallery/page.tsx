import type { Metadata } from "next";
import { GalleryViewer } from "@/components/GalleryViewer";
import { SiteShell } from "@/components/SiteShell";
import { getPublishedContent } from "@/lib/content-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "gallery",
};

export default async function GalleryPage() {
  const { photos } = await getPublishedContent();
  // Picked on the server so the first photo is in the HTML and starts
  // downloading immediately; only that one original loads up front.
  // eslint-disable-next-line react-hooks/purity -- a new pick per visit is intended
  const initialIndex = Math.floor(Math.random() * photos.length);
  return (
    <SiteShell active="gallery" heading="gallery">
      <GalleryViewer photos={photos} initialIndex={initialIndex} />
    </SiteShell>
  );
}
