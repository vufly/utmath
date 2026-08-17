import { createSeededRandom } from "../../core/randomness/prng";
import type {
  EvaluationResult,
  Hint,
  HintLevel,
  QuantityExercise,
  RepresentationType,
} from "../../core/types/domain";

type QuantityStage =
  | "small-groups"
  | "structured"
  | "frame-to-number"
  | "number-to-frame"
  | "five-anchor"
  | "flash"
  | "match";

const stages: QuantityStage[] = [
  "small-groups",
  "structured",
  "frame-to-number",
  "number-to-frame",
  "five-anchor",
  "flash",
  "match",
];

function canonicalLayout(
  quantity: number,
): "dots" | "five-frame" | "ten-frame" {
  return quantity <= 3 ? "dots" : quantity <= 5 ? "five-frame" : "ten-frame";
}

function stageQuantity(
  stage: QuantityStage,
  random: ReturnType<typeof createSeededRandom>,
): number {
  if (stage === "small-groups") return random.int(1, 3);
  if (stage === "structured") return random.int(4, 5);
  if (stage === "frame-to-number" || stage === "number-to-frame")
    return random.int(1, 5);
  if (stage === "five-anchor") return random.int(6, 10);
  if (stage === "match") return random.int(2, 9);
  return random.int(1, 10);
}

export function generateQuantityExercise(options: {
  seed: number;
  quantity?: number;
  representation?: RepresentationType;
  stage?: QuantityStage;
  flashDurationMs?: number;
}): QuantityExercise {
  const random = createSeededRandom(options.seed);
  const stage =
    options.stage ?? (options.quantity ? undefined : random.pick(stages));
  const quantity =
    options.quantity ?? stageQuantity(stage ?? "small-groups", random);

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)
    throw new Error("Quantity must be between 1 and 10.");

  const layout =
    stage === "structured"
      ? random.pick(["dice", "domino", "five-frame"] as const)
      : stage === "frame-to-number" || stage === "number-to-frame"
        ? "five-frame"
        : canonicalLayout(quantity);
  const representation =
    options.representation ??
    (layout === "dice" || layout === "domino" ? "dots" : layout);
  const answerMode =
    stage === "number-to-frame"
      ? "frame"
      : stage === "match"
        ? "match"
        : "numeral";
  const skillId =
    stage === "frame-to-number" || stage === "number-to-frame"
      ? "A.quantity.frame-directions"
      : stage === "flash"
        ? "A.quantity.flash"
        : stage === "match"
          ? "A.quantity.multiple-representations"
          : quantity <= 3
            ? "A.quantity.1-3"
            : quantity <= 5
              ? "A.quantity.4-5-structured"
              : "A.quantity.6-10-five-anchor";
  const flashDurationMs =
    stage === "flash"
      ? (options.flashDurationMs ?? (quantity <= 5 ? 1300 : 1100))
      : undefined;
  const matchChoices =
    stage === "match"
      ? random.shuffle([quantity - 1, quantity, quantity + 1])
      : undefined;

  return {
    id: `quantity-${options.seed}`,
    kind: "quantity",
    module: "A",
    skillIds: [skillId],
    difficulty:
      stage === "flash" || stage === "match"
        ? 5
        : quantity <= 3
          ? 1
          : quantity <= 5
            ? 2
            : 3,
    representation,
    promptKey:
      answerMode === "frame"
        ? "quantity.fill-frame"
        : answerMode === "match"
          ? "quantity.match-representation"
          : flashDurationMs
            ? "quantity.flash"
            : "quantity.how-many",
    generator: {
      generatorId: "quantity-recognition",
      generatorVersion: 2,
      seed: options.seed,
      params: {
        quantity,
        representation,
        layout,
        stage,
        answerMode,
        flashDurationMs,
        matchChoices,
      },
    },
    quantity,
    answerMode,
    layout,
    flashDurationMs,
    matchChoices,
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
  if (exercise.quantity > 5) {
    return {
      level,
      type: "text",
      payload: `Có 5 chấm ở hàng trên và ${exercise.quantity - 5} chấm ở hàng dưới, là ${exercise.quantity}.`,
    };
  }
  return { level, type: "text", payload: `Có ${exercise.quantity} chấm.` };
}
