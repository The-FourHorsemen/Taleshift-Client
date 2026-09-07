import { describe, it, expect } from "vitest";
import { alignReadingToReference } from "./align";

describe("alignReadingToReference", () => {
  it("marks every word correct on a perfect read", () => {
    const result = alignReadingToReference(
      ["the", "cat", "sat"],
      ["the", "cat", "sat"]
    );
    expect(result.correctWords).toBe(3);
    expect(result.skippedWords).toBe(0);
    expect(result.mispronouncedWords).toBe(0);
    expect(result.totalWords).toBe(3);
  });

  it("detects a skipped word", () => {
    const result = alignReadingToReference(
      ["the", "sat"],
      ["the", "cat", "sat"]
    );
    expect(result.skippedWords).toBe(1);
    expect(result.struggleWords).toContain("cat");
  });

  it("detects a mispronounced word as a substitution", () => {
    const result = alignReadingToReference(
      ["the", "kat", "sat"],
      ["the", "cat", "sat"]
    );
    expect(result.mispronouncedWords).toBe(1);
    expect(result.struggleWords).toContain("cat");
  });

  it("handles an empty spoken transcript without throwing", () => {
    const result = alignReadingToReference([], ["the", "cat", "sat"]);
    expect(result.skippedWords).toBe(3);
    expect(result.correctWords).toBe(0);
  });

  it("is case insensitive", () => {
    const result = alignReadingToReference(["The", "Cat", "Sat"], ["the", "cat", "sat"]);
    expect(result.correctWords).toBe(3);
  });
});
