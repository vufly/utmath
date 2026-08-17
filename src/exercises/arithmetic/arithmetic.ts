import { createSeededRandom } from "../../core/randomness/prng";
import type {
  ArithmeticExercise,
  EvaluationResult,
  Hint,
  HintLevel,
} from "../../core/types/domain";

export type ArithmeticStrategy =
  | "plus0"
  | "minus0"
  | "plus1"
  | "minus1"
  | "plus2"
  | "minus2"
  | "start-larger"
  | "doubles"
  | "near-doubles"
  | "five-anchor"
  | "make10"
  | "subtract-bond"
  | "mixed";

const practiceStrategies: Exclude<ArithmeticStrategy, "mixed">[] = [
  "plus0",
  "minus0",
  "plus1",
  "minus1",
  "plus2",
  "minus2",
  "start-larger",
  "doubles",
  "near-doubles",
  "five-anchor",
  "make10",
  "subtract-bond",
];

export function generateArithmeticExercise(options: {
  seed: number;
  strategy?: ArithmeticStrategy;
}): ArithmeticExercise {
  const random = createSeededRandom(options.seed);
  const requestedStrategy =
    options.strategy ?? random.pick([...practiceStrategies, "mixed"]);
  const strategy =
    requestedStrategy === "mixed"
      ? random.pick(practiceStrategies)
      : requestedStrategy;
  let left = 0;
  let right = 0;
  let operation: ArithmeticExercise["operation"] = "add";

  if (strategy === "plus0") {
    left = random.int(0, 10);
  } else if (strategy === "minus0") {
    left = random.int(0, 10);
    operation = "subtract";
  } else if (strategy === "plus1") {
    left = random.int(0, 9);
    right = 1;
  } else if (strategy === "minus1") {
    left = random.int(1, 10);
    right = 1;
    operation = "subtract";
  } else if (strategy === "plus2") {
    left = random.int(0, 8);
    right = 2;
  } else if (strategy === "minus2") {
    left = random.int(2, 10);
    right = 2;
    operation = "subtract";
  } else if (strategy === "start-larger") {
    left = random.int(1, 4);
    right = random.int(5, 10 - left);
  } else if (strategy === "doubles") {
    left = random.int(1, 5);
    right = left;
  } else if (strategy === "near-doubles") {
    left = random.int(1, 4);
    right = left + 1;
  } else if (strategy === "five-anchor") {
    left = 5;
    right = random.int(0, 5);
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
    skillIds:
      requestedStrategy === "mixed"
        ? ["C.mixed", `C.${strategy}`]
        : [`C.${strategy}`],
    difficulty: ["plus0", "minus0", "plus1", "minus1"].includes(strategy)
      ? 1
      : requestedStrategy === "mixed"
        ? 4
        : 2,
    representation: "equation",
    promptKey: "arithmetic.solve",
    generator: {
      generatorId: "mental-arithmetic",
      generatorVersion: 2,
      seed: options.seed,
      params: { strategy, requestedStrategy, operation, left, right, result },
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
      strategy === "plus0" || strategy === "minus0"
        ? "Cộng hoặc trừ 0 thì số không đổi."
        : strategy === "plus1" || strategy === "minus1"
          ? "Con nghĩ đến số đứng ngay cạnh nhé."
          : strategy === "plus2" || strategy === "minus2"
            ? "Con đi tiến hoặc lùi hai bước từ số đã biết nhé."
            : strategy === "start-larger"
              ? "Con bắt đầu từ số lớn hơn rồi đếm thêm số bé hơn nhé."
              : strategy === "doubles"
                ? "Hai số giống nhau tạo thành số đôi."
                : strategy === "near-doubles"
                  ? "Hãy nghĩ đến một số đôi, rồi thêm một."
                  : strategy === "five-anchor"
                    ? "Bắt đầu với 5 rồi đếm thêm nhé."
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
