import assert from "node:assert/strict";
import test from "node:test";
import { shuffledOrder } from "../lib/gallery.ts";

test("lists every other photo exactly once", () => {
  const order = shuffledOrder(24, 5);
  const expected = Array.from({ length: 24 }, (_, index) => index).filter(
    (index) => index !== 5,
  );

  assert.deepEqual([...order].sort((a, b) => a - b), expected);
});

test("never starts with the photo already on screen", () => {
  for (let run = 0; run < 200; run += 1) {
    assert.notEqual(shuffledOrder(3, 1)[0], 1);
  }
});

test("handles galleries with one or two photos", () => {
  assert.deepEqual(shuffledOrder(1, 0), []);
  assert.deepEqual(shuffledOrder(2, 0), [1]);
  assert.deepEqual(shuffledOrder(0, 0), []);
});
