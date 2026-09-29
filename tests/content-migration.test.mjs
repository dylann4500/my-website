import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { defaultContent, sanitizeContent } from "../lib/content.ts";

// Snapshot of the published content right before the minimalist redesign.
const savedContent = JSON.parse(
  await readFile(
    new URL("../backups/site-content-2026-09-29.json", import.meta.url),
    "utf8",
  ),
);

test("moves saved content onto the minimalist homepage copy", () => {
  const content = sanitizeContent(savedContent);

  assert.equal(content.designVersion, 13);
  assert.equal(content.greeting, "hi! i'm dylan nguyen.");
  assert.equal(
    content.bio,
    "current ds + applied math student at berkeley. presently interested in [fish](https://en.wikipedia.org/wiki/Literature_(card_game)), impressionism, iceland, and ml. fun facts:",
  );
  assert.equal(content.portraitUrl, "");
  assert.deepEqual(content.socials, [
    { label: "github", url: "https://github.com/dylann4500" },
    { label: "X", url: "https://x.com/dylann4500" },
    { label: "youtube", url: "https://www.youtube.com/@DylanNguyenn" },
    {
      label: "linkedin",
      url: "https://www.linkedin.com/in/dylan-nguyen-b765482a8/",
    },
  ]);
});

test("keeps the rest of the saved content untouched", () => {
  const content = sanitizeContent(savedContent);

  assert.equal(content.email, savedContent.email);
  assert.deepEqual(content.facts, savedContent.facts);
  assert.deepEqual(content.experience, savedContent.experience);
  assert.deepEqual(content.awards, savedContent.awards);
  assert.deepEqual(content.projects, savedContent.projects);
  assert.deepEqual(content.videos, savedContent.videos);
  assert.deepEqual(content.photos, savedContent.photos);
});

test("migrated social links keep their saved urls", () => {
  const content = sanitizeContent({
    ...savedContent,
    socials: [{ label: "GitHub", url: "https://github.com/someone-else" }],
  });

  assert.equal(
    content.socials.find((link) => link.label === "github")?.url,
    "https://github.com/someone-else",
  );
});

test("content saved from the new editor keeps its edits", () => {
  const edited = {
    ...sanitizeContent(savedContent),
    greeting: "hello!",
    bio: "a different bio",
    portraitUrl: "/api/media/portrait.jpg",
    socials: [{ label: "instagram", url: "https://www.instagram.com/nnguyen.dylann/" }],
  };
  const content = sanitizeContent(edited);

  assert.equal(content.greeting, "hello!");
  assert.equal(content.bio, "a different bio");
  assert.equal(content.portraitUrl, "/api/media/portrait.jpg");
  assert.deepEqual(content.socials, edited.socials);
});

test("starter content already uses the minimalist copy", () => {
  const content = sanitizeContent(defaultContent);

  assert.equal(content.greeting, defaultContent.greeting);
  assert.equal(content.bio, defaultContent.bio);
  assert.deepEqual(content.socials, defaultContent.socials);
});
