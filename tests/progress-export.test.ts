import { describe, expect, it } from "vitest";
import {
  migrateProgressExport,
  validateProgressExport,
} from "../src/persistence/export-import/progress-export";

const validExport = {
  format: "grade1-math-progress",
  version: 1,
  exportedAt: 1000,
  profile: { id: "primary", displayName: "Uyển Thanh", createdAt: 1 },
  settings: {
    reducedMotion: false,
    dailyTargetMin: 10,
    showStreak: true,
    showStars: true,
    locale: "vi-VN",
  },
  skillStates: [],
  sessions: [],
  attempts: [],
  rewards: { totalStars: 0, currentStreak: 0, bestStreak: 0 },
};

describe("progress export validation", () => {
  it("accepts current valid export", () => {
    expect(migrateProgressExport(validExport)).toEqual(validExport);
  });

  it("rejects malformed format and unsupported versions", () => {
    expect(() => validateProgressExport(null)).toThrow("JSON object");
    expect(() =>
      validateProgressExport({ ...validExport, format: "other" }),
    ).toThrow("format");
    expect(() => migrateProgressExport({ ...validExport, version: 2 })).toThrow(
      "not supported",
    );
  });
});
