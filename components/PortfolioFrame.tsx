"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  tabIds,
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

const socialMarks: Record<string, string> = {
  instagram: "◎",
  youtube: "▶",
  linkedin: "in",
  github: "git",
};

export function PortfolioFrame({
  active,
  content,
}: {
  active: PageName;
  content: SiteContent;
}) {
  const initialTab = pageTab[active] ?? content.defaultTab;
  const [selectedTab, setSelectedTab] = useState<TabId>(initialTab);
  const [dark, setDark] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = saved ? saved === "dark" : prefersDark;
    setDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
  }, []);

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
      nextIndex = (index + 1) % tabIds.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabIds.length) % tabIds.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabIds.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    setSelectedTab(tabIds[nextIndex]);
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
          {dark ? "☀" : "◐"}
        </button>

        <section className="intro-column">
          <div>
            <h1>{content.greeting}</h1>
            <p className="bio-copy">{content.bio}</p>
            <ul className="fact-list">
              {content.facts.map((fact, index) => (
                <li key={`${fact}-${index}`}>{fact}</li>
              ))}
            </ul>
          </div>

          <nav className="social-row" aria-label="Social links">
            <a
              className="social-button"
              href={`mailto:${content.email}`}
              aria-label="Email"
              title="Email"
            >
              @
            </a>
            {content.socials.map((social, index) => {
              const key = social.label.toLowerCase();
              return (
                <a
                  className="social-button"
                  href={social.url || "#"}
                  key={`${social.label}-${index}`}
                  aria-label={social.label}
                  title={social.label}
                  target={social.url ? "_blank" : undefined}
                  rel={social.url ? "noreferrer" : undefined}
                  onClick={(event) => {
                    if (!social.url) event.preventDefault();
                  }}
                >
                  {socialMarks[key] ?? social.label.slice(0, 2).toLowerCase()}
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
            {tabIds.map((tab, index) => (
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
                <span aria-hidden="true">
                  {selectedTab === tab ? "→" : "·"}
                </span>
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          <div
            className="tab-panel"
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

function TabContent({
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
              <strong>{item.title}</strong>
              <span>{item.period}</span>
            </div>
            <p>{item.organization}</p>
            {item.description && <p>{item.description}</p>}
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
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer">
                  <strong>{item.title} ↗</strong>
                </a>
              ) : (
                <strong>{item.title}</strong>
              )}
              <span>{item.year}</span>
            </div>
            {item.description && <p>{item.description}</p>}
          </article>
        ))}
      </div>
    );
  }

  if (tab === "videos") {
    if (!content.videos.length) return <EmptyState />;
    return (
      <div className="link-list">
        {content.videos.map((item, index) => (
          <a
            href={item.url || "#"}
            target={item.url ? "_blank" : undefined}
            rel={item.url ? "noreferrer" : undefined}
            onClick={(event) => {
              if (!item.url) event.preventDefault();
            }}
            key={`${item.title}-${index}`}
          >
            <span>{item.title}</span>
            <span>{item.year || "↗"}</span>
          </a>
        ))}
      </div>
    );
  }

  if (tab === "gallery") {
    if (!content.photos.length) return <EmptyState />;
    return (
      <div className="mini-gallery">
        {content.photos.map((photo, index) => (
          <figure key={`${photo.title}-${index}`}>
            {photo.url ? (
              <img src={photo.url} alt={photo.title} />
            ) : (
              <div className="image-empty">{String(index + 1).padStart(2, "0")}</div>
            )}
            <figcaption>
              <span>{photo.title}</span>
              <span>{photo.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  if (!content.awards.length) return <EmptyState />;
  return (
    <div className="link-list">
      {content.awards.map((award, index) => (
        <div key={`${award.title}-${index}`}>
          <span>{award.title}</span>
          <span>{award.year}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return <p className="empty-state">nothing here yet.</p>;
}
