import { createSeededRandom } from "../../core/randomness/prng";
import type {
  ArithmeticExercise,
  EvaluationResult,
  Hint,
  HintLevel,
} from "../../core/types/domain";

export type ArithmeticStrategy =
  "plus1" | "minus1" | "doubles" | "make10" | "subtract-bond";

export function generateArithmeticExercise(options: {
  seed: number;
  strategy?: ArithmeticStrategy;
}): ArithmeticExercise {
  const random = createSeededRandom(options.seed);
  const strategy =
    options.strategy ??
    random.pick([
      "plus1",
      "minus1",
      "doubles",
      "make10",
      "subtract-bond",
    ] as const);
  let left = 0;
  let right = 0;
  let operation: ArithmeticExercise["operation"] = "add";

  if (strategy === "plus1") {
    left = random.int(0, 9);
    right = 1;
  } else if (strategy === "minus1") {
    left = random.int(1, 10);
    right = 1;
    operation = "subtract";
  } else if (strategy === "doubles") {
    left = random.int(1, 5);
    right = left;
  } else if (strategy === "make10") {
    left = random.int(1, 9);
    right = 10 - left;
  } else {
    left = random.int(3, 10);
    right = random.int(1, left);
    operation = "subtract";
  }

  const result = operation === "add" ? left + right : left - right;
  return {
    id: `arithmetic-${options.seed}`,
    kind: "arithmetic",
    module: "C",
    skillIds: [`C.${strategy}`],
    difficulty: strategy === "plus1" || strategy === "minus1" ? 1 : 2,
    representation: "equation",
    promptKey: "arithmetic.solve",
    generator: {
      generatorId: "mental-arithmetic",
      generatorVersion: 1,
      seed: options.seed,
      params: { strategy, operation, left, right, result },
    },
    operation,
    left,
    right,
    result,
    strategySkillId: `C.${strategy}`,
  };
}

export function evaluateArithmeticAnswer(
  exercise: ArithmeticExercise,
  answer: unknown,
): EvaluationResult {
  const normalizedAnswer = typeof answer === "number" ? answer : Number(answer);
  const correct = normalizedAnswer === exercise.result;
  return {
    correct,
    normalizedAnswer,
    errorCode: correct ? undefined : "arithmetic-error",
    evidence: exercise.skillIds.map((skillId) => ({
      skillId,
      weight: correct ? 1 : -0.3,
      reason: correct ? "independent-success" : "incorrect",
    })),
    nextHintSuggestion: correct ? undefined : 1,
  };
}

export function arithmeticHint(
  exercise: ArithmeticExercise,
  level: HintLevel,
): Hint {
  const strategy = exercise.strategySkillId.replace("C.", "");
  if (level === 1) {
    const text =
      strategy === "plus1" || strategy === "minus1"
        ? "Con nghĩ đến số đứng ngay cạnh nhé."
        : strategy === "doubles"
          ? "Hai số giống nhau tạo thành số đôi."
          : strategy === "make10"
            ? "Hai phần này ghép thành 10."
            : "Con thử đổi phép trừ thành hai phần của một số.";
    return { level, type: "text", payload: text };
  }
  if (level === 2)
    return {
      level,
      type: "visual",
      payload: {
        left: exercise.left,
        right: exercise.right,
        operation: exercise.operation,
      },
    };
  return { level, type: "text", payload: `Đáp án là ${exercise.result}.` };
}
