import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import { generateQuantityExercise } from "../src/exercises/quantity/quantity";
import QuantityPractice from "../src/ui/exercises/QuantityPractice.svelte";

describe("QuantityPractice", () => {
  it("lets child fill a five-frame before checking", async () => {
    const onAnswer = vi.fn();
    const exercise = generateQuantityExercise({
      seed: 1,
      quantity: 3,
      stage: "number-to-frame",
    });
    render(QuantityPractice, {
      exercise,
      answered: 0,
      onAnswer,
      onHint: vi.fn(),
    });

    await fireEvent.click(screen.getByRole("button", { name: "Ô 1" }));
    await fireEvent.click(screen.getByRole("button", { name: "Ô 2" }));
    await fireEvent.click(screen.getByRole("button", { name: "Ô 3" }));
    await fireEvent.click(screen.getByRole("button", { name: "Kiểm tra" }));

    expect(onAnswer).toHaveBeenCalledWith(3);
  });

  it("uses a representation choice for matching", async () => {
    const onAnswer = vi.fn();
    const exercise = generateQuantityExercise({
      seed: 1,
      quantity: 7,
      stage: "match",
    });
    render(QuantityPractice, {
      exercise,
      answered: 0,
      onAnswer,
      onHint: vi.fn(),
    });

    await fireEvent.click(screen.getByRole("button", { name: "7 chấm" }));

    expect(onAnswer).toHaveBeenCalledWith(7);
  });
});
