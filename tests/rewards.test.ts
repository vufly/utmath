import { describe, expect, it } from "vitest";
import {
  awardTodayReward,
  calculateSessionStars,
  localDateKey,
} from "../src/core/gamification/rewards";

describe("session rewards", () => {
  it("rewards independence without punishing completion", () => {
    expect(
      calculateSessionStars({
        completed: true,
        completedAttempts: 10,
        independentCorrectAttempts: 8,
        localDate: "2026-08-17",
      }),
    ).toBe(3);
    expect(
      calculateSessionStars({
        completed: true,
        completedAttempts: 10,
        independentCorrectAttempts: 5,
        localDate: "2026-08-17",
      }),
    ).toBe(2);
    expect(
      calculateSessionStars({
        completed: true,
        completedAttempts: 10,
        independentCorrectAttempts: 0,
        localDate: "2026-08-17",
      }),
    ).toBe(1);
  });

  it("awards one streak credit per local day", () => {
    const first = awardTodayReward(
      { totalStars: 0, currentStreak: 0, bestStreak: 0 },
      {
        completed: true,
        completedAttempts: 1,
        independentCorrectAttempts: 1,
        localDate: "2026-08-16",
      },
    );
    const second = awardTodayReward(first, {
      completed: true,
      completedAttempts: 1,
      independentCorrectAttempts: 1,
      localDate: "2026-08-17",
    });
    const sameDay = awardTodayReward(second, {
      completed: true,
      completedAttempts: 1,
      independentCorrectAttempts: 1,
      localDate: "2026-08-17",
    });

    expect(second.currentStreak).toBe(2);
    expect(sameDay.currentStreak).toBe(2);
    expect(sameDay.totalStars).toBe(9);
  });

  it("uses local calendar date keys", () => {
    expect(localDateKey(new Date(2026, 7, 17, 12).getTime())).toBe(
      "2026-08-17",
    );
  });
});
