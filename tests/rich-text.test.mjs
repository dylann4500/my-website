import assert from "node:assert/strict";
import test from "node:test";
import { parseInline, plainText } from "../lib/rich-text.ts";

test("parses links, including urls with parentheses", () => {
  assert.deepEqual(
    parseInline("into [fish](https://en.wikipedia.org/wiki/Literature_(card_game)), ok"),
    [
      "into ",
      { label: "fish", url: "https://en.wikipedia.org/wiki/Literature_(card_game)" },
      ", ok",
    ],
  );
});

test("a stray bracket does not swallow a later link", () => {
  assert.deepEqual(parseInline("see [sic] and [this](https://example.com/)"), [
    "see [sic] and ",
    { label: "this", url: "https://example.com/" },
  ]);
});

test("leaves formatting markers alone unless formatting is enabled", () => {
  assert.deepEqual(parseInline("**bold**"), ["**bold**"]);
});

test("parses bold, italic, and underline", () => {
  assert.deepEqual(
    parseInline("**bold** _italic_ *also italic* ++underline++", true),
    [
      { style: "strong", children: ["bold"] },
      " ",
      { style: "em", children: ["italic"] },
      " ",
      { style: "em", children: ["also italic"] },
      " ",
      { style: "u", children: ["underline"] },
    ],
  );
});

test("nests styles and links", () => {
  assert.deepEqual(
    parseInline("**_both_ and [a link](https://example.com/)**", true),
    [
      {
        style: "strong",
        children: [
          { style: "em", children: ["both"] },
          " and ",
          { label: "a link", url: "https://example.com/" },
        ],
      },
    ],
  );
});

test("keeps stray markers literal", () => {
  for (const text of [
    "** in hindsight this was a raw dump",
    "5 * 3 * 2",
    "c++ and c++ again",
    "snake_case_name",
    "*starts on one line\nends on another*",
  ]) {
    assert.deepEqual(parseInline(text, true), [text]);
  }
});

test("plain text drops markers and keeps link labels", () => {
  assert.equal(
    plainText("**hi** from [fish](https://example.com/) ++land++"),
    "hi from fish land",
  );
});
