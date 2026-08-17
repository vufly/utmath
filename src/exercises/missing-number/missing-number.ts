import { createSeededRandom } from "../../core/randomness/prng";
import type {
  EvaluationResult,
  Hint,
  HintLevel,
  MissingNumberExercise,
} from "../../core/types/domain";

export type MissingNumberForm =
  | "add-result"
  | "add-first"
  | "add-second"
  | "sub-result"
  | "sub-removed"
  | "sub-start";

export function generateMissingNumberExercise(options: {
  seed: number;
  form?: MissingNumberForm;
}): MissingNumberExercise {
  const random = createSeededRandom(options.seed);
  const form =
    options.form ??
    random.pick([
      "add-result",
      "add-first",
      "add-second",
      "sub-result",
      "sub-removed",
      "sub-start",
    ] as const);
  const addition = form.startsWith("add");
  const left = addition ? random.int(0, 9) : random.int(1, 10);
  const right = addition ? random.int(0, 10 - left) : random.int(0, left);
  const result = addition ? left + right : left - right;
  const unknown =
    form === "add-first" || form === "sub-start"
      ? "left"
      : form === "add-second" || form === "sub-removed"
        ? "right"
        : "result";

  return {
    id: `missing-number-${options.seed}`,
    kind: "missing-number",
    module: "D",
    skillIds: [
      `D.${addition ? "add" : "sub"}.${form.replace(/^add-|^sub-/, "missing-")}`,
    ],
    difficulty: unknown === "result" ? 1 : 2,
    representation: "equation",
    promptKey: "missing-number.solve",
    generator: {
      generatorId: "missing-number",
      generatorVersion: 2,
      seed: options.seed,
      params: {
        form,
        operation: addition ? "add" : "subtract",
        left,
        right,
        result,
      },
    },
    operation: addition ? "add" : "subtract",
    left: unknown === "left" ? undefined : left,
    right: unknown === "right" ? undefined : right,
    result: unknown === "result" ? undefined : result,
    unknown,
  };
}

export function missingNumberAnswer(exercise: MissingNumberExercise): number {
  const params = exercise.generator?.params;
  const key = exercise.unknown;
  const value = params?.[key];
  if (typeof value !== "number")
    throw new Error("Missing-number generator data is invalid.");
  return value;
}

export function evaluateMissingNumberAnswer(
  exercise: MissingNumberExercise,
  answer: unknown,
): EvaluationResult {
  const normalizedAnswer = typeof answer === "number" ? answer : Number(answer);
  const correct = normalizedAnswer === missingNumberAnswer(exercise);
  return {
    correct,
    normalizedAnswer,
    errorCode: correct ? undefined : "unknown-position-error",
    evidence: exercise.skillIds.map((skillId) => ({
      skillId,
      weight: correct ? 1 : -0.3,
      reason: correct ? "independent-success" : "incorrect",
    })),
    nextHintSuggestion: correct ? undefined : 1,
  };
}

export function missingNumberHint(
  exercise: MissingNumberExercise,
  level: HintLevel,
): Hint {
  if (level === 1)
    return {
      level,
      type: "text",
      payload:
        exercise.operation === "add"
          ? exercise.unknown === "result"
            ? "Con ghép hai phần lại để tìm cả số nhé."
            : "Con thử tìm phần còn thiếu để ghép thành cả số nhé."
          : exercise.unknown === "right"
            ? "Con nhìn phần còn lại, rồi tìm số đã được lấy đi nhé."
            : exercise.unknown === "left"
              ? "Số ban đầu bằng phần đã lấy đi cộng phần còn lại."
              : "Con lấy đi một phần để tìm số còn lại.",
    };
  if (level === 2)
    return { level, type: "visual", payload: exercise.generator?.params };
  return {
    level,
    type: "text",
    payload: `Đáp án là ${missingNumberAnswer(exercise)}.`,
  };
}
