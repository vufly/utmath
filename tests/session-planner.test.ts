import { describe, expect, it } from "vitest";
import { moduleBCurriculum } from "../src/core/curriculum/module-b";
import { createInitialSkillState } from "../src/core/mastery/update";
import { planInitialSession } from "../src/core/session/planner";

const context = {
  skillStates: [createInitialSkillState("B.bond.5")],
  recentAttempts: [],
  curriculum: moduleBCurriculum,
  parentOverrides: {
    focusedSkillIds: [],
    pausedSkillIds: [],
    manuallyUnlockedSkillIds: [],
  },
  now: 1234,
};

describe("initial session planner", () => {
  it("starts with first eligible skill and generates a short session", () => {
    const session = planInitialSession(context);

    expect(session.id).toBe("today-1234");
    expect(session.targetDurationMin).toBe(10);
    expect(session.slots).toHaveLength(16);
    expect(
      session.slots.every((slot) => slot.preferredSkillIds[0] === "B.bond.5"),
    ).toBe(true);
  });

  it("honors focused, manually unlocked skills", () => {
    const session = planInitialSession({
      ...context,
      parentOverrides: {
        focusedSkillIds: ["B.bond.8"],
        pausedSkillIds: [],
        manuallyUnlockedSkillIds: ["B.bond.8"],
      },
    });

    expect(session.slots[0]?.preferredSkillIds).toEqual(["B.bond.8"]);
  });

  it("does not schedule paused skills", () => {
    const session = planInitialSession({
      ...context,
      parentOverrides: {
        focusedSkillIds: [],
        pausedSkillIds: ["B.bond.5"],
        manuallyUnlockedSkillIds: ["B.bond.6"],
      },
    });

    expect(
      session.slots.every((slot) => slot.preferredSkillIds[0] !== "B.bond.5"),
    ).toBe(true);
  });
});
