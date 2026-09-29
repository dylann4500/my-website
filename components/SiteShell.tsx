import Link from "next/link";
import { Fragment, type ReactNode } from "react";

export const sitePages = [
  { id: "me", href: "/" },
  { id: "cv", href: "/cv" },
  { id: "projects", href: "/projects" },
  { id: "videos", href: "/videos" },
  { id: "writing", href: "/writing" },
  { id: "gallery", href: "/gallery" },
] as const;

export type SitePageId = (typeof sitePages)[number]["id"];

function SiteNav({
  active,
  onSelect,
}: {
  active?: SitePageId;
  onSelect?: (page: SitePageId) => void;
}) {
  return (
    <nav className="site-nav" aria-label="Pages">
      {sitePages.map((page) => (
        // Real spaces between items let narrow screens wrap the nav into
        // balanced lines instead of orphaning the last page.
        <Fragment key={page.id}>
          {page.id === active ? (
            <span aria-current="page">{page.id}</span>
          ) : onSelect ? (
            <button
              className="link-button"
              type="button"
              onClick={() => onSelect(page.id)}
            >
              {page.id}
            </button>
          ) : (
            <Link href={page.href}>{page.id}</Link>
          )}{" "}
        </Fragment>
      ))}
    </nav>
  );
}

export function SiteShell({
  active,
  backHref,
  heading,
  footer,
  onSelect,
  children,
}: {
  active?: SitePageId;
  // Replaces the navigation with a single "<< back" link, as on articles.
  backHref?: string;
  // Screen-reader title for pages whose visible content has no heading.
  heading?: string;
  // Pinned to the bottom of the screen when the page is shorter than it.
  footer?: ReactNode;
  // The editor preview switches pages in place instead of navigating.
  onSelect?: (page: SitePageId) => void;
  children: ReactNode;
}) {
  const Content = onSelect ? "div" : "main";

  return (
    <div className="site">
      {backHref ? (
        <p className="back-link">
          <Link href={backHref}>&lt;&lt; back</Link>
        </p>
      ) : (
        <SiteNav active={active} onSelect={onSelect} />
      )}
      <Content className="site-content">
        {heading && <h1 className="visually-hidden">{heading}</h1>}
        {children}
      </Content>
      {footer && <footer className="site-footer">{footer}</footer>}
    </div>
  );
}
