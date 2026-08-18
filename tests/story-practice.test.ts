import { fireEvent, render, screen, within } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import { generateStoryExercise } from "../src/exercises/story/story";
import StoryPractice from "../src/ui/exercises/StoryPractice.svelte";

describe("StoryPractice", () => {
  it("lets child choose an operator before calculating", async () => {
    const onAnswer = vi.fn();
    const exercise = generateStoryExercise({
      seed: 1,
      storyType: "take-away",
      stage: "operator",
    });
    render(StoryPractice, { exercise, answered: 0, onAnswer, onHint: vi.fn() });

    await fireEvent.click(screen.getByRole("button", { name: "−" }));

    expect(onAnswer).toHaveBeenCalledWith("-");
  });

  it("submits a chosen full equation from slots", async () => {
    const onAnswer = vi.fn();
    const exercise = generateStoryExercise({
      seed: 1,
      storyType: "add-to",
      stage: "build",
    });
    const { container } = render(StoryPractice, {
      exercise,
      answered: 0,
      onAnswer,
      onHint: vi.fn(),
    });
    const slots = container.querySelectorAll(".equation-builder > div");

    await fireEvent.click(
      within(slots[0]! as HTMLElement).getByRole("button", {
        name: String(exercise.startCount),
      }),
    );
    await fireEvent.click(
      within(slots[1]! as HTMLElement).getByRole("button", { name: "+" }),
    );
    await fireEvent.click(
      within(slots[2]! as HTMLElement).getByRole("button", {
        name: String(exercise.changeCount),
      }),
    );
    await fireEvent.click(
      within(slots[3]! as HTMLElement).getByRole("button", {
        name: String(exercise.total),
      }),
    );
    await fireEvent.click(screen.getByRole("button", { name: "Kiểm tra" }));

    expect(onAnswer).toHaveBeenCalledWith(
      `${exercise.startCount}+${exercise.changeCount}=${exercise.total}`,
    );
  });

  it("shows related facts and waits for read-aloud continuation", async () => {
    const onNext = vi.fn();
    const exercise = generateStoryExercise({
      seed: 1,
      storyType: "take-away",
      stage: "result",
    });
    render(StoryPractice, {
      exercise,
      feedback: "Đúng rồi!",
      answered: 0,
      onAnswer: vi.fn(),
      onHint: vi.fn(),
      onNext,
    });

    expect(
      screen.getByText(
        `${exercise.startCount} − ${exercise.changeCount} = ${exercise.total}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${exercise.changeCount} + ${exercise.total} = ${exercise.startCount}`,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "0" })).not.toBeInTheDocument();
    await fireEvent.click(
      screen.getByRole("button", { name: "Con đã đọc xong, tiếp tục" }),
    );
    expect(onNext).toHaveBeenCalledOnce();
  });
});
