import { describe, expect, it } from "vitest";
import {
  arithmeticHint,
  evaluateArithmeticAnswer,
  generateArithmeticExercise,
  type ArithmeticStrategy,
} from "../src/exercises/arithmetic/arithmetic";

const strategies: ArithmeticStrategy[] = [
  "plus1",
  "minus1",
  "doubles",
  "make10",
  "subtract-bond",
];

describe("mental arithmetic exercises", () => {
  it("generates valid facts for every strategy", () => {
    for (const strategy of strategies) {
      for (let seed = 0; seed < 30; seed += 1) {
        const exercise = generateArithmeticExercise({ seed, strategy });
        expect(exercise.result).toBeGreaterThanOrEqual(0);
        expect(exercise.result).toBeLessThanOrEqual(10);
        expect(
          evaluateArithmeticAnswer(exercise, exercise.result).correct,
        ).toBe(true);
      }
    }
  });

  it("retains strategy-specific hint progression", () => {
    const exercise = generateArithmeticExercise({
      seed: 3,
      strategy: "doubles",
    });
    expect(arithmeticHint(exercise, 1).payload).toContain("số đôi");
    expect(arithmeticHint(exercise, 2).type).toBe("visual");
    expect(arithmeticHint(exercise, 3).payload).toBe(
      `Đáp án là ${exercise.result}.`,
    );
  });
});
