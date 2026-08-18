import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import { generateTriangleExercise } from "../src/exercises/triangle/triangle";
import TrianglePractice from "../src/ui/exercises/TrianglePractice.svelte";

describe("TrianglePractice", () => {
  it("counts unique tapped authored triangle regions", async () => {
    const onAnswer = vi.fn();
    const exercise = generateTriangleExercise({
      seed: 1,
      definitionId: "worksheet-wedge",
    });
    const { container } = render(TrianglePractice, {
      exercise,
      answered: 0,
      onAnswer,
      onHint: vi.fn(),
    });
    const regions = container.querySelectorAll("polygon");

    await fireEvent.click(regions[0]!);
    await fireEvent.click(regions[0]!);
    expect(
      screen.getByText("Con đã tìm tam giác này rồi."),
    ).toBeInTheDocument();
    for (const region of Array.from(regions).slice(1)) {
      await fireEvent.click(region);
    }

    expect(screen.getByRole("button", { name: "Lớn" })).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    await fireEvent.click(screen.getByRole("button", { name: "Lớn" }));
    await fireEvent.click(container.querySelector("polygon")!);
    await fireEvent.click(screen.getByRole("button", { name: "Kiểm tra" }));
    const submission = onAnswer.mock.calls[0]?.[0];
    expect(submission).toEqual({
      count: 8,
      selectedIds: [
        "a-b-d",
        "b-d-e",
        "d-e-f",
        "e-f-g",
        "f-g-h",
        "g-h-i",
        "h-i-c",
        "whole",
      ],
    });
    expect(() => structuredClone(submission)).not.toThrow();
  });

  it("switches size filters so composite triangles remain tappable", async () => {
    const exercise = generateTriangleExercise({
      seed: 1,
      definitionId: "rectangle-composites",
    });
    const { container } = render(TrianglePractice, {
      exercise,
      answered: 0,
      onAnswer: vi.fn(),
      onHint: vi.fn(),
    });

    expect(container.querySelectorAll("polygon")).toHaveLength(4);
    await fireEvent.click(screen.getByRole("button", { name: "Lớn" }));
    expect(container.querySelectorAll("polygon")).toHaveLength(4);
    expect(
      screen.getAllByRole("button", { name: "Chọn tam giác large" }),
    ).toHaveLength(4);
  });

  it("clears selected triangles when the next exercise loads", async () => {
    const first = generateTriangleExercise({
      seed: 1,
      definitionId: "worksheet-wedge",
    });
    const second = generateTriangleExercise({
      seed: 2,
      definitionId: "four-in-rectangle",
    });
    const view = render(TrianglePractice, {
      exercise: first,
      answered: 0,
      onAnswer: vi.fn(),
      onHint: vi.fn(),
    });

    await fireEvent.click(view.container.querySelector("polygon")!);
    expect(screen.getByText("1")).toBeInTheDocument();
    await view.rerender({ exercise: second });

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(view.container.querySelectorAll("polygon")).toHaveLength(4);
  });
});
