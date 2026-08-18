import { render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import Home from "../src/ui/child/Home.svelte";

describe("Home", () => {
  it("renders self-hosted reward icons and readable streak text", () => {
    const { container } = render(Home, {
      profile: { id: "primary", displayName: "Uyển Thanh" },
      totalStars: 3,
      currentStreak: 1,
      todayComplete: false,
      onStartPractice: vi.fn(),
      onFreePractice: vi.fn(),
      onOpenParent: vi.fn(),
    });

    expect(container.querySelectorAll(".star-icon")).toHaveLength(1);
    expect(container.querySelectorAll(".fire-icon")).toHaveLength(1);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Chuỗi ngày học")).toBeInTheDocument();
    expect(screen.getByText("Ngôi sao của con")).toBeInTheDocument();
    expect(screen.getByText("3 ngôi sao")).toHaveClass("sr-only");
  });
});
