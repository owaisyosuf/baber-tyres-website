import { describe, expect, it } from "vitest";
import { REVEAL_STAGGER_MS, staggerDelay } from "./motion";

describe("staggerDelay", () => {
  it("staggers each item by 60ms, starting at zero", () => {
    expect(REVEAL_STAGGER_MS).toBe(60);
    expect(staggerDelay(0)).toBe(0);
    expect(staggerDelay(1)).toBe(60);
    expect(staggerDelay(3)).toBe(180);
  });

  it("caps the wait so a long grid does not drag", () => {
    expect(staggerDelay(6)).toBe(360);
    expect(staggerDelay(40)).toBe(360);
  });

  it("treats a negative index as the first item", () => {
    expect(staggerDelay(-2)).toBe(0);
  });
});
