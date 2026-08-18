import { render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import {
  arithmeticHint,
  generateArithmeticExercise,
} from "../src/exercises/arithmetic/arithmetic";
import EquationPractice from "../src/ui/exercises/EquationPractice.svelte";

describe("EquationPractice", () => {
  it("shows arithmetic start and step count in visual number-line hints", () => {
    const exercise = generateArithmeticExercise({
      seed: 1,
      strategy: "plus2",
    });
    render(EquationPractice, {
      exercise,
      hint: arithmeticHint(exercise, 2),
      answered: 0,
      onAnswer: vi.fn(),
      onHint: vi.fn(),
    });

    expect(
      screen.getByText(`Bắt đầu ở ${exercise.left}. Tiến 2 bước trên dãy số.`),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        `Từ ${exercise.left} đến ${exercise.result}, 2 bước trên dãy số`,
      ),
    ).toBeInTheDocument();
    expect(document.querySelectorAll(".step-arc")).toHaveLength(2);
    expect(document.querySelector(".line-end")).not.toBeInTheDocument();
  });

  it("reveals correct arithmetic result and waits for continuation", async () => {
    const onNext = vi.fn();
    const exercise = generateArithmeticExercise({
      seed: 1,
      strategy: "plus2",
    });
    render(EquationPractice, {
      exercise,
      feedback: "Đúng rồi!",
      answered: 0,
      onAnswer: vi.fn(),
      onHint: vi.fn(),
      onNext,
    });

    expect(
      screen.getByText(
        `${exercise.left} + ${exercise.right} = ${exercise.result}`,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "0" })).not.toBeInTheDocument();
    await screen.getByRole("button", { name: "Tiếp tục" }).click();
    expect(onNext).toHaveBeenCalledOnce();
  });
});
