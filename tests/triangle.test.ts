import { describe, expect, it } from "vitest";
import {
  evaluateTriangleAnswer,
  generateTriangleExercise,
  triangleAnswer,
  triangleDefinitions,
  triangleHint,
} from "../src/exercises/triangle/triangle";

describe("authored triangle exercises", () => {
  it("uses only explicit authored definitions", () => {
    for (const definition of triangleDefinitions) {
      const exercise = generateTriangleExercise({
        seed: 1,
        definitionId: definition.id,
      });
      expect(triangleAnswer(exercise)).toBe(definition.validTriangleIds.length);
      expect(
        evaluateTriangleAnswer(exercise, triangleAnswer(exercise)).correct,
      ).toBe(true);
    }
  });

  it("teaches systematic search before answer", () => {
    const exercise = generateTriangleExercise({ seed: 0 });
    expect(triangleHint(exercise, 1).payload).toContain("nhỏ");
    expect(triangleHint(exercise, 2).type).toBe("visual");
    expect(triangleHint(exercise, 3).payload).toBe(
      `Có tất cả ${triangleAnswer(exercise)} tam giác.`,
    );
  });
});
