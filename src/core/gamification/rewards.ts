import type { RewardState } from "../types/domain";

export interface SessionRewardInput {
  completed: boolean;
  completedAttempts: number;
  independentCorrectAttempts: number;
  localDate: string;
}

export function localDateKey(timestamp: number): string {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(timestamp - offset).toISOString().slice(0, 10);
}

export function calculateSessionStars(input: SessionRewardInput): 1 | 2 | 3 {
  if (!input.completed)
    throw new Error("Cannot award stars to an incomplete session.");
  if (input.completedAttempts === 0) return 1;

  const independentRatio =
    input.independentCorrectAttempts / input.completedAttempts;
  if (independentRatio >= 0.8) return 3;
  if (independentRatio >= 0.45) return 2;
  return 1;
}

export function awardTodayReward(
  previous: RewardState,
  input: SessionRewardInput,
): RewardState {
  const stars = calculateSessionStars(input);
  if (previous.lastPracticeDate === input.localDate) {
    return { ...previous, totalStars: previous.totalStars + stars };
  }

  const previousDate = new Date(
    `${previous.lastPracticeDate ?? "1970-01-01"}T00:00:00`,
  );
  const currentDate = new Date(`${input.localDate}T00:00:00`);
  const dayDifference = Math.round(
    (currentDate.getTime() - previousDate.getTime()) / 86400000,
  );
  const currentStreak =
    previous.lastPracticeDate && dayDifference === 1
      ? previous.currentStreak + 1
      : 1;

  return {
    totalStars: previous.totalStars + stars,
    currentStreak,
    bestStreak: Math.max(previous.bestStreak, currentStreak),
    lastPracticeDate: input.localDate,
  };
}
