import { describe, expect, it } from "vitest";
import {
  evaluateQuantityAnswer,
  generateQuantityExercise,
  quantityHint,
} from "../src/exercises/quantity/quantity";

describe("quantity exercises", () => {
  it("replays from seed and selects structured representation", () => {
    expect(generateQuantityExercise({ seed: 9, quantity: 7 })).toEqual(
      generateQuantityExercise({ seed: 9, quantity: 7 }),
    );
    expect(
      generateQuantityExercise({ seed: 9, quantity: 3 }).representation,
    ).toBe("dots");
    expect(
      generateQuantityExercise({ seed: 9, quantity: 5 }).representation,
    ).toBe("five-frame");
    expect(
      generateQuantityExercise({ seed: 9, quantity: 7 }).representation,
    ).toBe("ten-frame");
  });

  it("keeps generated quantities and intended answers in range", () => {
    for (let seed = 0; seed < 100; seed += 1) {
      const exercise = generateQuantityExercise({ seed });
      expect(exercise.quantity).toBeGreaterThanOrEqual(1);
      expect(exercise.quantity).toBeLessThanOrEqual(10);
      expect(evaluateQuantityAnswer(exercise, exercise.quantity).correct).toBe(
        true,
      );
    }
  });

  it("provides visual support before revealing answer", () => {
    const exercise = generateQuantityExercise({ seed: 1, quantity: 6 });
    expect(quantityHint(exercise, 1).type).toBe("text");
    expect(quantityHint(exercise, 2).type).toBe("visual");
    expect(quantityHint(exercise, 3).payload).toBe("Có 6 chấm.");
  });
});
