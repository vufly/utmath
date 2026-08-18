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
    const exercise = generateStoryExercise({
      seed: 2,
      storyType: "take-away",
      stage: "direction",
    });
    expect(storyHint(exercise, 1).payload).toContain("giảm");
    expect(storyHint(exercise, 2).type).toBe("visual");
    expect(storyHint(exercise, 3).payload).toBe("Đáp án là giảm đi.");
  });

  it("uses before-and-after language in its final hint", () => {
    const exercise = generateStoryExercise({
      seed: 2,
      storyType: "add-to",
      stage: "before-after",
    });

    expect(storyHint(exercise, 3).payload).toBe("Đáp án là nhiều hơn.");
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

  it("asks for the missing part at the parts-whole stage", () => {
    const missing = generateStoryExercise({
      seed: 3,
      storyType: "missing-part",
      stage: "parts-whole",
    });

    expect(evaluateStoryAnswer(missing, missing.changeCount).correct).toBe(
      true,
    );
    expect(evaluateStoryAnswer(missing, missing.total).correct).toBe(false);
  });

  it("formats equal relevant numbers as a selectable Vietnamese pair", () => {
    const exercise = {
      ...generateStoryExercise({
        seed: 3,
        storyType: "missing-part",
        stage: "numbers",
      }),
      startCount: 4,
      changeCount: 4,
      total: 8,
    };

    expect(evaluateStoryAnswer(exercise, "4,4").correct).toBe(true);
    expect(storyHint(exercise, 3).payload).toBe("Đáp án là 4 và 4.");
  });

  it("uses basket order for the fruit equation", () => {
    const exercise = {
      ...generateStoryExercise({
        seed: 3,
        storyType: "combine",
        stage: "equation-choice",
      }),
      sceneId: "fruit-basket" as const,
      objectKind: "apple" as const,
      startCount: 4,
      changeCount: 6,
      total: 10,
    };

    expect(evaluateStoryAnswer(exercise, "6+4=10").correct).toBe(true);
    expect(evaluateStoryAnswer(exercise, "4+6=10").correct).toBe(false);
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
