"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
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

const socialIcons: Record<string, string> = {
  instagram: "/icons/instagram.svg",
  youtube: "/icons/youtube.svg",
  linkedin: "/icons/linkedin.svg",
  github: "/icons/github.svg",
};

const socialFallbacks: Record<string, string> = {
  instagram: "https://www.instagram.com/nnguyen.dylann/",
  youtube: "https://www.youtube.com/@DylanNguyenn",
  linkedin: "https://www.linkedin.com/in/dylan-nguyen-b765482a8/",
  github: "https://github.com/dylann4500",
};

const emailFallback = "nguyennalyd3@gmail.com";

function linkedPhrase(
  text: string,
  phrase: string,
  href: string,
): ReactNode {
  const start = text.indexOf(phrase);
  if (start === -1) return text;

  return (
    <>
      {text.slice(0, start)}
      <a className="inline-link" href={href} target="_blank" rel="noreferrer">
        {phrase}
      </a>
      {text.slice(start + phrase.length)}
    </>
  );
}

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
            <p className="bio-copy">
              {linkedPhrase(
                content.bio,
                "fish",
                "https://en.wikipedia.org/wiki/Literature_(card_game)",
              )}
            </p>
            <ul className="fact-list">
              {content.facts.map((fact, index) => (
                <li key={`${fact}-${index}`}>
                  {fact.includes("typists")
                    ? linkedPhrase(
                        fact,
                        "typists",
                        "https://monkeytype.com/profile/dylann4500",
                      )
                    : fact.includes("aristocrat")
                      ? linkedPhrase(
                          fact,
                          "aristocrat",
                          "https://en.wikipedia.org/wiki/Aristocrat_Cipher",
                        )
                      : fact}
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
              <strong>{item.organization}</strong>
              <span>{item.period}</span>
            </div>
            <p className="entry-role">{item.title}</p>
            {item.description && (
              <ul className="entry-points">
                {item.description.split("\n").filter(Boolean).map((point) => (
                  <li key={point}>{point}</li>
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
    <div className="award-list">
      {content.awards.map((award, index) => (
        <article className="award-entry" key={`${award.title}-${index}`}>
          <div className="entry-heading">
            <strong>{award.title}</strong>
            <span>{award.year}</span>
          </div>
          {award.description && <p>{award.description}</p>}
          {award.details && (
            <div className="award-results">
              {award.details.split("\n\n").map((group) => {
                const [heading, ...items] = group.split("\n");
                return (
                  <section key={heading}>
                    <strong>{heading}</strong>
                    <ul>
                      {items.map((item) => (
                        <li key={item}>{item}</li>
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
