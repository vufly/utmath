import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import type {
  Attempt,
  SessionRecord,
  SkillState,
} from "../src/core/types/domain";
import { IndexedDbProgressRepository } from "../src/persistence/indexeddb/repository";

function createRepository(now = 999): Promise<IndexedDbProgressRepository> {
  return IndexedDbProgressRepository.create({
    factory: new IDBFactory(),
    now: () => now,
  });
}

const skill: SkillState = {
  skillId: "B.bond.5",
  stage: "learning",
  score: 0.2,
  totalAttempts: 2,
  recentCorrect: 1,
  recentIndependentCorrect: 1,
};

const session: SessionRecord = {
  id: "session-1",
  type: "today",
  startedAt: 100,
  attemptIds: ["attempt-1"],
  plannedSkillIds: ["B.bond.5"],
  practicedSkillIds: ["B.bond.5"],
  completed: false,
};

function attempt(id: string, completedAt: number): Attempt {
  return {
    id,
    sessionId: "session-1",
    exerciseId: "exercise-1",
    module: "B",
    skillIds: ["B.bond.5"],
    startedAt: completedAt - 100,
    completedAt,
    responseMs: 100,
    correct: true,
    hintLevelUsed: 0,
    hintCount: 0,
    answer: 2,
    representation: "part-whole",
    source: "today",
  };
}

describe("IndexedDbProgressRepository", () => {
  it("initializes defaults without browser storage leaking into domain code", async () => {
    const repository = await createRepository(123);

    await expect(repository.getProfile()).resolves.toEqual({
      id: "primary",
      displayName: "Uyển Thanh",
      createdAt: 123,
    });
    await expect(repository.getRewards()).resolves.toEqual({
      totalStars: 0,
      currentStreak: 0,
      bestStreak: 0,
    });
  });

  it("persists attempts, sessions, skills, and exports replayable progress", async () => {
    const repository = await createRepository();
    await repository.saveSession(session);
    await repository.addAttempt(attempt("attempt-1", 200));
    await repository.addAttempt(attempt("attempt-2", 300));
    await repository.putSkillStates([skill]);
    await repository.saveRewards({
      totalStars: 3,
      currentStreak: 2,
      bestStreak: 4,
      lastPracticeDate: "2026-08-17",
    });

    await expect(
      repository.listAttempts({ sessionId: "session-1", limit: 1 }),
    ).resolves.toMatchObject([{ id: "attempt-2" }]);

    const exported = await repository.exportAll();
    expect(exported.exportedAt).toBe(999);
    expect(exported.skillStates).toEqual([skill]);
    expect(exported.sessions).toEqual([session]);
    expect(exported.attempts.map((item) => item.id)).toEqual([
      "attempt-2",
      "attempt-1",
    ]);
    expect(exported.rewards.totalStars).toBe(3);
  });

  it("replaces state atomically only after import validation", async () => {
    const repository = await createRepository();
    await repository.saveProfile({
      id: "primary",
      displayName: "Before",
      createdAt: 1,
    });
    const exported = await repository.exportAll();
    const imported = {
      ...exported,
      profile: { ...exported.profile, displayName: "After" },
    };

    await repository.importAll(imported);
    await expect(repository.getProfile()).resolves.toMatchObject({
      displayName: "After",
    });
    await expect(
      repository.importAll({ ...imported, format: "invalid" } as never),
    ).rejects.toThrow("format");
    await expect(repository.getProfile()).resolves.toMatchObject({
      displayName: "After",
    });
  });

  it("resets learning evidence while retaining profile and settings", async () => {
    const repository = await createRepository();
    await repository.saveProfile({
      id: "primary",
      displayName: "Uyển Thanh",
      createdAt: 1,
    });
    await repository.saveSettings({
      parentPinHash: "digest",
      reducedMotion: true,
      dailyTargetMin: 15,
      showStreak: false,
      showStars: false,
      locale: "vi-VN",
    });
    await repository.putSkillStates([skill]);
    await repository.saveSession(session);
    await repository.addAttempt(attempt("attempt-1", 200));
    await repository.saveRewards({
      totalStars: 3,
      currentStreak: 2,
      bestStreak: 4,
    });

    await repository.resetProgress();

    await expect(repository.getSkillStates()).resolves.toEqual([]);
    await expect(repository.listSessions()).resolves.toEqual([]);
    await expect(repository.listAttempts()).resolves.toEqual([]);
    await expect(repository.getRewards()).resolves.toEqual({
      totalStars: 0,
      currentStreak: 0,
      bestStreak: 0,
    });
    await expect(repository.getProfile()).resolves.toMatchObject({
      displayName: "Uyển Thanh",
    });
    await expect(repository.getSettings()).resolves.toMatchObject({
      parentPinHash: "digest",
      dailyTargetMin: 15,
    });
  });
});
