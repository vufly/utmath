import { createSeededRandom } from "../../core/randomness/prng";
import type {
  EvaluationResult,
  Hint,
  HintLevel,
  StoryExercise,
} from "../../core/types/domain";

export function generateStoryExercise(options: {
  seed: number;
  storyType?: "add-to" | "take-away";
}): StoryExercise {
  const random = createSeededRandom(options.seed);
  const storyType =
    options.storyType ?? random.pick(["add-to", "take-away"] as const);
  const objectKind = random.pick(["apple", "fish", "bird"] as const);
  const startCount =
    storyType === "add-to" ? random.int(1, 7) : random.int(3, 10);
  const changeCount =
    storyType === "add-to"
      ? random.int(1, 10 - startCount)
      : random.int(1, startCount);
  const total =
    storyType === "add-to"
      ? startCount + changeCount
      : startCount - changeCount;

  return {
    id: `story-${options.seed}`,
    kind: "story",
    module: "E",
    skillIds: [storyType === "add-to" ? "E.add.add-to" : "E.sub.take-away"],
    difficulty: 1,
    representation: "object-scene",
    promptKey: "story.find-result",
    generator: {
      generatorId: "picture-story",
      generatorVersion: 1,
      seed: options.seed,
      params: { storyType, objectKind, startCount, changeCount, total },
    },
    storyType,
    objectKind,
    startCount,
    changeCount,
    total,
    unknown: "result",
  };
}

export function storyAnswer(exercise: StoryExercise): number {
  const total = exercise.generator?.params.total;
  if (typeof total !== "number")
    throw new Error("Story generator data is invalid.");
  return total;
}

export function evaluateStoryAnswer(
  exercise: StoryExercise,
  answer: unknown,
): EvaluationResult {
  const normalizedAnswer = typeof answer === "number" ? answer : Number(answer);
  const correct = normalizedAnswer === storyAnswer(exercise);
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

export function storyHint(exercise: StoryExercise, level: HintLevel): Hint {
  if (level === 1)
    return {
      level,
      type: "text",
      payload:
        exercise.storyType === "add-to"
          ? "Có thêm vào, vậy số lượng tăng lên."
          : "Có bớt đi, vậy số lượng giảm xuống.",
    };
  if (level === 2)
    return { level, type: "visual", payload: exercise.generator?.params };
  return {
    level,
    type: "text",
    payload: `Đáp án là ${storyAnswer(exercise)}.`,
  };
}
