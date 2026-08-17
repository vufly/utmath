import { createSeededRandom } from "../../core/randomness/prng";
import type {
  EvaluationResult,
  Hint,
  HintLevel,
  QuantityExercise,
  RepresentationType,
} from "../../core/types/domain";

export function generateQuantityExercise(options: {
  seed: number;
  quantity?: number;
  representation?: RepresentationType;
}): QuantityExercise {
  const random = createSeededRandom(options.seed);
  const quantity = options.quantity ?? random.int(1, 10);

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)
    throw new Error("Quantity must be between 1 and 10.");

  const representation =
    options.representation ??
    (quantity <= 3 ? "dots" : quantity <= 5 ? "five-frame" : "ten-frame");
  const skillId =
    quantity <= 3
      ? "A.quantity.1-3"
      : quantity <= 5
        ? "A.quantity.4-5-structured"
        : "A.quantity.6-10-five-anchor";

  return {
    id: `quantity-${options.seed}`,
    kind: "quantity",
    module: "A",
    skillIds: [skillId],
    difficulty: quantity <= 3 ? 1 : quantity <= 5 ? 2 : 3,
    representation,
    promptKey: "quantity.how-many",
    generator: {
      generatorId: "quantity-recognition",
      generatorVersion: 1,
      seed: options.seed,
      params: { quantity, representation },
    },
    quantity,
    answerMode: "numeral",
  };
}

export function evaluateQuantityAnswer(
  exercise: QuantityExercise,
  answer: unknown,
): EvaluationResult {
  const normalizedAnswer = typeof answer === "number" ? answer : Number(answer);
  const correct = normalizedAnswer === exercise.quantity;

  return {
    correct,
    normalizedAnswer,
    errorCode: correct ? undefined : "wrong-count",
    evidence: exercise.skillIds.map((skillId) => ({
      skillId,
      weight: correct ? 1 : -0.3,
      reason: correct ? "independent-success" : "incorrect",
    })),
    nextHintSuggestion: correct ? undefined : 1,
  };
}

export function quantityHint(
  exercise: QuantityExercise,
  level: HintLevel,
): Hint {
  if (level === 1)
    return {
      level,
      type: "text",
      payload: "Con thử nhìn theo nhóm, không cần đếm vội nhé.",
    };
  if (level === 2)
    return {
      level,
      type: "visual",
      payload: {
        quantity: exercise.quantity,
        representation: exercise.representation,
      },
    };
  return { level, type: "text", payload: `Có ${exercise.quantity} chấm.` };
}
