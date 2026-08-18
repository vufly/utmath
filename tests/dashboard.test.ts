import { render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import Dashboard from "../src/ui/parent/Dashboard.svelte";

describe("parent dashboard", () => {
  it("uses parent-facing Vietnamese mastery labels", () => {
    render(Dashboard, {
      rewards: { totalStars: 0, currentStreak: 0, bestStreak: 0 },
      sessions: [],
      skillStates: [
        {
          skillId: "B.bond.5",
          stage: "practicing",
          score: 0.5,
          totalAttempts: 4,
          recentCorrect: 3,
          recentIndependentCorrect: 2,
        },
      ],
      onHome: vi.fn(),
      onChangePin: vi.fn(),
      onPracticeNow: vi.fn(),
      onBackup: vi.fn(),
      onToggleFocus: vi.fn(),
      onTogglePause: vi.fn(),
      onResetProgress: vi.fn(),
    });

    expect(screen.getByText("Đang luyện")).toBeInTheDocument();
    expect(screen.queryByText("practicing")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Đặt lại tiến độ" }),
    ).toBeInTheDocument();
  });
});
