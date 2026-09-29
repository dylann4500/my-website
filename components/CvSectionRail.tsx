"use client";

import { useEffect, useState } from "react";

export type CvSectionId = "work" | "awards" | "projects";

export function CvSectionRail({ sections }: { sections: CvSectionId[] }) {
  const [active, setActive] = useState<CvSectionId>(sections[0]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const visibleSections = sections.flatMap((id) => {
          const element = document.getElementById(id);
          return element ? [{ id, element }] : [];
        });
        if (!visibleSections.length) return;

        const marker = window.innerHeight * 0.4;
        let current = visibleSections[0].id;
        for (const section of visibleSections) {
          if (section.element.getBoundingClientRect().top <= marker) {
            current = section.id;
          }
        }
        if (
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2
        ) {
          current = visibleSections[visibleSections.length - 1].id;
        }
        setActive(current);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("hashchange", update);
    };
  }, [sections]);

  if (sections.length < 2) return null;

  return (
    <nav className="cv-section-rail" aria-label="cv sections">
      {sections.map((section) => (
        <a
          key={section}
          href={`#${section}`}
          aria-current={active === section ? "location" : undefined}
        >
          {section}
        </a>
      ))}
    </nav>
  );
}
