"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { RichText } from "@/components/RichText";
import {
  tabIds,
  type Photo,
  type SiteContent,
  type TabId,
} from "@/lib/content";

type PageName = "home" | "projects" | "photos" | "videos" | "resume";

const tabLabels: Record<TabId, string> = {
  experience: "experience",
  projects: "projects",
  videos: "videos",
  gallery: "gallery",
  awards: "awards",
};

const pageTab: Record<PageName, TabId | null> = {
  home: null,
  projects: "projects",
  photos: "gallery",
  videos: "videos",
  resume: "experience",
};

const socialIcons: Record<string, string> = {
  instagram: "/icons/instagram.svg",
  youtube: "/icons/youtube.svg",
  linkedin: "/icons/linkedin.svg",
  github: "/icons/github.svg",
  x: "/icons/x.svg",
};

const socialFallbacks: Record<string, string> = {
  instagram: "https://www.instagram.com/nnguyen.dylann/",
  youtube: "https://www.youtube.com/@DylanNguyenn",
  linkedin: "https://www.linkedin.com/in/dylan-nguyen-b765482a8/",
  github: "https://github.com/dylann4500",
  x: "https://x.com/dylann4500",
};

const emailFallback = "nguyennalyd3@gmail.com";

const textSymbols = {
  sun: "\u2600\uFE0E",
  halfCircle: "\u25D0\uFE0E",
  rightArrow: "\u2192\uFE0E",
  externalArrow: "\u2197\uFE0E",
};

function youtubeVideoId(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
    if (!["youtube.com", "m.youtube.com"].includes(host)) return "";
    if (url.pathname === "/watch") return url.searchParams.get("v") || "";
    const [section, id] = url.pathname.split("/").filter(Boolean);
    return ["shorts", "embed", "live"].includes(section) ? id || "" : "";
  } catch {
    return "";
  }
}

