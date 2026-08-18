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

  it("renders a tree scene with remaining and departing birds", () => {
    const exercise = generateStoryExercise({
      seed: 1,
      storyType: "take-away",
      stage: "direction",
    });
    const { container } = render(StoryPractice, {
      exercise,
      answered: 0,
      onAnswer: vi.fn(),
      onHint: vi.fn(),
    });

    expect(container.querySelector('[data-scene="bird-tree"]')).toBeTruthy();
    expect(container.querySelectorAll(".perched-birds .bird")).toHaveLength(
      (exercise.startCount ?? 0) - (exercise.changeCount ?? 0),
    );
    expect(container.querySelectorAll(".departing-birds .bird")).toHaveLength(
      exercise.changeCount ?? 0,
    );
    expect(
      screen.getByRole("img", { name: /chim còn đậu.*chim bay đi/i }),
    ).toBeInTheDocument();
  });

  it("renders arriving ducks at a pond and re-emphasizes a wrong action", () => {
    const exercise = generateStoryExercise({
      seed: 1,
      storyType: "add-to",
      stage: "operator",
    });
    const { container } = render(StoryPractice, {
      exercise,
      feedback: "Chưa đúng. Con thử nhìn hai phần một lần nữa nhé.",
      answered: 0,
      onAnswer: vi.fn(),
      onHint: vi.fn(),
    });

    expect(container.querySelector('[data-scene="duck-pond"]')).toHaveClass(
      "scene-replay",
    );
    expect(container.querySelectorAll(".pond-ducks .duck")).toHaveLength(
      exercise.startCount ?? 0,
    );
    expect(container.querySelectorAll(".arriving-ducks .duck")).toHaveLength(
      exercise.changeCount ?? 0,
    );
    expect(
      screen.getByRole("img", { name: /vịt ở ao.*vịt bơi vào ao/i }),
    ).toBeInTheDocument();
  });

  it("renders combined and missing-part scenes without reusing birds", () => {
    const combine = generateStoryExercise({
      seed: 1,
      storyType: "combine",
      stage: "parts-whole",
    });
    const missing = generateStoryExercise({
      seed: 1,
      storyType: "missing-part",
      stage: "result",
    });
    const fruit = {
      ...combine,
      sceneId: "fruit-basket" as const,
      objectKind: "apple" as const,
    };
    const first = render(StoryPractice, {
      exercise: fruit,
      answered: 0,
      onAnswer: vi.fn(),
      onHint: vi.fn(),
    });

    expect(
      first.container.querySelector(`[data-scene="${fruit.sceneId}"]`),
    ).toBeTruthy();
    expect(
      first.container.querySelectorAll(".incoming-fruit .fruit"),
    ).toHaveLength(fruit.startCount ?? 0);
    expect(
      first.container.querySelectorAll(".basket-fruit .fruit"),
    ).toHaveLength(fruit.changeCount ?? 0);
    first.unmount();
    const fish = {
      ...combine,
      sceneId: "fish-pond" as const,
      objectKind: "fish" as const,
    };
    const fishScene = render(StoryPractice, {
      exercise: fish,
      answered: 0,
      onAnswer: vi.fn(),
      onHint: vi.fn(),
    });

    expect(
      fishScene.container.querySelectorAll(".pond-fish .fish"),
    ).toHaveLength(fish.startCount ?? 0);
    expect(
      fishScene.container.querySelectorAll(".joining-fish .fish"),
    ).toHaveLength(fish.changeCount ?? 0);
    fishScene.unmount();
    const second = render(StoryPractice, {
      exercise: missing,
      answered: 0,
      onAnswer: vi.fn(),
      onHint: vi.fn(),
    });

    expect(
      second.container.querySelector(`[data-scene="${missing.sceneId}"]`),
    ).toBeTruthy();
    expect(
      second.container.querySelectorAll(".missing-slots span"),
    ).toHaveLength(missing.changeCount ?? 0);
    expect(second.container.querySelectorAll(".bird")).toHaveLength(0);
  });
});
