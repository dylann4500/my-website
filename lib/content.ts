export const tabIds = [
  "experience",
  "awards",
  "projects",
  "videos",
  "gallery",
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
  date: string;
  description: string;
  caption: string;
  url: string;
};

export type Video = {
  title: string;
  year: string;
  description: string;
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
  description: string;
  details: string;
};

export type SiteContent = {
  designVersion: 9;
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
  designVersion: 9,
  name: "Dylan",
  greeting: "hi there!",
  bio: "i'm dylan, a student at uc berkeley studying ds + applied math. currently into [fish](https://en.wikipedia.org/wiki/Literature_(card_game)), videography, scriabin, and ml. here are some fun facts!",
  facts: [
    "once performed violin for the U.S. Secret Service",
    "top 0.1% fastest [typists](https://monkeytype.com/profile/dylann4500) worldwide",
    "hit 7.5 mil impressions on my first yt video",
    "ex-#1 nationwide [aristocrat](https://en.wikipedia.org/wiki/Aristocrat_Cipher) solver",
    "learning some photography on my nikon d610",
  ],
  defaultTab: "experience",
  email: "nguyennalyd3@gmail.com",
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/nnguyen.dylann/" },
    { label: "YouTube", url: "https://www.youtube.com/@DylanNguyenn" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/dylan-nguyen-b765482a8/",
    },
    { label: "GitHub", url: "https://github.com/dylann4500" },
  ],
  projects: [],
  photos: [],
  videos: [],
  experience: [
    {
      title: "Researcher",
      organization: "Aalto University",
      period: "Feb 2026 – May 2026",
      description:
        "Collaborated with Dr. Mojtaba Barzehkar on offshore solar farm site selection in Danish waters combining ML frameworks (SVR, HGB, RF), GIS, and Multi-Criteria Decision Analysis.",
    },
    {
      title: "Founder",
      organization: "Vocalis",
      period: "Nov 2024 – Jan 2026",
      description:
        "Built gen-AI powered augmentative alternative communication (AAC) platform allowing nonverbal and deaf individuals to communicate; 2–5x faster communication rates compared to leading AAC market solutions.\nReceived $5,000+ funding from Samsung; awards won from Solve for Tomorrow contest and Diamond Challenge.",
    },
    {
      title: "Payload Technologies Intern",
      organization: "Boeing",
      period: "Jun 2025 – Aug 2025",
      description:
        "Worked on edge-AI wildfire classification in autonomous detection drones using PyTorch-trained YOLO + CNN models; for Project WDOS, a drone-based wildfire prevention initiative deploying across four continents.\nAuthored a 3-volume, 58-page technical report and poster, earning formal project distinction from the California State Senate (presented by Senator Tony Strickland).",
    },
    {
      title: "Researcher",
      organization: "California State University, Long Beach",
      period: "Dec 2024 – Jun 2025",
      description:
        "Developed and published a novel two-step CNN-based pipeline for robust estimations of residential PV capacity.\nDelivered invited lectures on CNN theory and project methodology for Prof. Olga Korosteleva's graduate courses within the Department of Mathematics and Statistics.",
    },
  ],
  awards: [
    {
      title: "YCombinator Startup School",
      year: "Jul 2026",
      description:
        "Received $27,200+ in compute credit; flown to San Francisco to hear from speakers including Sam Altman, Jensen Huang, and Jeff Dean.",
      details: "",
    },
    {
      title: "Hanson Scholar",
      year: "May 2026",
      description: "1 of 8 selected for a $2,000 scholarship.",
      details: "",
    },
    {
      title: "Science Olympiad",
      year: "2025–2026",
      description: "",
      details:
        "Robot Tour:\n1st Place of 353 teams @ Rickards Invitational\n4th Place of 300 teams @ Boyceville Invitational\n2nd Place of 90 teams @ USC Invitational\n3rd Place of 88 teams @ Highlands Invitational\n6th Place of 47 teams @ UCI Regionals\n4th Place of 43 teams @ UCR Invitational\n\nExperimental Design:\n2nd Place of 88 teams @ Highlands Invitational\n3rd Place of 47 teams @ UCI Regionals (2026)\n5th Place of 47 teams @ UCI Regionals (2025)\n\nCodebusters:\n9th Place of 353 teams @ Rickards Invitational\n5th Place of 43 teams @ UCR Invitational\n\nMachines:\n6th Place of 47 teams @ UCI Regionals",
    },
    {
      title: "Solve for Tomorrow 2026 Finalist",
      year: "Jan 2026",
      description: "$1,000 prize winner + $2,000 sponsor match.",
      details: "",
    },
    {
      title: "Southern California Math Competition 2nd Place",
      year: "Mar 2025",
      description: "139 participants, lost to IMO gold rip.",
      details: "",
    },
    {
      title: "Diamond Challenge Global Semifinalist",
      year: "Feb 2025",
      description: "Top 7% of submissions worldwide.",
      details: "",
    },
    {
      title: "Solve for Tomorrow 2025 Finalist",
      year: "Jan 2025",
      description: "$2,500 prize winner.",
      details: "",
    },
    {
      title: "Smurf's Village Annual Smurfberry Event T50",
      year: "Dec 2024",
      description:
        "Finished #50 of 200,000+ in the annual Smurfberry Festival with a mathematically optimized village layout.",
      details: "",
    },
    {
      title: "Southwestern Youth Music Festival",
      year: "2022–2024",
      description: "",
      details:
        "2022:\n3rd Place in Violin, Romantic Period: Open Category\n\n2023:\n1st Place in Violin, Romantic Period: Open Category ($100 Prize)\n4th Place in Violin, Baroque Period: Open Category\n\n2024:\n4th Place in Violin, Romantic Period: Open Category",
    },
    {
      title: "Certificate of Merit Violin Level 10",
      year: "Feb 2024",
      description:
        "Highest distinction (<5% of CA violinists). Received 8x State Honors + 3x State Convention Invitee across 8 years.",
      details: "",
    },
  ],
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

