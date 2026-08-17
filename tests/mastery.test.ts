import { describe, expect, it } from "vitest";
import {
  createInitialSkillState,
  updateMastery,
} from "../src/core/mastery/update";

describe("mastery updates", () => {
  it("gives stronger evidence to independent correct answers", () => {
    const state = createInitialSkillState("B.bond.5");
    const independent = updateMastery(state, {
      correct: true,
      hintLevelUsed: 0,
      representation: "part-whole",
      completedAt: 1000,
    });
    const guided = updateMastery(state, {
      correct: true,
      hintLevelUsed: 3,
      representation: "part-whole",
      completedAt: 1000,
    });

    expect(independent.score).toBeGreaterThan(guided.score);
    expect(independent.recentIndependentCorrect).toBe(1);
  });

  it("does not sharply reduce score after one incorrect answer", () => {
    const state = {
      ...createInitialSkillState("B.bond.5"),
      score: 0.7,
      recentCorrect: 4,
    };
    const next = updateMastery(state, {
      correct: false,
      hintLevelUsed: 0,
      representation: "part-whole",
      completedAt: 1000,
    });

    expect(next.score).toBeCloseTo(0.665);
    expect(next.recentCorrect).toBe(3);
  });

  it("awards retention evidence after delayed success", () => {
    const state = {
      ...createInitialSkillState("B.bond.5"),
      lastSuccessfulAt: 0,
    };
    const retained = updateMastery(state, {
      correct: true,
      hintLevelUsed: 1,
      representation: "part-whole",
      completedAt: 3 * 86400000,
    });

    expect(retained.score).toBeCloseTo(0.11);
  });
});
