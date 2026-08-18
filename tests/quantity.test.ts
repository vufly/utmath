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
      expect(exercise.quantity).toBeGreaterThanOrEqual(2);
      expect(exercise.quantity).toBeLessThanOrEqual(10);
      expect(evaluateQuantityAnswer(exercise, exercise.quantity).correct).toBe(
        true,
      );
    }
  });

  it("covers bidirectional frames, flashes, and representation matching", () => {
    const frame = generateQuantityExercise({
      seed: 4,
      stage: "number-to-frame",
    });
    const flash = generateQuantityExercise({ seed: 4, stage: "flash" });
    const match = generateQuantityExercise({ seed: 4, stage: "match" });

    expect(frame.answerMode).toBe("frame");
    expect(frame.layout).toBe("five-frame");
    expect(flash.flashDurationMs).toBeGreaterThanOrEqual(1000);
    expect(match.answerMode).toBe("match");
    expect(match.matchChoices).toContain(match.quantity);
  });

  it("provides visual support before revealing answer", () => {
    const exercise = generateQuantityExercise({ seed: 1, quantity: 6 });
    expect(quantityHint(exercise, 1).type).toBe("text");
    expect(quantityHint(exercise, 2).type).toBe("visual");
    expect(quantityHint(exercise, 3).payload).toBe(
      "Có 5 chấm ở hàng trên và 1 chấm ở hàng dưới, là 6.",
    );
  });

  it("uses interaction-specific hints while filling a frame", () => {
    const exercise = generateQuantityExercise({
      seed: 1,
      quantity: 5,
      stage: "number-to-frame",
    });

    expect(quantityHint(exercise, 1).payload).toBe(
      "Con chạm vào các ô trống để đặt đủ 5 chấm nhé.",
    );
    expect(quantityHint(exercise, 3).payload).toBe("Con cần đặt 5 chấm.");
  });

  it("names visual structure instead of giving a generic recognition hint", () => {
    const structured = generateQuantityExercise({
      seed: 1,
      quantity: 5,
      stage: "structured",
    });

    expect(["dice", "domino", "five-frame"]).toContain(structured.layout);
    expect(quantityHint(structured, 1).payload).not.toBe(
      "Con thử nhìn theo nhóm, không cần đếm vội nhé.",
    );
  });
});
