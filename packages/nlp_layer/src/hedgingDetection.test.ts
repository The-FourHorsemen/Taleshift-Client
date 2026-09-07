import { describe, it, expect } from "vitest";
import { countHedgingLanguage } from "./hedgingDetection";

describe("countHedgingLanguage", () => {
  it("returns 0 for confident, hedge free text", () => {
    expect(countHedgingLanguage("The cat sat on the mat.")).toBe(0);
  });

  it("counts a single hedging phrase", () => {
    expect(countHedgingLanguage("I think the cat sat on the mat")).toBe(1);
  });

  it("counts multiple distinct hedging phrases", () => {
    expect(
      countHedgingLanguage("Um, I think, maybe, the cat sat, I guess")
    ).toBe(4);
  });

  it("is case insensitive", () => {
    expect(countHedgingLanguage("MAYBE the cat sat")).toBe(1);
  });

  it("handles empty string without throwing", () => {
    expect(countHedgingLanguage("")).toBe(0);
  });
});
