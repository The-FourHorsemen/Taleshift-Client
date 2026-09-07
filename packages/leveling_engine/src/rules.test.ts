import { describe, it, expect } from "vitest";
import { recommendNextLevel } from "./rules";

describe("recommendNextLevel", () => {
  it("recommends leveling up on a high score", () => {
    const result = recommendNextLevel(92, 2);
    expect(result.direction).toBe("up");
  });

  it("recommends staying on a mid score", () => {
    const result = recommendNextLevel(70, 2);
    expect(result.direction).toBe("stay");
  });

  it("recommends leveling down on a low score", () => {
    const result = recommendNextLevel(35, 2);
    expect(result.direction).toBe("down");
  });

  it("never recommends going below level 1", () => {
    const result = recommendNextLevel(10, 1);
    expect(result.direction).toBe("down");
    expect(result.newLevel).toBe(1);
  });

  it("always includes a plain language reason", () => {
    const result = recommendNextLevel(92, 2);
    expect(result.reason.length).toBeGreaterThan(0);
  });
});
