import { numberBondPairSkillId } from "../../core/curriculum/module-b";
import { createSeededRandom } from "../../core/randomness/prng";
import type {
  EvaluationResult,
  Hint,
  HintLevel,
  PartWholeExercise,
} from "../../core/types/domain";

export interface NumberBondGenerationOptions {
  seed: number;
  whole?: number;
  unknown?: PartWholeExercise["unknown"];
  difficulty?: number;
}

export function generateNumberBondExercise(
  options: NumberBondGenerationOptions,
): PartWholeExercise {
  const random = createSeededRandom(options.seed);
  const whole = options.whole ?? random.int(5, 10);
  const partA = random.int(0, whole);
  const partB = whole - partA;
  const unknown =
    options.unknown ??
    (random.pick([
      "part-a",
      "part-b",
      "whole",
    ] as const) as PartWholeExercise["unknown"]);
  const pairSkillId = numberBondPairSkillId(whole, partA, partB);

  return {
    id: `number-bond-${options.seed}`,
    kind: "part-whole",
    module: "B",
    skillIds: [
      `B.bond.${whole}`,
      pairSkillId,
      `B.part-whole.${unknown === "whole" ? "missing-whole" : "missing-part"}`,
    ],
    difficulty: options.difficulty ?? 1,
    representation: "part-whole",
    promptKey: "number-bond.find-missing",
    generator: {
      generatorId: "number-bond-part-whole",
      generatorVersion: 1,
      seed: options.seed,
      params: { whole, partA, partB, unknown },
    },
    whole: unknown === "whole" ? undefined : whole,
    partA: unknown === "part-a" ? undefined : partA,
    partB: unknown === "part-b" ? undefined : partB,
    unknown,
    answerMode:
      options.difficulty && options.difficulty > 1 ? "number" : "choice",
  };
}

export function correctNumberBondAnswer(exercise: PartWholeExercise): number {
  if (!exercise.generator)
    throw new Error("Number bond exercise must retain generator data.");
  const params = exercise.generator.params;

  if (
    typeof params.whole !== "number" ||
    typeof params.partA !== "number" ||
    typeof params.partB !== "number"
  ) {
    throw new Error("Number bond generator data is invalid.");
  }

  return exercise.unknown === "whole"
    ? params.whole
    : exercise.unknown === "part-a"
      ? params.partA
      : params.partB;
}

export function evaluateNumberBondAnswer(
  exercise: PartWholeExercise,
  answer: unknown,
): EvaluationResult {
  const normalizedAnswer = typeof answer === "number" ? answer : Number(answer);
  const correct = normalizedAnswer === correctNumberBondAnswer(exercise);

  return {
    correct,
    normalizedAnswer,
    errorCode: correct ? undefined : "wrong-number-bond",
    evidence: exercise.skillIds.map((skillId) => ({
      skillId,
      weight: correct ? 1 : -0.3,
      reason: correct ? "independent-success" : "incorrect",
    })),
    nextHintSuggestion: correct ? undefined : 1,
  };
}

export function numberBondHint(
  exercise: PartWholeExercise,
  level: HintLevel,
): Hint {
  const answer = correctNumberBondAnswer(exercise);
  const generator = exercise.generator?.params;
  const whole = generator?.whole;
  const partA = generator?.partA;
  const partB = generator?.partB;

  if (typeof whole !== "number")
    throw new Error("Number bond generator data is invalid.");
  if (typeof partA !== "number" || typeof partB !== "number")
    throw new Error("Number bond generator data is invalid.");

  if (level === 1) {
    return {
      level,
      type: "text",
      payload:
        exercise.unknown === "whole"
          ? `${partA} và ${partB} ghép lại tạo thành số nào?`
          : `${whole} gồm hai phần. Con thử nhìn phần còn thiếu nhé.`,
    };
  }
  if (level === 2) {
    return {
      level,
      type: "visual",
      payload: {
        whole,
        partA: generator?.partA,
        partB: generator?.partB,
        answer,
      },
    };
  }
  return {
    level,
    type: "interaction",
    payload: {
      message:
        exercise.unknown === "whole"
          ? `${partA} và ${partB} tạo thành ${answer}.`
          : `Phần còn thiếu là ${answer}.`,
      answer,
    },
  };
}
