"use client";

import { useEffect, useRef, useState } from "react";
import { RichText } from "@/components/RichText";
import { EmptyState } from "@/components/SiteSections";
import type { Photo } from "@/lib/content";
import { shuffledOrder } from "@/lib/gallery";

type Connection = { saveData?: boolean; effectiveType?: string };

function onSlowConnection() {
  const connection = (navigator as Navigator & { connection?: Connection })
    .connection;
  return Boolean(
    connection?.saveData ||
      ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? ""),
  );
}

export function GalleryViewer({
  photos,
  initialIndex = 0,
}: {
  photos: Photo[];
  initialIndex?: number;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const [loading, setLoading] = useState(false);
  const queue = useRef<number[]>([]);
  const imageRef = useRef<HTMLImageElement | null>(null);
  // Holds the next original while it downloads so it can be shown instantly.
  const upcoming = useRef<{ index: number; ready: Promise<void> } | null>(null);
  const index = Math.min(Math.max(current, 0), photos.length - 1);

  function upcomingIndex() {
    queue.current = queue.current.filter(
      (item) => item < photos.length && item !== index,
    );
    if (!queue.current.length) {
      queue.current = shuffledOrder(photos.length, index);
    }
    return queue.current[0];
  }

  function preload(nextIndex: number) {
    if (upcoming.current?.index !== nextIndex) {
      const image = new Image();
      image.src = photos[nextIndex].url;
      // decode() settles once the full file is downloaded and decoded; a
      // broken image still advances so the gallery never gets stuck.
      upcoming.current = {
        index: nextIndex,
        ready: image.decode().catch(() => undefined),
      };
    }
    return upcoming.current.ready;
  }

  function prefetchUpcoming() {
    if (photos.length < 2 || onSlowConnection()) return;
    void preload(upcomingIndex());
  }

  async function showNext() {
    if (loading || photos.length < 2) return;
    const nextIndex = upcomingIndex();
    queue.current.shift();
    setLoading(true);
    await preload(nextIndex);
    setCurrent(nextIndex);
    setLoading(false);
  }

  useEffect(() => {
    // The server-rendered photo can finish loading before hydration, in which
    // case its onLoad never reaches React.
    if (imageRef.current?.complete) prefetchUpcoming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!photos.length) return <EmptyState />;
  const photo = photos[index];

  return (
    <div className="gallery">
      {photos.length > 1 && (
        <button
          className="link-button"
          type="button"
          onClick={() => void showNext()}
          aria-controls="gallery-photo"
        >
          new image
        </button>
      )}
      <figure className="gallery-photo" id="gallery-photo" aria-busy={loading}>
        {photo.url && (
          <img
            ref={imageRef}
            src={photo.url}
            alt={photo.title}
            fetchPriority="high"
            onLoad={prefetchUpcoming}
          />
        )}
        <figcaption aria-live="polite">
          <span>{[photo.title, photo.date].filter(Boolean).join(" · ")}</span>
          {photo.description && (
            <span className="gallery-description">
              <RichText text={photo.description} />
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
