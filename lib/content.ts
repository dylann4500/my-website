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
  demoUrl: string;
  sourceUrl: string;
  // Retained so older saved projects with one link migrate cleanly.
  url: string;
};

export type Photo = {
  title: string;
  date: string;
  description: string;
  caption: string;
  url: string;
  takenOnD610?: boolean;
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
  designVersion: 11;
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
  writingVisible: boolean; // Legacy site setting, retained for saved content.
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
  "designVersion": 11,
  "name": "Dylan",
  "greeting": "hi there!",
  "bio": "i'm dylan, a student at uc berkeley studying ds + applied math. currently into [fish](https://en.wikipedia.org/wiki/Literature_(card_game)), videography, scriabin, and ml. here are some fun facts!",
  "facts": [
    "once performed violin for the U.S. Secret Service",
    "top 0.1% fastest [typists](https://monkeytype.com/profile/dylann4500) worldwide",
    "hit 7.5 mil impressions on my first yt video",
    "ex-#1 nationwide [aristocrat](https://en.wikipedia.org/wiki/Aristocrat_Cipher) solver",
    "learning some photography on my nikon d610"
  ],
  "defaultTab": "experience",
  "email": "nguyennalyd3@gmail.com",
  "writingVisible": false,
  "socials": [
    {
      "label": "Instagram",
      "url": "https://www.instagram.com/nnguyen.dylann/"
    },
    {
      "label": "YouTube",
      "url": "https://www.youtube.com/@DylanNguyenn"
    },
    {
      "label": "LinkedIn",
      "url": "https://www.linkedin.com/in/dylan-nguyen-b765482a8/"
    },
    {
      "label": "GitHub",
      "url": "https://github.com/dylann4500"
    }
  ],
  "projects": [
    {
      "title": "Wake Up",
      "year": "Jun 2026 - Present",
      "description": " Built an iOS-first alarm app in SwiftUI with a modular Swift6 + AlarmKit architecture. Real-time push-up detection using AVFoundation and Apple Vision pose estimation, confidence-filtered shoulder–elbow–wrist geometry, bilateral joint-angle interpolation. A jab at teenage circadian rhythm!",
      "demoUrl": "https://drive.google.com/file/d/1uRjWtBgPpGvZgzy9klWpIwU7pLO0rbOL/view?usp=drive_link",
      "sourceUrl": "https://github.com/dylann4500/wake-up",
      "url": ""
    },
    {
      "title": "Personal Website",
      "year": "Jul 2026 - Present",
      "description": "Always a work in progress... Built with a custom native CMS/editor using React, TypeScript, Next.js/Vinext, Cloudflare Workers, D1, and R2; implemented dynamic content rendering and lossless chunked media uploads.",
      "demoUrl": "",
      "sourceUrl": "https://github.com/dylann4500/my-website",
      "url": ""
    },
    {
      "title": "BarkOff",
      "year": "Jul 2026",
      "description": "For Corgi Hacks; a 1v1 barking game which captures 10-second audio window, applies FFT-based spectral analysis, and extracts RMS energy, zero-crossing rate, spectral centroid, pitch contour, etc. normalized 0–1; aggregated into a 0–100 composite score and scored via 400-pt. logistic scale.",
      "demoUrl": "https://youtu.be/73cf1GAs_6c?si=Oc0P6fNW0C2bm6Ot",
      "sourceUrl": "https://github.com/dylann4500/corgi",
      "url": ""
    },
    {
      "title": "Futures + Stocks Research Platform",
      "year": "Apr 2026 - Jun 2026",
      "description": "With EE's @ Anduril, built Python-based research system for technical pattern detection, ML-driven setup ranking, and vectorized backtesting; trained XGBoost + LightGBM models on OHLCV data for high-probability trades, optimized detection thresholds with BBO + Optuna, tracked metrics with pytest.\n",
      "demoUrl": "",
      "sourceUrl": "https://sowwy.it.is.proprietary/",
      "url": ""
    },
    {
      "title": "SciOly Robot Tour",
      "year": "Oct 2026 - Feb 2026",
      "description": "Developed C++ control system on Romi32U4 using encoder feedback and PID-based navigation corrections; implemented calibrated motion primitives + 3D-printed water bottle pusher in SolidWorks. One of the top performing bots nationwide, and the most successful event in my school's history!",
      "demoUrl": "https://youtu.be/P2T7oHCn_wI?si=WpGSDTBuWdnJ7Qoj",
      "sourceUrl": "https://github.com/dylann4500/robot-tour",
      "url": ""
    },
    {
      "title": "Vocalis",
      "year": "Oct 2025",
      "description": "This prototype was all done in 20 hours. Generative-AI powered AAC platform supporting expressive voice synthesis via ElevenLabs, speech prediction + multi-modal context via Gemini, and real-time transcription via Deepgram. **DQ'ed from CAC 2025 for video length (we didn't read the rules).",
      "demoUrl": "https://youtu.be/fk13EY2UO9k",
      "sourceUrl": "https://github.com/dylann4500/vocalis4",
      "url": ""
    }
  ],
  "photos": [
    {
      "title": "me and kv @ yc",
      "date": "jul 26, 2026",
      "description": "larping with the roomate (is manifestation more than a concept?)",
      "caption": "",
      "url": "/api/media/28167f09-4e13-42eb-9581-e50b614cd8d9.png"
    },
    {
      "title": "fish @ yc sus",
      "date": "jul 25, 2026",
      "description": "it's hard to beat playing your favorite game surrounded by the smartest people ever.",
      "caption": "",
      "url": "/api/media/deadd60d-1de3-4883-8e2d-c685a56c3d03.png"
    },
    {
      "title": "sam altman chat",
      "date": "jul 24, 2026",
      "description": "wow i think i am getting indoctrinated.",
      "caption": "",
      "url": "/api/media/ce7ae347-17d9-4b0c-b622-96912a663fe4.png"
    },
    {
      "title": "v1",
      "date": "jul 24, 2026",
      "description": "james you are the goat engineer and damian id never ask anyone else to do this sidequest with.",
      "caption": "",
      "url": "/api/media/defd83ea-2b80-4c11-b98c-058e9ab6fc8f.png"
    },
    {
      "title": "cognition poster",
      "date": "jul 24, 2026",
      "description": "an omnipresence of ai euphoria. kind of surreal to see in person lol.",
      "caption": "",
      "url": "/api/media/8d70b373-726d-48c2-913c-323deb9c00f7.png"
    },
    {
      "title": "marshall's beach",
      "date": "jul 24, 2026",
      "description": "my favorite viewing point of the golden gate bridge, though i wish it was sunset.",
      "caption": "",
      "url": "/api/media/fcc71b94-29f8-4725-b099-651d22103e17.png"
    },
    {
      "title": "cow appreciation day",
      "date": "jul 14, 2026",
      "description": "ofc we had to get the free entrees from chic fil a. w/ anthony and sahej.",
      "caption": "",
      "url": "/api/media/eb91ee29-0299-4bef-8488-58e749624dfe.png"
    },
    {
      "title": "vatnajokull glacier",
      "date": "jun 22, 2026",
      "description": "they filmed interstellar on that thing. also some stranger's car.",
      "caption": "",
      "url": "/api/media/0f16248b-5b27-47ff-818a-04d2fde7d096.jpg"
    },
    {
      "title": "diamond beach",
      "date": "jun 22, 2026",
      "description": "my favorite diamond i found that day. thought the mini glacial arch framing was tuff.",
      "caption": "",
      "url": "/api/media/ccf22f83-9998-4b4c-8c40-3ba4ad2b6866.jpg"
    },
    {
      "title": "dyrholaey coastline",
      "date": "jun 21, 2026",
      "description": "i had been dreaming of this photo for years. i think it's simplicity makes it amazing.",
      "caption": "",
      "url": "/api/media/bc70659f-df0b-4ed2-b035-9b60667b6f6b.jpg"
    },
    {
      "title": "skofagoss (top view)",
      "date": "jun 20, 2026",
      "description": "absolutely stunning, the birds in flight make this photo perfect imo.",
      "caption": "",
      "url": "/api/media/c8a285f8-5870-4f70-8e64-0c617cb53b27.jpg"
    },
    {
      "title": "vik i myrdal church",
      "date": "jun 20, 2026",
      "description": "i copied the framing from a nearby photographer, loved the way it turned out.",
      "caption": "",
      "url": "/api/media/2be893e8-b393-4c34-a80b-05cec63e2ab1.jpg"
    },
    {
      "title": "skogafoss",
      "date": "jun 20, 2026",
      "description": "i think its the most beautiful waterfall in the world. had to use advanced editing to remove water specks on the lens.",
      "caption": "",
      "url": "/api/media/f4871504-d3fb-4ecf-abce-9f2d683cc1a0.png"
    },
    {
      "title": "iceland horses",
      "date": "jun 19, 2026",
      "description": "the most beautiful horses on earth.",
      "caption": "",
      "url": "/api/media/17b7c01a-29a2-4852-b4b8-36047a72177d.jpg"
    }
  ],
  "videos": [
    {
      "title": "ap jugg (bts)",
      "year": "2026",
      "description": "polarizing and experimental-style vlog edited by jayden aviles and shot by me.",
      "url": "https://youtu.be/nxrS2L3-EEw?si=fvgslnZDOBahyEiZ"
    },
    {
      "title": "ap score reaction v2",
      "year": "2026",
      "description": "ran it back, but at what cost... (please go viral i need monetization)",
      "url": "https://youtu.be/nPQohg0Sh7k?si=EmA7yPncTIhpnXTQ"
    },
    {
      "title": "yvl - ap jugg",
      "year": "2026",
      "description": "the greatest mv on the platform. y.oung v.iolent l.iterati 4L.",
      "url": "https://youtu.be/tmTPjdkF_0I?si=MuEmqOvQA99xC2fq"
    },
    {
      "title": "ap bio project",
      "year": "2026",
      "description": "idk i think it's pretty funny yet keenly aware of current events. ",
      "url": "https://youtu.be/pTb0Z05eGTw?si=i706Kh2tsA7hQ6MY"
    },
    {
      "title": "brown video",
      "year": "2026",
      "description": "rej, but in hindsight makes sense since it was scripted, filmed, and edited in < 24 hrs lol.",
      "url": "https://youtu.be/QkZRBbxaHR4?si=nUhwj9ybWzClQPvp"
    },
    {
      "title": "robout tour @ rickards",
      "year": "2025",
      "description": "these runs were quite literally a miracle. thanks logan + eric for source code and teaching me PID.",
      "url": "https://youtu.be/8zA1orftUo0?si=evgpg--2X0NXlkiS"
    },
    {
      "title": "1600 sat guide",
      "year": "2025",
      "description": "it is definitely my best work ever. emotionally and psychologically captivating.",
      "url": "https://youtu.be/2SVjcngkNj8?si=hu_NruhgOBMnBHAb"
    },
    {
      "title": "ap score reaction v1",
      "year": "2025",
      "description": "the one that started it all. grinded 12 hrs of capcut in one day. ",
      "url": "https://youtu.be/V2WVqFA4TK8?si=XhMXWHjm5ZC82Ydx"
    }
  ],
  "experience": [
    {
      "title": "Co-Founder",
      "organization": "?",
      "period": "June 2026 - Present",
      "description": ""
    },
    {
      "title": "Researcher",
      "organization": "Aalto University, Finland",
      "period": "Feb 2026 – May 2026",
      "description": "Collaborated with Dr. Mojtaba Barzehkar on offshore solar farm site selection in Danish waters using ML frameworks (SVR, HGB, RF), GIS, and Multi-Criteria Decision Analysis."
    },
    {
      "title": "Concertmaster",
      "organization": "Quarantet",
      "period": "Dec 2022 – Mar 2026",
      "description": "Invited by and performed for the U.S. Secret Service, U.S. congressmen, Richard Nixon Foundation, Yorba Linda Chamber of Commerce, city mayor.\nLed 13-musician chamber ensemble in 50+ community concerts for local nursing homes, preschools, libraries, and hopsitals. "
    },
    {
      "title": "Founder",
      "organization": "Vocalis",
      "period": "Nov 2024 – Jan 2026",
      "description": "Built a GenAI-powered augmentative alternative communication (AAC) platform allowing nonverbal and deaf individuals to communicate; 2–5x faster communication rates compared to leading AAC market solutions.\nReceived $5,000+ funding from Samsung; awards won from Solve for Tomorrow contest and Diamond Challenge."
    },
    {
      "title": "Payload Technologies Intern",
      "organization": "Boeing",
      "period": "Jun 2025 – Aug 2025",
      "description": "Worked on edge-AI wildfire classification in autonomous detection drones using PyTorch-trained YOLO + CNN models; for Project WDOS, a drone-based wildfire prevention initiative deploying across four continents.\nAuthored a 3-volume, 58-page technical report and poster, earning formal project distinction from the California State Senate (presented by Senator Tony Strickland)."
    },
    {
      "title": "Researcher",
      "organization": "California State University, Long Beach",
      "period": "Dec 2024 – Jun 2025",
      "description": "Developed and [published](https://ojs.zefr.org/index.php/intplanet/article/view/26/22) a novel two-step CNN-based pipeline for robust estimations of residential PV capacity.\nDelivered invited lectures on CNN theory and project methodology for Prof. Olga Korosteleva's graduate courses within the Department of Mathematics and Statistics."
    }
  ],
  "awards": [
    {
      "title": "YCombinator Startup School",
      "year": "Jul 2026",
      "description": "Received $27,200+ in compute credit; flown out to San Francisco to hear from speakers including Sam Altman, Jensen Huang, Jeff Dean, more.",
      "details": ""
    },
    {
      "title": "Hanson Scholar",
      "year": "May 2026",
      "description": "1 of 8 selected for a $2,000 scholarship.",
      "details": ""
    },
    {
      "title": "Science Olympiad",
      "year": "Sep 2025 – Feb 2026",
      "description": "",
      "details": "Robot Tour:\n1st Place of 353 teams @ Rickards Invitational\n4th Place of 300 teams @ Boyceville Invitational\n2nd Place of 90 teams @ USC Invitational\n3rd Place of 88 teams @ Highlands Invitational\n6th Place of 47 teams @ UCI Regionals\n4th Place of 43 teams @ UCR Invitational\n\nExperimental Design:\n2nd Place of 88 teams @ Highlands Invitational\n3rd Place of 47 teams @ UCI Regionals (2026)\n5th Place of 47 teams @ UCI Regionals (2025)\n\nCodebusters:\n9th Place of 353 teams @ Rickards Invitational\n5th Place of 43 teams @ UCR Invitational\n\nMachines:\n6th Place of 47 teams @ UCI Regionals"
    },
    {
      "title": "Solve for Tomorrow 2026 Finalist",
      "year": "Jan 2026",
      "description": "$1,000 prize winner + $2,000 sponsor match.",
      "details": ""
    },
    {
      "title": "Southern California Math Competition 2nd Place",
      "year": "Mar 2025",
      "description": "139 participants, lost to IMO gold rip.",
      "details": ""
    },
    {
      "title": "Diamond Challenge Global Semifinalist",
      "year": "Feb 2025",
      "description": "Top 7% of submissions worldwide.",
      "details": ""
    },
    {
      "title": "Solve for Tomorrow 2025 Finalist",
      "year": "Jan 2025",
      "description": "$2,500 prize winner.",
      "details": ""
    },
    {
      "title": "Southwestern Youth Music Festival",
      "year": "2022–2024",
      "description": "",
      "details": "2022:\n3rd Place in Violin, Romantic Period: Open Category\n\n2023:\n1st Place in Violin, Romantic Period: Open Category ($100 Prize)\n4th Place in Violin, Baroque Period: Open Category\n\n2024:\n4th Place in Violin, Romantic Period: Open Category"
    },
    {
      "title": "Smurf's Village Annual Smurfberry Event T50",
      "year": "Dec 2024",
      "description": "Finished #48 of 20,000+ in the Christmas Smurfberry Festival via mathematically optimized village layouts.",
      "details": ""
    },
    {
      "title": "Certificate of Merit Violin Level 10",
      "year": "Feb 2024",
      "description": "Highest distinction (<5% of CA violinists). Received 8x State Honors + 3x State Convention Invitee across 8 years.",
      "details": ""
    }
  ],
  "eyebrow": "",
  "headline": "",
  "intro": "",
  "location": "",
  "availability": "",
  "about": "",
  "resumeSummary": "",
  "resumeUrl": "",
  "education": []
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
      /\b(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+(?:(\d{1,2})(?:st|nd|rd|th)?(?:,\s*|\s+))?)?((?:19|20)\d{2})\b/g,
    ),
  ];
  const match = matches.at(-1);
  if (!match) return Number.NEGATIVE_INFINITY;

  const monthKey = match[1] === "sept" ? "sep" : match[1];
  const month = monthKey ? monthNumbers[monthKey] : 11;
  const day = match[2] ? Number(match[2]) : monthKey ? 1 : 31;
  return Date.UTC(Number(match[3]), month, day);
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

export function sortProjects(entries: Project[]) {
  return [...entries].sort((first, second) =>
    compareDatesDescending(first.year, second.year),
  );
}

export function sortPhotos(entries: Photo[]) {
  return [...entries].sort((first, second) =>
    compareDatesDescending(first.date, second.date),
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
    candidate.designVersion !== 9 &&
    candidate.designVersion !== 10 &&
    candidate.designVersion !== 11
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
        demoUrl: cleanUrl(item?.demoUrl || item?.url),
        sourceUrl: cleanUrl(item?.sourceUrl),
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
        takenOnD610: item?.takenOnD610 === true,
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
    designVersion: 11,
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
    projects: sortProjects(projects),
    photos: sortPhotos(photos),
    videos,
    experience: sortExperienceEntries(
      needsPortfolioContentUpdate
        ? defaultContent.experience
        : cleanEntries(candidate.experience),
    ),
    awards: sortAwards(
      needsPortfolioContentUpdate ? defaultContent.awards : awards,
    ),
    writingVisible:
      candidate.designVersion >= 11 && candidate.writingVisible === true,
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
