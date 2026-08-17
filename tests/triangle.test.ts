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
      expect(triangleAnswer(exercise)).toBe(definition.validTriangles.length);
      expect(
        evaluateTriangleAnswer(exercise, triangleAnswer(exercise)).correct,
      ).toBe(true);
    }
  });

  it("teaches systematic search before answer", () => {
    const exercise = generateTriangleExercise({ seed: 0 });
    expect(triangleHint(exercise, 1).payload).toContain("nhỏ");
    expect(triangleHint(exercise, 2).payload).toContain("ghép");
    expect(triangleHint(exercise, 3).type).toBe("visual");
  });

  it("keeps worksheet-style composite counts authored explicitly", () => {
    const exercise = generateTriangleExercise({
      seed: 1,
      definitionId: "rectangle-composites",
    });

    expect(triangleAnswer(exercise)).toBe(8);
    expect(
      evaluateTriangleAnswer(exercise, {
        count: 7,
        selectedIds: ["top", "right", "bottom", "left"],
      }).errorCode,
    ).toBe("missed-composite-triangle");
  });
});
