import { describe, expect, it } from "vitest";
import {
  evaluateStoryAnswer,
  generateStoryExercise,
  storyAnswer,
  storyHint,
} from "../src/exercises/story/story";

describe("picture story exercises", () => {
  it("generates reproducible results in range", () => {
    for (let seed = 0; seed < 100; seed += 1) {
      const exercise = generateStoryExercise({ seed });
      expect(storyAnswer(exercise)).toBeGreaterThanOrEqual(0);
      expect(storyAnswer(exercise)).toBeLessThanOrEqual(10);
      expect(evaluateStoryAnswer(exercise, storyAnswer(exercise)).correct).toBe(
        true,
      );
    }
  });

  it("teaches change direction before answer", () => {
    const exercise = generateStoryExercise({ seed: 2, storyType: "take-away" });
    expect(storyHint(exercise, 1).payload).toContain("giảm");
    expect(storyHint(exercise, 2).type).toBe("visual");
    expect(storyHint(exercise, 3).payload).toBe(
      `Đáp án là ${storyAnswer(exercise)}.`,
    );
  });

  it("supports all semantic story stages and story types", () => {
    const direction = generateStoryExercise({ seed: 3, stage: "direction" });
    const operator = generateStoryExercise({ seed: 3, stage: "operator" });
    const build = generateStoryExercise({ seed: 3, stage: "build" });
    const missing = generateStoryExercise({
      seed: 3,
      storyType: "missing-part",
    });

    expect(evaluateStoryAnswer(direction, "increase").correct).toBe(
      direction.storyType !== "take-away",
    );
    expect(
      evaluateStoryAnswer(
        operator,
        operator.storyType === "take-away" ? "-" : "+",
      ).correct,
    ).toBe(true);
    expect(
      evaluateStoryAnswer(
        build,
        `${build.startCount}${build.storyType === "take-away" ? "-" : "+"}${build.changeCount}=${build.total}`,
      ).correct,
    ).toBe(true);
    expect(storyAnswer(missing)).toBe(missing.changeCount);
  });

  it("uses a story-compatible semantic scene with exact counts", () => {
    const scenes = {
      "add-to": ["duck-pond"],
      "take-away": ["bird-tree"],
      combine: ["fruit-basket", "fish-pond"],
      "missing-part": ["book-desk", "pencil-desk"],
    } as const;

    for (const storyType of Object.keys(scenes) as Array<keyof typeof scenes>) {
      for (let seed = 0; seed < 20; seed += 1) {
        const exercise = generateStoryExercise({ seed, storyType });
        expect(scenes[storyType]).toContain(exercise.sceneId);
        expect(exercise.generator?.params.sceneId).toBe(exercise.sceneId);
        expect(exercise.generator?.params.objectKind).toBe(exercise.objectKind);

        if (storyType === "take-away") {
          expect(exercise.total).toBe(
            (exercise.startCount ?? 0) - (exercise.changeCount ?? 0),
          );
        } else {
          expect(exercise.total).toBe(
            (exercise.startCount ?? 0) + (exercise.changeCount ?? 0),
          );
        }
      }
    }
  });
});
