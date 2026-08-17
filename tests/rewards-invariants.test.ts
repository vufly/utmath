import { describe, expect, it } from "vitest";
import {
  awardTodayReward,
  calculateSessionStars,
} from "../src/core/gamification/rewards";
import type { RewardState } from "../src/core/types/domain";

describe("reward invariants", () => {
  it("never removes stars or lowers best streak", () => {
    let rewards: RewardState = {
      totalStars: 10,
      currentStreak: 4,
      bestStreak: 4,
      lastPracticeDate: "2026-08-15",
    };

    for (const date of ["2026-08-16", "2026-08-18", "2026-08-18"]) {
      const previous = rewards;
      rewards = awardTodayReward(rewards, {
        completed: true,
        completedAttempts: 10,
        independentCorrectAttempts: 0,
        localDate: date,
      });
      expect(rewards.totalStars).toBeGreaterThan(previous.totalStars);
      expect(rewards.bestStreak).toBeGreaterThanOrEqual(previous.bestStreak);
    }
  });

  it("always awards one to three stars for completed sessions", () => {
    for (let independent = 0; independent <= 20; independent += 1) {
      const stars = calculateSessionStars({
        completed: true,
        completedAttempts: 20,
        independentCorrectAttempts: independent,
        localDate: "2026-08-17",
      });
      expect(stars).toBeGreaterThanOrEqual(1);
      expect(stars).toBeLessThanOrEqual(3);
    }
  });
});
