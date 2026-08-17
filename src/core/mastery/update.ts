import type {
  HintLevel,
  RepresentationType,
  SkillState,
} from "../types/domain";

export interface MasteryAttempt {
  correct: boolean;
  hintLevelUsed: HintLevel;
  representation: RepresentationType;
  completedAt: number;
  wasNewRepresentation?: boolean;
}

export function createInitialSkillState(
  skillId: string,
  locked = false,
): SkillState {
  return {
    skillId,
    stage: locked ? "locked" : "new",
    score: 0,
    totalAttempts: 0,
    recentCorrect: 0,
    recentIndependentCorrect: 0,
  };
}

function evidenceWeight(attempt: MasteryAttempt, previous: SkillState): number {
  if (!attempt.correct) return -0.035;

  const hintedWeight: Record<HintLevel, number> = {
    0: 0.12,
    1: 0.08,
    2: 0.04,
    3: 0.015,
  };
  const daysSinceSuccess =
    previous.lastSuccessfulAt !== undefined
      ? (attempt.completedAt - previous.lastSuccessfulAt) / 86400000
      : 0;
  const retentionBonus = daysSinceSuccess >= 2 ? 0.03 : 0;
  const representationBonus = attempt.wasNewRepresentation ? 0.01 : 0;

  return (
    hintedWeight[attempt.hintLevelUsed] + retentionBonus + representationBonus
  );
}

function stageFor(state: SkillState): SkillState["stage"] {
  if (state.parentPaused) return "locked";
  if (state.totalAttempts === 0) return state.manuallyUnlocked ? "new" : "new";
  if (state.score < 0.35) return "learning";
  if (state.score < 0.7 || state.recentIndependentCorrect < 3)
    return "practicing";
  return "stable";
}

export function updateMastery(
  previous: SkillState,
  attempt: MasteryAttempt,
): SkillState {
  const score = Math.max(
    0,
    Math.min(1, previous.score + evidenceWeight(attempt, previous)),
  );
  const recentCorrect = attempt.correct
    ? Math.min(10, previous.recentCorrect + 1)
    : Math.max(0, previous.recentCorrect - 1);
  const recentIndependentCorrect = Math.min(
    10,
    attempt.correct && attempt.hintLevelUsed === 0
      ? previous.recentIndependentCorrect + 1
      : previous.recentIndependentCorrect,
  );
  const next: SkillState = {
    ...previous,
    score,
    totalAttempts: previous.totalAttempts + 1,
    recentCorrect,
    recentIndependentCorrect,
    lastPracticedAt: attempt.completedAt,
    lastSuccessfulAt: attempt.correct
      ? attempt.completedAt
      : previous.lastSuccessfulAt,
  };

  return { ...next, stage: stageFor(next) };
}
