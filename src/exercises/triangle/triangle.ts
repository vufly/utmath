import type {
  EvaluationResult,
  Hint,
  HintLevel,
  TriangleExercise,
} from "../../core/types/domain";

export interface TrianglePoint {
  id: string;
  x: number;
  y: number;
}

export interface ValidTriangle {
  id: string;
  vertices: [string, string, string];
  sizeClass: "small" | "medium" | "large";
}

export interface TriangleDefinition {
  id: string;
  points: TrianglePoint[];
  edges: Array<[string, string]>;
  validTriangles: ValidTriangle[];
  hintTriangleId: string;
}

const separatePoints: TrianglePoint[] = [
  { id: "a", x: 35, y: 35 },
  { id: "b", x: 15, y: 100 },
  { id: "c", x: 55, y: 100 },
  { id: "d", x: 100, y: 35 },
  { id: "e", x: 80, y: 100 },
  { id: "f", x: 120, y: 100 },
  { id: "g", x: 165, y: 35 },
  { id: "h", x: 145, y: 100 },
  { id: "i", x: 185, y: 100 },
];

const rectanglePoints: TrianglePoint[] = [
  { id: "tl", x: 20, y: 20 },
  { id: "tr", x: 180, y: 20 },
  { id: "br", x: 180, y: 180 },
  { id: "bl", x: 20, y: 180 },
  { id: "c", x: 100, y: 100 },
];

const rectangleEdges: Array<[string, string]> = [
  ["tl", "tr"],
  ["tr", "br"],
  ["br", "bl"],
  ["bl", "tl"],
  ["tl", "c"],
  ["tr", "c"],
  ["br", "c"],
  ["bl", "c"],
];

export const triangleDefinitions: TriangleDefinition[] = [
  {
    id: "three-separate",
    points: separatePoints,
    edges: [
      ["a", "b"],
      ["b", "c"],
      ["c", "a"],
      ["d", "e"],
      ["e", "f"],
      ["f", "d"],
      ["g", "h"],
      ["h", "i"],
      ["i", "g"],
    ],
    validTriangles: [
      { id: "left", vertices: ["a", "b", "c"], sizeClass: "small" },
      { id: "middle", vertices: ["d", "e", "f"], sizeClass: "small" },
      { id: "right", vertices: ["g", "h", "i"], sizeClass: "small" },
    ],
    hintTriangleId: "right",
  },
  {
    id: "four-in-rectangle",
    points: rectanglePoints,
    edges: rectangleEdges,
    validTriangles: [
      { id: "top", vertices: ["tl", "tr", "c"], sizeClass: "small" },
      { id: "right", vertices: ["tr", "br", "c"], sizeClass: "small" },
      { id: "bottom", vertices: ["br", "bl", "c"], sizeClass: "small" },
      { id: "left", vertices: ["bl", "tl", "c"], sizeClass: "small" },
    ],
    hintTriangleId: "bottom",
  },
  {
    id: "rectangle-composites",
    points: rectanglePoints,
    edges: rectangleEdges,
    validTriangles: [
      { id: "top", vertices: ["tl", "tr", "c"], sizeClass: "small" },
      { id: "right", vertices: ["tr", "br", "c"], sizeClass: "small" },
      { id: "bottom", vertices: ["br", "bl", "c"], sizeClass: "small" },
      { id: "left", vertices: ["bl", "tl", "c"], sizeClass: "small" },
      { id: "top-right", vertices: ["tl", "tr", "br"], sizeClass: "large" },
      { id: "right-bottom", vertices: ["tr", "br", "bl"], sizeClass: "large" },
      { id: "bottom-left", vertices: ["br", "bl", "tl"], sizeClass: "large" },
      { id: "left-top", vertices: ["bl", "tl", "tr"], sizeClass: "large" },
    ],
    hintTriangleId: "top-right",
  },
];

export function pointsForTriangle(
  definition: TriangleDefinition,
  triangle: ValidTriangle,
): string {
  return triangle.vertices
    .map((id) => {
      const point = definition.points.find((item) => item.id === id);
      if (!point) throw new Error("Triangle point is invalid.");
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

export function pathForDefinition(definition: TriangleDefinition): string {
  return definition.edges
    .map(([from, to]) => {
      const start = definition.points.find((point) => point.id === from);
      const end = definition.points.find((point) => point.id === to);
      if (!start || !end) throw new Error("Triangle edge is invalid.");
      return `M${start.x} ${start.y}L${end.x} ${end.y}`;
    })
    .join(" ");
}

export function generateTriangleExercise(options: {
  seed: number;
  definitionId?: string;
  stage?: TriangleExercise["stage"];
}): TriangleExercise {
  const definition = options.definitionId
    ? triangleDefinitions.find((item) => item.id === options.definitionId)
    : triangleDefinitions[options.seed % triangleDefinitions.length];
  if (!definition) throw new Error("Triangle definition is invalid.");
  const stage = options.stage ?? "select";
  return {
    id: `triangle-${options.seed}`,
    kind: "triangle",
    module: "F",
    skillIds: [
      "F.systematic-count",
      ...(stage === "independent"
        ? ["F.independent-count"]
        : ["F.size-search"]),
    ],
    difficulty: definition.validTriangles.some(
      (item) => item.sizeClass === "large",
    )
      ? 3
      : 1,
    representation: "triangle-svg",
    promptKey:
      stage === "independent"
        ? "triangle.independent-count"
        : "triangle.find-all",
    generator: {
      generatorId: "triangle-authored",
      generatorVersion: 2,
      seed: options.seed,
      params: {
        definitionId: definition.id,
        count: definition.validTriangles.length,
        stage,
      },
    },
    definitionId: definition.id,
    answerMode: stage === "independent" ? "count" : "select",
    stage,
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
  const selectedIds =
    typeof answer === "object" &&
    answer !== null &&
    Array.isArray((answer as { selectedIds?: unknown }).selectedIds)
      ? (answer as { selectedIds: unknown[] }).selectedIds.filter(
          (id): id is string => typeof id === "string",
        )
      : [];
  const normalizedAnswer =
    typeof answer === "object" && answer !== null
      ? Number((answer as { count?: unknown }).count)
      : typeof answer === "number"
        ? answer
        : Number(answer);
  const correct = normalizedAnswer === triangleAnswer(exercise);
  const definition = triangleDefinitions.find(
    (item) => item.id === exercise.definitionId,
  );
  const missed = definition?.validTriangles.find(
    (triangle) => !selectedIds.includes(triangle.id),
  );
  return {
    correct,
    normalizedAnswer,
    errorCode: correct
      ? undefined
      : missed?.sizeClass === "small"
        ? "missed-small-triangle"
        : "missed-composite-triangle",
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
  const definition = triangleDefinitions.find(
    (item) => item.id === exercise.definitionId,
  );
  if (level === 1)
    return {
      level,
      type: "text",
      payload: "Con thử tìm từ tam giác nhỏ đến tam giác lớn nhé.",
    };
  if (level === 2)
    return {
      level,
      type: "text",
      payload:
        "Con đã tìm các tam giác nhỏ chưa? Bây giờ tìm tam giác ghép từ nhiều phần nhé.",
    };
  return {
    level,
    type: "visual",
    payload: { hintTriangleId: definition?.hintTriangleId },
  };
}
