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
      definitionId: "worksheet-wedge",
    });

    expect(triangleAnswer(exercise)).toBe(8);
    expect(
      evaluateTriangleAnswer(exercise, {
        count: 7,
        selectedIds: [
          "a-b-d",
          "b-d-e",
          "d-e-f",
          "e-f-g",
          "f-g-h",
          "g-h-i",
          "h-i-c",
        ],
      }).errorCode,
    ).toBe("missed-composite-triangle");
  });

  it("requires the authored triangle regions in selection mode", () => {
    const exercise = generateTriangleExercise({
      seed: 1,
      definitionId: "worksheet-wedge",
    });

    expect(
      evaluateTriangleAnswer(exercise, {
        count: 8,
        selectedIds: Array(8).fill("a-b-d"),
      }).correct,
    ).toBe(false);
  });
});
