import type {
  EvaluationResult,
  Hint,
  HintLevel,
  TriangleExercise,
} from "../../core/types/domain";

export interface TriangleDefinition {
  id: string;
  path: string;
  validTriangleIds: string[];
}

export const triangleDefinitions: TriangleDefinition[] = [
  {
    id: "four-triangles",
    path: "M100 15 15 185h170Z M57 100h86 M100 15v170",
    validTriangleIds: [
      "top",
      "left-small",
      "right-small",
      "left-large",
      "right-large",
      "outer",
    ],
  },
  {
    id: "three-triangles",
    path: "M100 15 15 185h170Z M57 100 143 100",
    validTriangleIds: ["top", "outer"],
  },
];

export function generateTriangleExercise(options: {
  seed: number;
  definitionId?: string;
}): TriangleExercise {
  const definition = options.definitionId
    ? triangleDefinitions.find((item) => item.id === options.definitionId)
    : triangleDefinitions[options.seed % triangleDefinitions.length];
  if (!definition) throw new Error("Triangle definition is invalid.");
  return {
    id: `triangle-${options.seed}`,
    kind: "triangle",
    module: "F",
    skillIds: ["F.independent-count", "F.systematic-count"],
    difficulty: 1,
    representation: "triangle-svg",
    promptKey: "triangle.count",
    generator: {
      generatorId: "triangle-authored",
      generatorVersion: 1,
      seed: options.seed,
      params: {
        definitionId: definition.id,
        count: definition.validTriangleIds.length,
      },
    },
    definitionId: definition.id,
    answerMode: "count",
  };
}

export function triangleAnswer(exercise: TriangleExercise): number {
  const count = exercise.generator?.params.count;
  if (typeof count !== "number")
    throw new Error("Triangle generator data is invalid.");
  return count;
}

export function evaluateTriangleAnswer(
  exercise: TriangleExercise,
  answer: unknown,
): EvaluationResult {
  const normalizedAnswer = typeof answer === "number" ? answer : Number(answer);
  const correct = normalizedAnswer === triangleAnswer(exercise);
  return {
    correct,
    normalizedAnswer,
    errorCode: correct ? undefined : "missed-composite-triangle",
    evidence: exercise.skillIds.map((skillId) => ({
      skillId,
      weight: correct ? 1 : -0.3,
      reason: correct ? "independent-success" : "incorrect",
    })),
    nextHintSuggestion: correct ? undefined : 1,
  };
}

export function triangleHint(
  exercise: TriangleExercise,
  level: HintLevel,
): Hint {
  if (level === 1)
    return {
      level,
      type: "text",
      payload: "Con thử tìm từ tam giác nhỏ đến tam giác lớn nhé.",
    };
  if (level === 2)
    return {
      level,
      type: "visual",
      payload: { definitionId: exercise.definitionId },
    };
  return {
    level,
    type: "text",
    payload: `Có tất cả ${triangleAnswer(exercise)} tam giác.`,
  };
}
