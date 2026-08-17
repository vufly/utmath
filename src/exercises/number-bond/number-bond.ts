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
  stage?:
    "combine" | "split" | "diagram" | "fact-family" | "make-five" | "make-ten";
}

export function generateNumberBondExercise(
  options: NumberBondGenerationOptions,
): PartWholeExercise {
  const random = createSeededRandom(options.seed);
  const stage = options.stage ?? "diagram";
  const whole =
    options.whole ??
    (stage === "make-five" ? 5 : stage === "make-ten" ? 10 : random.int(5, 10));
  const partA = random.int(
    stage === "combine" || stage === "split" ? 1 : 0,
    whole - (stage === "combine" || stage === "split" ? 1 : 0),
  );
  const partB = whole - partA;
  const unknown =
    options.unknown ??
    (stage === "combine" || stage === "fact-family"
      ? "whole"
      : stage === "split"
        ? "part-b"
        : random.pick(["part-a", "part-b", "whole"] as const));
  const presentation =
    stage === "make-five" || stage === "make-ten" ? "diagram" : stage;
  const pairSkillId = numberBondPairSkillId(whole, partA, partB);
  const stageSkillId =
    stage === "make-five"
      ? "B.make5"
      : stage === "make-ten"
        ? "B.make10"
        : stage === "fact-family"
          ? "B.fact-family"
          : undefined;

  return {
    id: `number-bond-${options.seed}`,
    kind: "part-whole",
    module: "B",
    skillIds: [
      `B.bond.${whole}`,
      pairSkillId,
      `B.part-whole.${unknown === "whole" ? "missing-whole" : "missing-part"}`,
      ...(stageSkillId ? [stageSkillId] : []),
    ],
    difficulty: options.difficulty ?? 1,
    representation:
      presentation === "combine" || presentation === "split"
        ? "object-scene"
        : "part-whole",
    promptKey:
      presentation === "combine"
        ? "number-bond.combine"
        : presentation === "split"
          ? "number-bond.split"
          : presentation === "fact-family"
            ? "number-bond.fact-family"
            : "number-bond.find-missing",
    generator: {
      generatorId: "number-bond-part-whole",
      generatorVersion: 2,
      seed: options.seed,
      params: { whole, partA, partB, unknown, stage, presentation },
    },
    presentation,
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
        exercise.presentation === "combine"
          ? `Ghép ${partA} chấm và ${partB} chấm lại nhé.`
          : exercise.presentation === "split"
            ? `Có ${whole} chấm. Tìm phần chưa có màu.`
            : exercise.unknown === "whole"
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
