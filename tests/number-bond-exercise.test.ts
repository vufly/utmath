import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import {
  correctNumberBondAnswer,
  generateNumberBondExercise,
  numberBondHint,
} from "../src/exercises/number-bond/number-bond";
import NumberBondExercise from "../src/ui/exercises/NumberBondExercise.svelte";

describe("NumberBondExercise", () => {
  const exercise = generateNumberBondExercise({
    seed: 14,
    whole: 5,
    unknown: "part-b",
  });
  const answer = correctNumberBondAnswer(exercise);

  it("keeps answer hidden through strategy and visual hints", async () => {
    const onAnswer = vi.fn();
    const onHint = vi.fn();
    const { rerender } = render(NumberBondExercise, {
      exercise,
      answered: 0,
      onAnswer,
      onHint,
    });
    const diagram = screen.getByRole("img", {
      name: /sơ đồ số 5, hai phần là/i,
    });

    expect(diagram).toHaveAccessibleName(expect.stringContaining("?"));

    await rerender({
      exercise,
      answered: 0,
      onAnswer,
      onHint,
      hint: numberBondHint(exercise, 1),
    });
    expect(
      screen.getByText("5 gồm hai phần. Con thử nhìn phần còn thiếu nhé."),
    ).toBeInTheDocument();
    expect(document.querySelectorAll(".hint-counter")).toHaveLength(5);
    expect(diagram).toHaveAccessibleName(expect.stringContaining("?"));

    await rerender({
      exercise,
      answered: 0,
      onAnswer,
      onHint,
      hint: numberBondHint(exercise, 2),
    });
    expect(
      screen.getByText(
        "Nhìn các chấm theo hai màu. Phần màu xanh lá là phần còn thiếu.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(`Đáp án là ${answer}.`)).not.toBeInTheDocument();
    expect(diagram).toHaveAccessibleName(expect.stringContaining("?"));
  });

  it("reveals answer only at third hint and reports selected answer", async () => {
    const onAnswer = vi.fn();
    const onHint = vi.fn();
    const { rerender } = render(NumberBondExercise, {
      exercise,
      answered: 0,
      onAnswer,
      onHint,
    });

    await rerender({
      exercise,
      answered: 0,
      onAnswer,
      onHint,
      hint: numberBondHint(exercise, 3),
    });
    expect(screen.getByText(`Đáp án là ${answer}.`)).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: new RegExp(`hai phần là .*${answer}`, "i"),
      }),
    ).toBeInTheDocument();

    await fireEvent.click(screen.getByRole("button", { name: String(answer) }));
    expect(onAnswer).toHaveBeenCalledWith(answer);
  });

  it("renders combine groups before requesting the whole", async () => {
    const onAnswer = vi.fn();
    const combine = generateNumberBondExercise({ seed: 1, stage: "combine" });
    const combineAnswer = correctNumberBondAnswer(combine);
    render(NumberBondExercise, {
      exercise: combine,
      answered: 0,
      onAnswer,
      onHint: vi.fn(),
    });

    expect(screen.getByText("Ghép hai nhóm")).toBeInTheDocument();
    expect(screen.getByLabelText(/chấm và .* chấm/i)).toBeInTheDocument();
    await fireEvent.click(
      screen.getByRole("button", { name: String(combineAnswer) }),
    );

    expect(onAnswer).toHaveBeenCalledWith(combineAnswer);
  });

  it("separates known and unknown groups in split practice", () => {
    const split = generateNumberBondExercise({ seed: 1, stage: "split" });
    const { container } = render(NumberBondExercise, {
      exercise: split,
      answered: 0,
      onAnswer: vi.fn(),
      onHint: vi.fn(),
    });

    expect(screen.getByText(/Nhóm bên phải có mấy chấm/)).toBeInTheDocument();
    expect(container.querySelector(".split-divider")).toBeInTheDocument();
  });
});
