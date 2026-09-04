import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("gallery explains and renders the Nikon D610 marker", async () => {
  const [gallery, editor, content] = await Promise.all([
    readFile(new URL("components/PortfolioFrame.tsx", projectRoot), "utf8"),
    readFile(new URL("components/EditorApp.tsx", projectRoot), "utf8"),
    readFile(new URL("lib/content.ts", projectRoot), "utf8"),
  ]);

  assert.match(gallery, /click a photo to learn more/);
  assert.match(gallery, /taken on Nikon D610/);
  assert.match(gallery, /selected\.takenOnD610/);
  assert.match(editor, /checked=\{item\.takenOnD610 === true\}/);
  assert.match(content, /takenOnD610: item\?\.takenOnD610 === true/);
});
