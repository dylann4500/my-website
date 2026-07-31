import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "Dylan",
      template: "%s — Dylan",
    },
    description:
      "Dylan studies data science and applied mathematics at UC Berkeley.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Dylan",
      description: "Data science + applied math at UC Berkeley.",
      url: origin,
      type: "website",
      images: [
        {
          url: `${origin}/og-sections-v2.png`,
          width: 1730,
          height: 909,
          alt: "Dylan — data science + applied math at UC Berkeley.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Dylan",
      description: "Data science + applied math at UC Berkeley.",
      images: [`${origin}/og-sections-v2.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
