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
});