export function PortfolioFrame({
  active,
  content,
}: {
  active: PageName;
  content: SiteContent;
}) {
  const publicTabs: TabId[] = [...tabIds];
  const requestedTab = pageTab[active] ?? content.defaultTab;
  const initialTab = publicTabs.includes(requestedTab)
    ? requestedTab
    : "experience";
  const [selectedTab, setSelectedTab] = useState<TabId>(initialTab);
  const [dark, setDark] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = saved ? saved === "dark" : prefersDark;
    // The saved browser theme is only available after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
  }, []);

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [selectedTab]);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    window.localStorage.setItem(
      "portfolio-theme",
      nextDark ? "dark" : "light",
    );
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % publicTabs.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + publicTabs.length) % publicTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = publicTabs.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    setSelectedTab(publicTabs[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <main className="personal-page">
      <section className="personal-index" aria-label={`${content.name}'s personal website`}>
        <button
          className="mode-button"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
          title={`Switch to ${dark ? "light" : "dark"} mode`}
        >
          <span className="ui-symbol" aria-hidden="true">
            {dark ? textSymbols.sun : textSymbols.halfCircle}
          </span>
        </button>

        <section className="intro-column">
          <div>
            <h1>{content.greeting}</h1>
            <p className="bio-copy"><RichText text={content.bio} /></p>
            <ul className="fact-list">
              {content.facts.map((fact, index) => (
                <li key={`${fact}-${index}`}>
                  <RichText text={fact} />
                </li>
              ))}
            </ul>
          </div>

          <nav className="social-row" aria-label="Social links">
            <a
              className="social-button"
              href={`mailto:${content.email || emailFallback}`}
              aria-label="Email"
              title="Email"
            >
              <img src="/icons/gmail.svg" alt="" aria-hidden="true" />
            </a>
            {content.socials.map((social, index) => {
              const key = social.label.toLowerCase();
              const url = social.url || socialFallbacks[key] || "";
              return (
                <a
                  className="social-button"
                  href={url || "#"}
                  key={`${social.label}-${index}`}
                  aria-label={social.label}
                  title={social.label}
                  target={url ? "_blank" : undefined}
                  rel={url ? "noreferrer" : undefined}
                  onClick={(event) => {
                    if (!url) event.preventDefault();
                  }}
                >
                  {socialIcons[key] ? (
                    <img src={socialIcons[key]} alt="" aria-hidden="true" />
                  ) : (
                    social.label.slice(0, 2).toLowerCase()
                  )}
                </a>
              );
            })}
          </nav>
        </section>

        <section className="content-column">
          <div
            className="tab-list"
            role="tablist"
            aria-label="Portfolio sections"
            aria-orientation="vertical"
          >
            {publicTabs.map((tab, index) => (
              <button
                type="button"
                role="tab"
                id={`tab-${tab}`}
                aria-controls={`panel-${tab}`}
                aria-selected={selectedTab === tab}
                tabIndex={selectedTab === tab ? 0 : -1}
                className="tab-button"
                key={tab}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                onClick={() => setSelectedTab(tab)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                <span className="ui-symbol" aria-hidden="true">
                  {selectedTab === tab ? textSymbols.rightArrow : "·"}
                </span>
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          <div
            className="tab-panel"
            ref={panelRef}
            role="tabpanel"
            id={`panel-${selectedTab}`}
            aria-labelledby={`tab-${selectedTab}`}
            tabIndex={0}
          >
            <TabContent tab={selectedTab} content={content} />
          </div>
        </section>
      </section>
    </main>
  );
}

export function TabContent({
  tab,
  content,
}: {
  tab: TabId;
  content: SiteContent;
}) {
  if (tab === "experience") {
    if (!content.experience.length) return <EmptyState />;
    return (
      <div className="text-list">
        {content.experience.map((item, index) => (
          <article className="text-entry" key={`${item.title}-${index}`}>
            <div className="entry-heading">
              <strong>{item.organization}</strong>
              <span>{item.period}</span>
            </div>
            <p className="entry-role">{item.title}</p>
            {item.description && (
              <ul className="entry-points">
                {item.description.split("\n").filter(Boolean).map((point) => (
                  <li key={point}><RichText text={point} /></li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    );
  }

  if (tab === "projects") {
    if (!content.projects.length) return <EmptyState />;
    return (
      <div className="text-list">
        {content.projects.map((item, index) => (
          <article className="text-entry" key={`${item.title}-${index}`}>
            <div className="entry-heading">
              <strong>{item.title}</strong>
              <span>{item.year}</span>
            </div>
            {item.description && <p><RichText text={item.description} /></p>}
            {(item.demoUrl || item.sourceUrl) && (
              <div className="project-links" aria-label={`${item.title} links`}>
                {item.demoUrl && (
                  <a href={item.demoUrl} target="_blank" rel="noreferrer">
                    demo video{" "}
                    <span className="ui-symbol" aria-hidden="true">
                      {textSymbols.externalArrow}
                    </span>
                  </a>
                )}
                {item.sourceUrl && (
                  <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                    source code{" "}
                    <span className="ui-symbol" aria-hidden="true">
                      {textSymbols.externalArrow}
                    </span>
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    );
  }

  if (tab === "videos") {
    if (!content.videos.length) return <EmptyState />;
    return (
      <div className="video-list">
        {content.videos.map((item, index) => {
          const videoId = youtubeVideoId(item.url);
          const thumbnail = videoId
            ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
            : "";
          return (
            <article className="video-entry" key={`${item.title}-${index}`}>
              <a
                className="video-thumbnail"
                href={item.url || "#"}
                target={item.url ? "_blank" : undefined}
                rel={item.url ? "noreferrer" : undefined}
                onClick={(event) => {
                  if (!item.url) event.preventDefault();
                }}
                aria-label={`Watch ${item.title}`}
              >
                {thumbnail ? (
                  <img src={thumbnail} alt="" aria-hidden="true" />
                ) : (
                  <span>youtube url</span>
                )}
              </a>
              <div className="video-copy">
                <div className="entry-heading">
                  <strong>{item.title}</strong>
                  <span>{item.year}</span>
                </div>
                {item.description && (
                  <p><RichText text={item.description} /></p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  if (tab === "gallery") {
    if (!content.photos.length) return <EmptyState />;
    return <GalleryContent photos={content.photos} />;
  }

  if (!content.awards.length) return <EmptyState />;
  return (
    <div className="award-list">
      {content.awards.map((award, index) => (
        <article className="award-entry" key={`${award.title}-${index}`}>
          <div className="entry-heading">
            <strong>{award.title}</strong>
            <span>{award.year}</span>
          </div>
          {award.description && <p><RichText text={award.description} /></p>}
          {award.details && (
            <div className="award-results">
              {award.details.split("\n\n").map((group) => {
                const [heading, ...items] = group.split("\n");
                return (
                  <section key={heading}>
                    <strong>{heading}</strong>
                    <ul>
                      {items.map((item) => (
                        <li key={item}><RichText text={item} /></li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function EmptyState() {
  return <p className="empty-state">nothing here yet.</p>;
}

function GalleryContent({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selected]);

  return (
    <>
      <p className="gallery-guide">
        <span>click a photo to learn more</span>
        <span aria-hidden="true">·</span>
        <span><span className="camera-dagger" aria-hidden="true">†</span> taken on Nikon D610</span>
      </p>
      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <button
            className="gallery-item"
            type="button"
            onClick={() => setSelected(photo)}
            key={`${photo.title}-${index}`}
            aria-label={`Open ${photo.title || `photo ${index + 1}`}`}
          >
            {photo.url ? (
              <img src={photo.url} alt={photo.title} />
            ) : (
              <span className="image-empty">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title || "Photo details"}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div className="gallery-lightbox-card">
            <button
              className="gallery-close"
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close photo"
            >
              ×
            </button>
            {selected.url && (
              <img src={selected.url} alt={selected.title} />
            )}
            <div className="gallery-meta">
              <div className="entry-heading">
                <strong>
                  {selected.title}
                  {selected.takenOnD610 && (
                    <sup
                      className="camera-dagger"
                      aria-label=" — taken on Nikon D610"
                      title="Taken on Nikon D610"
                    >
                      †
                    </sup>
                  )}
                </strong>
                <span>{selected.date}</span>
              </div>
              {selected.description && (
                <p><RichText text={selected.description} /></p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