const monthNumbers: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function endDateValue(value: string) {
  const normalized = value.trim().toLowerCase();
  if (/\b(present|current|now)\b/.test(normalized)) {
    return Number.POSITIVE_INFINITY;
  }

  const matches = [
    ...normalized.matchAll(
      /\b(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+)?((?:19|20)\d{2})\b/g,
    ),
  ];
  const match = matches.at(-1);
  if (!match) return Number.NEGATIVE_INFINITY;

  const monthKey = match[1] === "sept" ? "sep" : match[1];
  const month = monthKey ? monthNumbers[monthKey] : 11;
  return Date.UTC(Number(match[2]), month, 1);
}

function compareDatesDescending(first: string, second: string) {
  const firstValue = endDateValue(first);
  const secondValue = endDateValue(second);
  if (firstValue === secondValue) return 0;
  return firstValue > secondValue ? -1 : 1;
}

export function sortExperienceEntries(entries: ResumeEntry[]) {
  return [...entries].sort((first, second) =>
    compareDatesDescending(first.period, second.period),
  );
}

export function sortAwards(entries: Award[]) {
  return [...entries].sort((first, second) =>
    compareDatesDescending(first.year, second.year),
  );
}

export function sanitizeContent(value: unknown): SiteContent {
  const candidate =
    value && typeof value === "object"
      ? (value as Partial<Omit<SiteContent, "designVersion">> & {
          designVersion?: number;
        })
      : {};

  if (
    candidate.designVersion !== 2 &&
    candidate.designVersion !== 3 &&
    candidate.designVersion !== 4 &&
    candidate.designVersion !== 5 &&
    candidate.designVersion !== 6 &&
    candidate.designVersion !== 7 &&
    candidate.designVersion !== 8 &&
    candidate.designVersion !== 9
  ) {
    return defaultContent;
  }
  const isVersionTwo = candidate.designVersion === 2;
  const needsProfileUpdate = candidate.designVersion < 6;
  const needsPortfolioContentUpdate = candidate.designVersion < 7;
  const needsLinkSyntaxUpdate = candidate.designVersion < 8;

  const socials = needsProfileUpdate
    ? defaultContent.socials
    : Array.isArray(candidate.socials)
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
        date: cleanString(item?.date),
        description: cleanString(item?.description, cleanString(item?.caption)),
        caption: cleanString(item?.caption),
        url: cleanUrl(item?.url),
      }))
    : [];

  const videos = Array.isArray(candidate.videos)
    ? candidate.videos.slice(0, 30).map((item) => ({
        title: cleanString(item?.title),
        year: cleanString(item?.year),
        description: cleanString(item?.description),
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
        description: cleanString(item?.description),
        details: cleanString(item?.details),
      }))
    : [];

  const facts = isVersionTwo || needsProfileUpdate || needsLinkSyntaxUpdate
    ? defaultContent.facts
    : Array.isArray(candidate.facts)
    ? candidate.facts
        .slice(0, 12)
        .map((fact) => cleanString(fact))
        .filter(Boolean)
    : defaultContent.facts;

  const defaultTab = tabIds.includes(candidate.defaultTab as TabId)
    ? (candidate.defaultTab as TabId)
    : defaultContent.defaultTab;

  return {
    designVersion: 9,
    name: cleanString(candidate.name, defaultContent.name),
    greeting: cleanString(candidate.greeting, defaultContent.greeting),
    bio: needsProfileUpdate || needsLinkSyntaxUpdate
      ? defaultContent.bio
      : cleanString(candidate.bio, defaultContent.bio),
    facts,
    defaultTab,
    email: needsProfileUpdate
      ? defaultContent.email
      : cleanString(candidate.email, defaultContent.email),
    socials,
    projects,
    photos,
    videos,
    experience: sortExperienceEntries(
      needsPortfolioContentUpdate
        ? defaultContent.experience
        : cleanEntries(candidate.experience),
    ),
    awards: sortAwards(
      needsPortfolioContentUpdate ? defaultContent.awards : awards,
    ),
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
