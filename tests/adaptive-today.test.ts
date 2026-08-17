import { describe, expect, it } from "vitest";
import { planAdaptiveToday } from "../src/core/adaptive/today";

describe("adaptive Today planner", () => {
  const base = {
    recentAttempts: [],
    parentOverrides: {
      focusedSkillIds: [],
      pausedSkillIds: [],
      manuallyUnlockedSkillIds: [],
    },
  };

  it("starts with varied foundational modules instead of one fixed bond", () => {
    const modules = planAdaptiveToday({
      ...base,
      skillStates: [],
      slotCount: 16,
    });
    expect(modules).toHaveLength(16);
    expect(new Set(modules)).toEqual(new Set(["A", "B"]));
  });

  it("raises focused module priority and excludes paused module", () => {
    const modules = planAdaptiveToday({
      ...base,
      skillStates: [
        {
          skillId: "A.quantity.1-3",
          stage: "learning",
          score: 0.4,
          totalAttempts: 1,
          recentCorrect: 1,
          recentIndependentCorrect: 0,
        },
        {
          skillId: "C.plus1",
          stage: "learning",
          score: 0.5,
          totalAttempts: 1,
          recentCorrect: 1,
          recentIndependentCorrect: 0,
        },
        {
          skillId: "B.bond.5",
          stage: "learning",
          score: 0.1,
          totalAttempts: 1,
          recentCorrect: 0,
          recentIndependentCorrect: 0,
          parentPaused: true,
        },
      ],
      parentOverrides: {
        focusedSkillIds: ["C.plus1"],
        pausedSkillIds: ["B.bond.5"],
        manuallyUnlockedSkillIds: [],
      },
      slotCount: 10,
    });
    expect(modules[0]).toBe("C");
    expect(modules).not.toContain("B");
  });
});
