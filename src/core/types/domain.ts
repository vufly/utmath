export type ModuleId = "A" | "B" | "C" | "D" | "E" | "F";

export type RepresentationType =
  | "dots"
  | "five-frame"
  | "ten-frame"
  | "part-whole"
  | "number-line"
  | "equation"
  | "object-scene"
  | "story-animation"
  | "triangle-svg";

export type HintLevel = 0 | 1 | 2 | 3;

export type ErrorCode =
  | "wrong-count"
  | "counted-one-by-one"
  | "wrong-number-bond"
  | "wrong-operator"
  | "reversed-operands"
  | "arithmetic-error"
  | "unknown-position-error"
  | "missed-small-triangle"
  | "missed-composite-triangle"
  | "duplicate-triangle"
  | "other";

export interface GeneratedExerciseRef {
  generatorId: string;
  generatorVersion: number;
  seed: number;
  params: Record<string, unknown>;
}

export interface ExerciseBase {
  id: string;
  module: ModuleId;
  skillIds: string[];
  difficulty: number;
  representation: RepresentationType;
  promptKey: string;
  generator?: GeneratedExerciseRef;
}

export interface QuantityExercise extends ExerciseBase {
  kind: "quantity";
  quantity: number;
  answerMode: "numeral" | "frame" | "match";
  layout: "dots" | "dice" | "domino" | "five-frame" | "ten-frame";
  flashDurationMs?: number;
  matchChoices?: number[];
}

export interface PartWholeExercise extends ExerciseBase {
  kind: "part-whole";
  presentation: "combine" | "split" | "diagram" | "fact-family";
  whole?: number;
  partA?: number;
  partB?: number;
  unknown: "whole" | "part-a" | "part-b";
  answerMode: "choice" | "number";
}

export interface ArithmeticExercise extends ExerciseBase {
  kind: "arithmetic";
  operation: "add" | "subtract";
  left: number;
  right: number;
  result: number;
  strategySkillId: string;
}

export interface MissingNumberExercise extends ExerciseBase {
  kind: "missing-number";
  operation: "add" | "subtract";
  left?: number;
  right?: number;
  result?: number;
  unknown: "left" | "right" | "result";
}

export interface StoryExercise extends ExerciseBase {
  kind: "story";
  storyType: "add-to" | "take-away" | "combine" | "missing-part";
  sceneId:
    | "bird-tree"
    | "duck-pond"
    | "fruit-basket"
    | "fish-pond"
    | "book-desk"
    | "pencil-desk";
  stage:
    | "direction"
    | "before-after"
    | "parts-whole"
    | "operator"
    | "numbers"
    | "equation-choice"
    | "build"
    | "result";
  objectKind: "bird" | "duck" | "apple" | "fish" | "book" | "pencil";
  startCount?: number;
  changeCount?: number;
  partA?: number;
  partB?: number;
  total?: number;
  unknown: "operator" | "number-a" | "number-b" | "result" | "full-equation";
}

export interface TriangleExercise extends ExerciseBase {
  kind: "triangle";
  definitionId: string;
  answerMode: "select" | "count";
  stage: "select" | "independent";
}

export type Exercise =
  | QuantityExercise
  | PartWholeExercise
  | ArithmeticExercise
  | MissingNumberExercise
  | StoryExercise
  | TriangleExercise;

export interface SkillEvidence {
  skillId: string;
  weight: number;
  reason:
    | "independent-success"
    | "hinted-success"
    | "incorrect"
    | "retention"
    | "new-representation";
}

export interface EvaluationResult {
  correct: boolean;
  normalizedAnswer: unknown;
  errorCode?: ErrorCode;
  evidence: SkillEvidence[];
  nextHintSuggestion?: HintLevel;
}

export interface Hint {
  level: HintLevel;
  type: "text" | "visual" | "animation" | "interaction";
  payload: unknown;
}

export interface Attempt {
  id: string;
  sessionId?: string;
  exerciseId: string;
  module: ModuleId;
  skillIds: string[];
  startedAt: number;
  completedAt: number;
  responseMs: number;
  correct: boolean;
  hintLevelUsed: HintLevel;
  hintCount: number;
  answer: unknown;
  errorCode?: ErrorCode;
  representation: RepresentationType;
  source: "today" | "free-practice" | "parent-practice";
  generator?: GeneratedExerciseRef;
}

export type MasteryStage =
  "locked" | "new" | "learning" | "practicing" | "stable" | "review";

export interface SkillState {
  skillId: string;
  stage: MasteryStage;
  score: number;
  totalAttempts: number;
  recentCorrect: number;
  recentIndependentCorrect: number;
  lastPracticedAt?: number;
  lastSuccessfulAt?: number;
  parentFocus?: boolean;
  parentPaused?: boolean;
  manuallyUnlocked?: boolean;
}

export interface SkillDefinition {
  id: string;
  module: ModuleId;
  prerequisites: string[];
  exerciseGenerators: string[];
  reviewAfterDays?: number[];
}

export interface CurriculumDefinition {
  skills: SkillDefinition[];
}

export interface ParentOverrides {
  focusedSkillIds: string[];
  pausedSkillIds: string[];
  manuallyUnlockedSkillIds: string[];
}

export interface SessionPlanningContext {
  skillStates: SkillState[];
  recentAttempts: Attempt[];
  curriculum: CurriculumDefinition;
  parentOverrides: ParentOverrides;
  now: number;
}

export interface ExerciseSlot {
  purpose: "learn" | "review" | "remediate" | "challenge";
  preferredSkillIds: string[];
  preferredRepresentations?: RepresentationType[];
}

export interface PlannedSession {
  id: string;
  targetDurationMin: number;
  slots: ExerciseSlot[];
}

export interface SessionRecord {
  id: string;
  type: "today" | "free-practice" | "parent-practice";
  startedAt: number;
  completedAt?: number;
  attemptIds: string[];
  plannedSkillIds: string[];
  practicedSkillIds: string[];
  completed: boolean;
  starsAwarded?: 1 | 2 | 3;
}

export interface RewardState {
  totalStars: number;
  currentStreak: number;
  bestStreak: number;
  lastPracticeDate?: string;
}

export interface AppSettings {
  parentPinHash?: string;
  reducedMotion: boolean;
  dailyTargetMin: number;
  showStreak: boolean;
  showStars: boolean;
  locale: "vi-VN";
}

export interface ChildProfile {
  id: "primary";
  displayName?: string;
  createdAt: number;
}

export interface ProgressExport {
  format: "grade1-math-progress";
  version: number;
  exportedAt: number;
  profile: ChildProfile;
  settings: AppSettings;
  skillStates: SkillState[];
  sessions: SessionRecord[];
  attempts: Attempt[];
  rewards: RewardState;
}
