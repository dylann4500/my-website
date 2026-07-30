export const tabIds = [
  "experience",
  "projects",
  "videos",
  "gallery",
  "awards",
] as const;

export type TabId = (typeof tabIds)[number];

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

export type Award = {
  title: string;
  year: string;
};

export type SiteContent = {
  designVersion: 2;
  name: string;
  greeting: string;
  bio: string;
  facts: string[];
  defaultTab: TabId;
  email: string;
  socials: SocialLink[];
  projects: Project[];
  photos: Photo[];
  videos: Video[];
  experience: ResumeEntry[];
  awards: Award[];
  // Legacy fields are retained so previously saved content remains readable.
  eyebrow: string;
  headline: string;
  intro: string;
  location: string;
  availability: string;
  about: string;
  resumeSummary: string;
  resumeUrl: string;
  education: ResumeEntry[];
};

export const defaultContent: SiteContent = {
  designVersion: 2,
  name: "Dylan",
  greeting: "hi there!",
  bio: "i'm dylan, currently studying ds + applied math at uc berkeley. here are some fun facts:",
  facts: [
    "once performed violin for U.S. Secret Service",
    "top 0.1% fastest typists worldwide",
    "hit 7.5 mil impressions on my first yt video",
    "trying to learn photography on my nikon d610",
  ],
  defaultTab: "experience",
  email: "hello@example.com",
  socials: [
    { label: "Instagram", url: "" },
    { label: "YouTube", url: "" },
    { label: "LinkedIn", url: "" },
    { label: "GitHub", url: "" },
  ],
  projects: [],
  photos: [],
  videos: [],
  experience: [],
  awards: [],
  eyebrow: "",
  headline: "",
  intro: "",
  location: "",
  availability: "",
  about: "",
  resumeSummary: "",
  resumeUrl: "",
  education: [],
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

  if (candidate.designVersion !== 2) return defaultContent;

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
    : [];

  const photos = Array.isArray(candidate.photos)
    ? candidate.photos.slice(0, 60).map((item) => ({
        title: cleanString(item?.title),
        caption: cleanString(item?.caption),
        url: cleanUrl(item?.url),
      }))
    : [];

  const videos = Array.isArray(candidate.videos)
    ? candidate.videos.slice(0, 30).map((item) => ({
        title: cleanString(item?.title),
        year: cleanString(item?.year),
        url: cleanUrl(item?.url),
      }))
    : [];

  const cleanEntries = (entries: unknown) =>
    Array.isArray(entries)
      ? entries.slice(0, 30).map((item) => ({
          title: cleanString(item?.title),
          organization: cleanString(item?.organization),
          period: cleanString(item?.period),
          description: cleanString(item?.description),
        }))
      : [];

  const awards = Array.isArray(candidate.awards)
    ? candidate.awards.slice(0, 30).map((item) => ({
        title: cleanString(item?.title),
        year: cleanString(item?.year),
      }))
    : [];

  const facts = Array.isArray(candidate.facts)
    ? candidate.facts
        .slice(0, 12)
        .map((fact) => cleanString(fact))
        .filter(Boolean)
    : defaultContent.facts;

  const defaultTab = tabIds.includes(candidate.defaultTab as TabId)
    ? (candidate.defaultTab as TabId)
    : defaultContent.defaultTab;

  return {
    designVersion: 2,
    name: cleanString(candidate.name, defaultContent.name),
    greeting: cleanString(candidate.greeting, defaultContent.greeting),
    bio: cleanString(candidate.bio, defaultContent.bio),
    facts,
    defaultTab,
    email: cleanString(candidate.email, defaultContent.email),
    socials,
    projects,
    photos,
    videos,
    experience: cleanEntries(candidate.experience),
    awards,
    eyebrow: cleanString(candidate.eyebrow),
    headline: cleanString(candidate.headline),
    intro: cleanString(candidate.intro),
    location: cleanString(candidate.location),
    availability: cleanString(candidate.availability),
    about: cleanString(candidate.about),
    resumeSummary: cleanString(candidate.resumeSummary),
    resumeUrl: cleanUrl(candidate.resumeUrl),
    education: cleanEntries(candidate.education),
  };
}
