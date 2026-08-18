import { createSeededRandom } from "../../core/randomness/prng";
import type {
  EvaluationResult,
  Hint,
  HintLevel,
  StoryExercise,
} from "../../core/types/domain";

export type StoryStage = StoryExercise["stage"];

const stages: StoryStage[] = [
  "direction",
  "before-after",
  "parts-whole",
  "operator",
  "numbers",
  "equation-choice",
  "build",
  "result",
];

const sceneChoices = {
  "add-to": [{ sceneId: "duck-pond", objectKind: "duck" }],
  "take-away": [{ sceneId: "bird-tree", objectKind: "bird" }],
  combine: [
    { sceneId: "fruit-basket", objectKind: "apple" },
    { sceneId: "fish-pond", objectKind: "fish" },
  ],
  "missing-part": [
    { sceneId: "book-desk", objectKind: "book" },
    { sceneId: "pencil-desk", objectKind: "pencil" },
  ],
} as const satisfies Record<
  StoryExercise["storyType"],
  readonly Pick<StoryExercise, "sceneId" | "objectKind">[]
>;

export function generateStoryExercise(options: {
  seed: number;
  storyType?: StoryExercise["storyType"];
  stage?: StoryStage;
}): StoryExercise {
  const random = createSeededRandom(options.seed);
  const storyType =
    options.storyType ??
    random.pick(["add-to", "take-away", "combine", "missing-part"] as const);
  const stage = options.stage ?? "result";
  const scene = random.pick<Pick<StoryExercise, "sceneId" | "objectKind">>(
    sceneChoices[storyType],
  );
  const isAdding = storyType !== "take-away";
  const startCount = isAdding ? random.int(1, 7) : random.int(3, 10);
  const changeCount = isAdding
    ? random.int(1, 10 - startCount)
    : random.int(1, startCount);
  const total = isAdding ? startCount + changeCount : startCount - changeCount;

  return {
    id: `story-${options.seed}`,
    kind: "story",
    module: "E",
    skillIds: [`E.stage.${stage}`, `E.story.${storyType}`],
    difficulty: stages.indexOf(stage) + 1,
    representation: "object-scene",
    promptKey: `story.${stage}`,
    generator: {
      generatorId: "picture-story",
      generatorVersion: 2,
      seed: options.seed,
      params: {
        storyType,
        stage,
        sceneId: scene.sceneId,
        objectKind: scene.objectKind,
        startCount,
        changeCount,
        total,
      },
    },
    storyType,
    stage,
    sceneId: scene.sceneId,
    objectKind: scene.objectKind,
    startCount,
    changeCount,
    total,
    unknown:
      stage === "operator"
        ? "operator"
        : stage === "numbers"
          ? "number-a"
          : stage === "equation-choice"
            ? "full-equation"
            : "result",
  };
}

export function storyAnswer(exercise: StoryExercise): number {
  const total = exercise.generator?.params.total;
  if (typeof total !== "number")
    throw new Error("Story generator data is invalid.");
  return exercise.storyType === "missing-part"
    ? (exercise.changeCount ?? total)
    : total;
}

function operatorFor(exercise: StoryExercise): "+" | "-" {
  return exercise.storyType === "take-away" ? "-" : "+";
}

function equationFor(exercise: StoryExercise): string {
  return `${exercise.startCount}${operatorFor(exercise)}${exercise.changeCount}=${exercise.total}`;
}

function expectedStoryAnswer(exercise: StoryExercise): unknown {
  if (exercise.stage === "direction" || exercise.stage === "before-after")
    return operatorFor(exercise) === "+" ? "increase" : "decrease";
  if (exercise.stage === "operator") return operatorFor(exercise);
  if (exercise.stage === "numbers")
    return `${exercise.startCount},${exercise.changeCount}`;
  if (exercise.stage === "equation-choice" || exercise.stage === "build")
    return equationFor(exercise);
  if (exercise.stage === "parts-whole") return storyAnswer(exercise);
  return storyAnswer(exercise);
}

function storyAnswerLabel(exercise: StoryExercise): string {
  const answer = expectedStoryAnswer(exercise);
  if (answer === "increase") return "tăng lên";
  if (answer === "decrease") return "giảm đi";
  return String(answer);
}

export function evaluateStoryAnswer(
  exercise: StoryExercise,
  answer: unknown,
): EvaluationResult {
  const normalizedAnswer = typeof answer === "number" ? answer : String(answer);
  const correct = normalizedAnswer === expectedStoryAnswer(exercise);
  return {
    correct,
    normalizedAnswer,
    errorCode: correct
      ? undefined
      : exercise.stage === "operator" || exercise.stage === "direction"
        ? "wrong-operator"
        : exercise.stage === "build" &&
            String(answer)
              .split(/[+=-]/)
              .every((item) => !Number.isNaN(Number(item)))
          ? "arithmetic-error"
          : "other",
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
        operatorFor(exercise) === "+"
          ? "Có thêm vào, vậy số lượng tăng lên."
          : "Có bớt đi, vậy số lượng giảm xuống.",
    };
  if (level === 2)
    return { level, type: "visual", payload: exercise.generator?.params };
  return {
    level,
    type: "text",
    payload: `Đáp án là ${storyAnswerLabel(exercise)}.`,
  };
}
