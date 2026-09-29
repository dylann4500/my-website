import Link from "next/link";
import { Fragment } from "react";
import { RichText } from "@/components/RichText";
import type {
  Award,
  Project,
  ResumeEntry,
  SiteContent,
  Video,
} from "@/lib/content";
import { formatWritingDate, type WritingSummary } from "@/lib/writing";

type TextLink = { label: string; url: string };

function lines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

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

export function EmptyState() {
  return <p>nothing here yet.</p>;
}

function LinkRow({ links }: { links: TextLink[] }) {
  return (
    <>
      {links.map((link, index) => (
        <Fragment key={`${link.label}-${index}`}>
          {/* The no-break space keeps each dot attached to the link before it. */}
          {index > 0 && " · "}
          <a
            href={link.url}
            target={link.url.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.url.startsWith("mailto:") ? undefined : "noreferrer"}
          >
            {link.label}
          </a>
        </Fragment>
      ))}
    </>
  );
}

function EntryHeading({
  title,
  date,
  as: Heading = "h2",
}: {
  title: string;
  date: string;
  as?: "h2" | "h3";
}) {
  return (
    <Heading className="entry-heading">
      <span>{title}</span>
      {date && <span className="entry-date">{date}</span>}
    </Heading>
  );
}

function EntryText({ text }: { text: string }) {
  return text.trim() ? (
    <p className="entry-text">
      <RichText text={text.trim()} />
    </p>
  ) : null;
}

function BulletList({ items }: { items: string[] }) {
  return items.length ? (
    <ul className="bullet-list">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>
          <RichText text={item} />
        </li>
      ))}
    </ul>
  ) : null;
}

export function MeSection({ content }: { content: SiteContent }) {
  return (
    <div className="me">
      {content.portraitUrl && (
        <img className="me-portrait" src={content.portraitUrl} alt={content.name} />
      )}
      <div className="me-copy">
        <h1>{content.greeting}</h1>
        {content.bio && (
          <p>
            <RichText text={content.bio} />
          </p>
        )}
        <BulletList items={content.facts} />
      </div>
    </div>
  );
}

export function SocialLinks({ content }: { content: SiteContent }) {
  const email = content.email.trim();
  const links: TextLink[] = [
    ...(email
      ? [{
          label: email.toLowerCase().endsWith("@gmail.com") ? "gmail" : "email",
          url: `mailto:${email}`,
        }]
      : []),
    ...content.socials.filter((link) => link.label && link.url),
  ];
  return links.length ? (
    <p>
      <LinkRow links={links} />
    </p>
  ) : null;
}

export function CvSection({
  experience,
  awards,
  projects,
}: {
  experience: ResumeEntry[];
  awards: Award[];
  projects: Project[];
}) {
  if (!experience.length && !awards.length && !projects.length) return <EmptyState />;
  return (
    <>
      {experience.length > 0 && (
        <section className="cv-section">
          <h2 className="section-heading">work</h2>
          <div className="entries">
            {experience.map((entry, index) => (
              <article key={`${entry.organization}-${entry.title}-${index}`}>
                <EntryHeading as="h3" title={entry.organization} date={entry.period} />
                {entry.title && <p className="entry-role">{entry.title}</p>}
                <BulletList items={lines(entry.description)} />
              </article>
            ))}
          </div>
        </section>
      )}
      {awards.length > 0 && (
        <section className="cv-section">
          <h2 className="section-heading">awards</h2>
          <div className="entries">
            {awards.map((award, index) => (
              <article key={`${award.title}-${index}`}>
                <EntryHeading as="h3" title={award.title} date={award.year} />
                <EntryText text={award.description} />
                {award.details
                  .split(/\n\s*\n/)
                  .map(lines)
                  .filter((group) => group.length)
                  .map(([heading, ...results], groupIndex) => (
                    <div className="entry-group" key={`${heading}-${groupIndex}`}>
                      <p className="entry-group-heading">{heading}</p>
                      <BulletList items={results} />
                    </div>
                  ))}
              </article>
            ))}
          </div>
        </section>
      )}
      {projects.length > 0 && (
        <section className="cv-section" id="projects">
          <h2 className="section-heading">projects</h2>
          <ProjectsSection projects={projects} />
        </section>
      )}
    </>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  if (!projects.length) return <EmptyState />;
  return (
    <div className="entries">
      {projects.map((project, index) => {
        const links = [
          { label: "repo", url: project.sourceUrl },
          { label: "demo", url: project.demoUrl },
        ].filter((link) => link.url);
        return (
          <article key={`${project.title}-${index}`}>
            <EntryHeading as="h3" title={project.title} date={project.year} />
            <EntryText text={project.description} />
            {links.length > 0 && (
              <p className="entry-links">
                <LinkRow links={links} />
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}

export function VideosSection({ videos }: { videos: Video[] }) {
  if (!videos.length) return <EmptyState />;
  return (
    <div className="entries">
      {videos.map((video, index) => {
        const videoId = youtubeVideoId(video.url);
        const thumbnail = videoId ? (
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : null;
        return (
          <article className="video" key={`${video.title}-${index}`}>
            {video.url ? (
              <a
                className="video-thumbnail"
                href={video.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Watch ${video.title}`}
              >
                {thumbnail}
              </a>
            ) : (
              <div className="video-thumbnail">{thumbnail}</div>
            )}
            <div>
              <EntryHeading title={video.title} date={video.year} />
              <EntryText text={video.description} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function WritingList({ articles }: { articles: WritingSummary[] }) {
  if (!articles.length) return <EmptyState />;
  return (
    <ul className="writing-list">
      {articles.map((article) => (
        <li key={article.id}>
          <Link href={`/writing/${article.slug}`}>{article.title || "Untitled"}</Link>
          <time className="entry-date" dateTime={article.writtenAt}>
            {formatWritingDate(article.writtenAt)}
          </time>
        </li>
      ))}
    </ul>
  );
}
