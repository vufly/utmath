import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import { generateTriangleExercise } from "../src/exercises/triangle/triangle";
import TrianglePractice from "../src/ui/exercises/TrianglePractice.svelte";

describe("TrianglePractice", () => {
  it("counts unique tapped authored triangle regions", async () => {
    const onAnswer = vi.fn();
    const exercise = generateTriangleExercise({
      seed: 1,
      definitionId: "three-separate",
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
    await fireEvent.click(regions[1]!);
    await fireEvent.click(regions[2]!);

    expect(screen.getByText("3")).toBeInTheDocument();
    await fireEvent.click(screen.getByRole("button", { name: "Kiểm tra" }));
    expect(onAnswer).toHaveBeenCalledWith({
      count: 3,
      selectedIds: ["left", "middle", "right"],
    });
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
});
