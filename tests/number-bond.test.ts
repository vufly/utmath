import { describe, expect, it } from "vitest";
import {
  correctNumberBondAnswer,
  evaluateNumberBondAnswer,
  generateNumberBondExercise,
  numberBondHint,
} from "../src/exercises/number-bond/number-bond";

describe("number bond exercises", () => {
  it("replays generated exercise from seed", () => {
    expect(generateNumberBondExercise({ seed: 42, whole: 5 })).toEqual(
      generateNumberBondExercise({ seed: 42, whole: 5 }),
    );
  });

  it("always creates a valid intended answer", () => {
    for (let seed = 0; seed < 100; seed += 1) {
      const exercise = generateNumberBondExercise({ seed, whole: 5 });
      const answer = correctNumberBondAnswer(exercise);
      expect(answer).toBeGreaterThanOrEqual(0);
      expect(answer).toBeLessThanOrEqual(5);
      expect(evaluateNumberBondAnswer(exercise, answer).correct).toBe(true);
    }
  });

  it("returns meaningful wrong-answer evidence and progressive hints", () => {
    const exercise = generateNumberBondExercise({
      seed: 2,
      whole: 5,
      unknown: "part-b",
    });
    const result = evaluateNumberBondAnswer(exercise, 99);

    expect(result).toMatchObject({
      correct: false,
      errorCode: "wrong-number-bond",
      nextHintSuggestion: 1,
    });
    expect(numberBondHint(exercise, 1).type).toBe("text");
    expect(numberBondHint(exercise, 2).type).toBe("visual");
  });
});
