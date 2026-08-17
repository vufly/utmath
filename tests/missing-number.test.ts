import { describe, expect, it } from "vitest";
import {
  evaluateMissingNumberAnswer,
  generateMissingNumberExercise,
  missingNumberAnswer,
  missingNumberHint,
  type MissingNumberForm,
} from "../src/exercises/missing-number/missing-number";

const forms: MissingNumberForm[] = [
  "add-result",
  "add-first",
  "add-second",
  "sub-result",
  "sub-removed",
  "sub-start",
];

describe("missing-number exercises", () => {
  it("gives exactly one valid answer for every form", () => {
    for (const form of forms) {
      for (let seed = 0; seed < 30; seed += 1) {
        const exercise = generateMissingNumberExercise({ seed, form });
        const answer = missingNumberAnswer(exercise);
        expect(answer).toBeGreaterThanOrEqual(0);
        expect(answer).toBeLessThanOrEqual(10);
        expect(evaluateMissingNumberAnswer(exercise, answer).correct).toBe(
          true,
        );
      }
    }
  });

  it("uses relational hint before answer reveal", () => {
    const exercise = generateMissingNumberExercise({
      seed: 4,
      form: "sub-start",
    });
    expect(missingNumberHint(exercise, 1).payload).toBe(
      "Phép trừ cũng là tìm phần còn lại.",
    );
    expect(missingNumberHint(exercise, 2).type).toBe("visual");
    expect(missingNumberHint(exercise, 3).payload).toBe(
      `Đáp án là ${missingNumberAnswer(exercise)}.`,
    );
  });
});
