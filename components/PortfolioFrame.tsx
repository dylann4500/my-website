import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  youtubeEmbedUrl,
  type SiteContent,
} from "@/lib/content";

type PageName = "home" | "projects" | "photos" | "videos" | "resume";

const navItems: { id: PageName; label: string; href: string }[] = [
  { id: "home", label: "Index", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "photos", label: "Photos", href: "/photos" },
  { id: "videos", label: "Videos", href: "/videos" },
  { id: "resume", label: "Résumé", href: "/resume" },
];

function Nav({ active, mobile = false }: { active: PageName; mobile?: boolean }) {
  return (
    <nav className={mobile ? "mobile-nav" : "main-nav"} aria-label="Main">
      {navItems.map((item) => (
        <a
          href={item.href}
          key={item.id}
          aria-current={active === item.id ? "page" : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="site-footer">
      <span>
        © {new Date().getFullYear()} {content.name} · {content.location}
      </span>
      <div className="social-links">
        {content.socials.map((social, index) => (
          <a
            href={social.url || "#"}
            key={`${social.label}-${index}`}
            target={social.url ? "_blank" : undefined}
            rel={social.url ? "noreferrer" : undefined}
          >
            {social.label}
          </a>
        ))}
        <a href={`mailto:${content.email}`}>Email</a>
      </div>
    </footer>
  );
}

export function PortfolioFrame({
  active,
  content,
}: {
  active: PageName;
  content: SiteContent;
}) {
  let view: ReactNode;

  if (active === "home") view = <HomeView content={content} />;
  else if (active === "projects") view = <ProjectsView content={content} />;
  else if (active === "photos") view = <PhotosView content={content} />;
  else if (active === "videos") view = <VideosView content={content} />;
  else view = <ResumeView content={content} />;

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label={`${content.name}, home`}>
          {content.name}
        </a>
        <Nav active={active} />
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </header>
      <Nav active={active} mobile />
      <main className="page-main">{view}</main>
      <Footer content={content} />
    </div>
  );
}

function HomeView({ content }: { content: SiteContent }) {
  return (
    <>
      <section className="home-hero">
        <p className="eyebrow">{content.eyebrow}</p>
        <div className="hero-copy">
          <h1 className="hero-title">{content.headline}</h1>
          <div className="hero-intro">
            <p>{content.intro}</p>
            <div>
              <p>{content.availability}</p>
              <a className="arrow-link" href={`mailto:${content.email}`}>
                Start a conversation ↗
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="featured-strip">
        <p className="section-kicker">Selected work</p>
        <div className="featured-list">
          {content.projects.slice(0, 4).map((project, index) => (
            <a
              className="featured-row"
              href={project.url || "/projects"}
              key={`${project.title}-${index}`}
            >
              <span className="project-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{project.title}</span>
              <span>{project.year}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

function PageHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-heading">
      <p className="section-kicker">{kicker}</p>
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </div>
    </header>
  );
}

function ProjectsView({ content }: { content: SiteContent }) {
  return (
    <>
      <PageHeading
        kicker="Selected work"
        title="Projects"
        description="A concise index of finished work, ongoing experiments, and collaborations."
      />
      <section className="project-list">
        {content.projects.map((project, index) => (
          <article className="project-card" key={`${project.title}-${index}`}>
            <span className="project-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>
            <a
              className="project-link"
              href={project.url || "#"}
              target={project.url ? "_blank" : undefined}
              rel={project.url ? "noreferrer" : undefined}
            >
              {project.url ? "View project ↗" : project.year}
            </a>
          </article>
        ))}
      </section>
    </>
  );
}

function PhotosView({ content }: { content: SiteContent }) {
  return (
    <>
      <PageHeading
        kicker="Ongoing archive"
        title="Photos"
        description="A changing collection of places, people, details, and things noticed along the way."
      />
      <section className="photo-grid">
        {content.photos.map((photo, index) => (
          <figure className="photo-card" key={`${photo.title}-${index}`}>
            <div className="photo-frame">
              {photo.url ? (
                <img src={photo.url} alt={photo.title} />
              ) : (
                <span className="photo-placeholder">
                  Image {String(index + 1).padStart(2, "0")}
                </span>
              )}
            </div>
            <figcaption className="photo-caption">
              <span>{photo.title}</span>
              <span>{photo.caption}</span>
            </figcaption>
          </figure>
        ))}
      </section>
    </>
  );
}

function VideosView({ content }: { content: SiteContent }) {
  return (
    <>
      <PageHeading
        kicker="Moving image"
        title="Videos"
        description="Films, conversations, and other moving-image work from YouTube and beyond."
      />
      <section className="video-list">
        {content.videos.map((video, index) => {
          const embedUrl = youtubeEmbedUrl(video.url);
          return (
            <article className="video-card" key={`${video.title}-${index}`}>
              <div className="video-frame">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <span className="play-mark" aria-hidden="true">
                    ▶
                  </span>
                )}
              </div>
              <div className="video-meta">
                <h2>{video.title}</h2>
                <span>{video.year}</span>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

function ResumeView({ content }: { content: SiteContent }) {
  return (
    <>
      <PageHeading
        kicker="Background"
        title="Résumé"
        description={content.about}
      />
      <section className="resume-layout">
        <aside className="resume-side">
          <p>{content.resumeSummary}</p>
          {content.resumeUrl && (
            <a
              className="arrow-link"
              href={content.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              Download PDF ↗
            </a>
          )}
        </aside>
        <div>
          <ResumeSection label="Experience" entries={content.experience} />
          <ResumeSection label="Education" entries={content.education} />
        </div>
      </section>
    </>
  );
}

function ResumeSection({
  label,
  entries,
}: {
  label: string;
  entries: SiteContent["experience"];
}) {
  return (
    <section className="resume-section">
      <p className="section-kicker">{label}</p>
      <div>
        {entries.map((entry, index) => (
          <article
            className="resume-entry"
            key={`${entry.title}-${entry.organization}-${index}`}
          >
            <h3>{entry.title}</h3>
            <p className="resume-company">{entry.organization}</p>
            <p className="resume-period">{entry.period}</p>
            <p>{entry.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
