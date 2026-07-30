export type SocialLink = {
  label: string;
  url: string;
};

export type Project = {
  title: string;
  year: string;
  description: string;
  url: string;
};

export type Photo = {
  title: string;
  caption: string;
  url: string;
};

export type Video = {
  title: string;
  year: string;
  url: string;
};

export type ResumeEntry = {
  title: string;
  organization: string;
  period: string;
  description: string;
};

export type SiteContent = {
  name: string;
  eyebrow: string;
  headline: string;
  intro: string;
  location: string;
  availability: string;
  about: string;
  email: string;
  socials: SocialLink[];
  projects: Project[];
  photos: Photo[];
  videos: Video[];
  resumeSummary: string;
  resumeUrl: string;
  experience: ResumeEntry[];
  education: ResumeEntry[];
};

export const defaultContent: SiteContent = {
  name: "Dylan",
  eyebrow: "Independent creative",
  headline: "Images, motion, and digital ideas.",
  intro:
    "I make considered work across visual storytelling, film, and digital projects. This is a growing index of selected things I have made.",
  location: "Los Angeles, California",
  availability: "Available for select collaborations",
  about:
    "I am an independent creative interested in simple ideas, carefully made. My practice moves between still images, moving images, and work for the web.",
  email: "hello@example.com",
  socials: [
    { label: "Instagram", url: "https://instagram.com/" },
    { label: "YouTube", url: "https://youtube.com/" },
    { label: "LinkedIn", url: "https://linkedin.com/" },
  ],
  projects: [
    {
      title: "A Quiet Project",
      year: "2026",
      description:
        "A concise description of the project, your role, and the idea that made the work worth doing.",
      url: "",
    },
    {
      title: "Second Study",
      year: "2025",
      description:
        "A second selected piece. Replace this text, title, year, and link from the editor.",
      url: "",
    },
    {
      title: "Ongoing Archive",
      year: "2024—",
      description:
        "An evolving collection of experiments, observations, and work in progress.",
      url: "",
    },
  ],
  photos: [
    { title: "Untitled I", caption: "Los Angeles, 2026", url: "" },
    { title: "Untitled II", caption: "California, 2026", url: "" },
    { title: "Untitled III", caption: "Somewhere, 2025", url: "" },
  ],
  videos: [
    { title: "First Film", year: "2026", url: "" },
    { title: "Second Film", year: "2025", url: "" },
  ],
  resumeSummary:
    "A short professional summary goes here. Keep it direct: what you do, what you care about, and the kind of work you want to make next.",
  resumeUrl: "",
  experience: [
    {
      title: "Role or discipline",
      organization: "Studio / Company",
      period: "2024—Present",
      description:
        "Describe the scope of the role and one or two meaningful outcomes.",
    },
    {
      title: "Previous role",
      organization: "Organization",
      period: "2022—2024",
      description:
        "A brief, readable account of your responsibilities and contribution.",
    },
  ],
  education: [
    {
      title: "Program or degree",
      organization: "School / Institution",
      period: "2018—2022",
      description: "Optional detail about your focus, honors, or thesis.",
    },
  ],
};

const cleanString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value.slice(0, 12000) : fallback;

const cleanUrl = (value: unknown) => {
  const url = cleanString(value).trim();
  if (!url) return "";
  if (url.startsWith("/api/media/")) return url;
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : "";
  } catch {
    return "";
  }
};

export function sanitizeContent(value: unknown): SiteContent {
  const candidate =
    value && typeof value === "object" ? (value as Partial<SiteContent>) : {};

  const socials = Array.isArray(candidate.socials)
    ? candidate.socials.slice(0, 12).map((item) => ({
        label: cleanString(item?.label),
        url: cleanUrl(item?.url),
      }))
    : defaultContent.socials;

  const projects = Array.isArray(candidate.projects)
    ? candidate.projects.slice(0, 30).map((item) => ({
        title: cleanString(item?.title),
        year: cleanString(item?.year),
        description: cleanString(item?.description),
        url: cleanUrl(item?.url),
      }))
    : defaultContent.projects;

  const photos = Array.isArray(candidate.photos)
    ? candidate.photos.slice(0, 60).map((item) => ({
        title: cleanString(item?.title),
        caption: cleanString(item?.caption),
        url: cleanUrl(item?.url),
      }))
    : defaultContent.photos;

  const videos = Array.isArray(candidate.videos)
    ? candidate.videos.slice(0, 30).map((item) => ({
        title: cleanString(item?.title),
        year: cleanString(item?.year),
        url: cleanUrl(item?.url),
      }))
    : defaultContent.videos;

  const cleanEntries = (entries: unknown, fallback: ResumeEntry[]) =>
    Array.isArray(entries)
      ? entries.slice(0, 30).map((item) => ({
          title: cleanString(item?.title),
          organization: cleanString(item?.organization),
          period: cleanString(item?.period),
          description: cleanString(item?.description),
        }))
      : fallback;

  return {
    name: cleanString(candidate.name, defaultContent.name),
    eyebrow: cleanString(candidate.eyebrow, defaultContent.eyebrow),
    headline: cleanString(candidate.headline, defaultContent.headline),
    intro: cleanString(candidate.intro, defaultContent.intro),
    location: cleanString(candidate.location, defaultContent.location),
    availability: cleanString(
      candidate.availability,
      defaultContent.availability,
    ),
    about: cleanString(candidate.about, defaultContent.about),
    email: cleanString(candidate.email, defaultContent.email),
    socials,
    projects,
    photos,
    videos,
    resumeSummary: cleanString(
      candidate.resumeSummary,
      defaultContent.resumeSummary,
    ),
    resumeUrl: cleanUrl(candidate.resumeUrl),
    experience: cleanEntries(candidate.experience, defaultContent.experience),
    education: cleanEntries(candidate.education, defaultContent.education),
  };
}

export function youtubeEmbedUrl(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (url.hostname.includes("youtube.com")) {
      const id =
        url.searchParams.get("v") ??
        url.pathname.split("/").filter(Boolean).at(-1);
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).at(-1);
      return id ? `https://player.vimeo.com/video/${id}` : "";
    }
  } catch {
    return "";
  }
  return "";
}
