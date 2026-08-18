<script lang="ts">
  import type { Hint, StoryExercise } from "../../core/types/domain";
  import StoryScene from "./StoryScene.svelte";

  let { exercise, feedback = "", hint, answered, onAnswer, onHint, onNext = () => {} }: {
    exercise: StoryExercise;
    feedback?: string;
    hint?: Hint;
    answered: number;
    onAnswer: (answer: unknown) => void;
    onHint: () => void;
    onNext?: () => void;
  } = $props();
  let buildLeft = $state<number | undefined>();
  let buildOperator = $state<"+" | "-" | undefined>();
  let buildRight = $state<number | undefined>();
  let buildResult = $state<number | undefined>();

  const isAdding = $derived(exercise.storyType !== "take-away");
  const operator = $derived(isAdding ? "+" : "-");
  const completed = $derived(feedback.includes("Đúng"));
  const replayAction = $derived(Boolean(feedback) && !completed);
  const objectLabel = $derived(
    exercise.objectKind === "bird"
      ? "con chim"
      : exercise.objectKind === "duck"
        ? "con vịt"
        : exercise.objectKind === "fish"
          ? "con cá"
          : exercise.objectKind === "apple"
            ? "quả táo"
            : exercise.objectKind === "book"
              ? "quyển sách"
              : "bút chì",
  );
  const actionLabel = $derived(
    exercise.sceneId === "duck-pond"
      ? "bơi vào ao"
      : exercise.sceneId === "bird-tree"
        ? "bay đi"
        : "ghép vào cùng nhóm",
  );
  const equation = $derived(
    `${exercise.startCount}${operator}${exercise.changeCount}=${exercise.total}`,
  );
  const familyWhole = $derived(
    isAdding ? (exercise.total ?? 0) : (exercise.startCount ?? 0),
  );
  const familyPartA = $derived(
    isAdding ? (exercise.startCount ?? 0) : (exercise.total ?? 0),
  );
  const familyPartB = $derived(exercise.changeCount ?? 0);
  const numberChoices = $derived([
    ...new Set([
      exercise.startCount ?? 0,
      exercise.changeCount ?? 0,
      exercise.total ?? 0,
      Math.min(10, (exercise.total ?? 0) + 1),
    ]),
  ]);
  const equationChoices = $derived([
    ...new Set([
      equation,
      `${exercise.startCount}${isAdding ? "-" : "+"}${exercise.changeCount}=${isAdding ? (exercise.startCount ?? 0) - (exercise.changeCount ?? 0) : (exercise.startCount ?? 0) + (exercise.changeCount ?? 0)}`,
      `${exercise.changeCount}${operator}${exercise.startCount}=${exercise.total}`,
    ]),
  ]);
  const prompt = $derived(
    exercise.stage === "direction"
      ? "Số lượng đang tăng hay giảm?"
      : exercise.stage === "before-after"
        ? "Sau khi thay đổi, nhiều hơn hay ít hơn?"
        : exercise.stage === "parts-whole"
          ? "Hai phần ghép lại tạo thành số nào?"
          : exercise.stage === "operator"
            ? "Nên dùng dấu nào?"
            : exercise.stage === "numbers"
              ? "Hai số nào kể điều đang xảy ra?"
              : exercise.stage === "equation-choice"
                ? "Phép tính nào đúng với tranh?"
                : exercise.stage === "build"
                  ? "Lập phép tính từ tranh"
                  : exercise.storyType === "missing-part"
                    ? `Cần thêm bao nhiêu ${objectLabel}?`
                    : "Có tất cả bao nhiêu?",
  );

  function submitBuild(): void {
    if (
      buildLeft === undefined ||
      buildOperator === undefined ||
      buildRight === undefined ||
      buildResult === undefined
    )
      return;
    onAnswer(`${buildLeft}${buildOperator}${buildRight}=${buildResult}`);
  }

  $effect(() => {
    exercise.id;
    buildLeft = undefined;
    buildOperator = undefined;
    buildRight = undefined;
    buildResult = undefined;
  });
</script>

<main class="exercise-page page">
  <header class="exercise-header"><span>Bài {answered + 1}</span><span>{answered} bài đã làm</span></header>
  <section class="exercise-card" aria-labelledby="story-title">
    <p class="eyebrow">Toán tranh</p>
    <h1 id="story-title">{prompt}</h1>
    <p class="exercise-prompt">
      {exercise.storyType === "combine"
        ? `${exercise.startCount} ${objectLabel} và ${exercise.changeCount} ${objectLabel}.`
        : exercise.storyType === "missing-part"
          ? `${exercise.startCount} ${objectLabel}, cần thành ${exercise.total} ${objectLabel}.`
          : `${exercise.startCount} ${objectLabel}. ${exercise.changeCount} ${objectLabel} ${isAdding ? actionLabel : "bay đi"}.`}
    </p>
    <StoryScene {exercise} replay={replayAction} />
    {#if hint}<aside class="hint-card" aria-live="polite"><strong>Gợi ý</strong><p>{typeof hint.payload === "string" ? hint.payload : "Nhìn điều đang xảy ra trong tranh nhé."}</p></aside>{/if}
    {#if feedback}<p class:success={completed} class="answer-feedback" role="status">{feedback}</p>{/if}
    {#if completed}
      <section class="story-fact-family" aria-label="Các phép tính cùng liên kết số">
        <strong>Con đọc to bốn phép tính để nhớ nhé:</strong>
        <span>{familyWhole} − {familyPartB} = {familyPartA}</span>
        <span>{familyWhole} − {familyPartA} = {familyPartB}</span>
        <span>{familyPartB} + {familyPartA} = {familyWhole}</span>
        <span>{familyPartA} + {familyPartB} = {familyWhole}</span>
      </section>
    {/if}
  </section>
  <section class="answer-panel" aria-label="Chọn câu trả lời">
    {#if completed}
      <button class="primary-action compact" type="button" onclick={onNext}>Con đã đọc xong, tiếp tục</button>
    {:else}
      <button class="hint-button" type="button" onclick={onHint}>Gợi ý</button>
      {#if exercise.stage === "direction" || exercise.stage === "before-after"}
        <div class="story-choice-grid"><button type="button" onclick={() => onAnswer("increase")}>Tăng lên</button><button type="button" onclick={() => onAnswer("decrease")}>Giảm đi</button></div>
      {:else if exercise.stage === "operator"}
        <div class="story-choice-grid"><button type="button" onclick={() => onAnswer("+")}>+</button><button type="button" onclick={() => onAnswer("-")}>−</button></div>
      {:else if exercise.stage === "numbers"}
        <div class="story-choice-grid">{#each numberChoices as first}{#each numberChoices as second}{#if first !== second}<button type="button" onclick={() => onAnswer(`${first},${second}`)}>{first} và {second}</button>{/if}{/each}{/each}</div>
      {:else if exercise.stage === "equation-choice"}
        <div class="story-choice-grid">{#each equationChoices as choice}<button type="button" onclick={() => onAnswer(choice)}>{choice.replace("=", " = ")}</button>{/each}</div>
      {:else if exercise.stage === "build"}
        <div class="equation-builder" aria-label="Lập phép tính"><div><strong>Số đầu</strong>{#each numberChoices as value}<button class:selected-build={buildLeft === value} type="button" onclick={() => (buildLeft = value)}>{value}</button>{/each}</div><div><strong>Dấu</strong><button class:selected-build={buildOperator === "+"} type="button" onclick={() => (buildOperator = "+")}>+</button><button class:selected-build={buildOperator === "-"} type="button" onclick={() => (buildOperator = "-")}>−</button></div><div><strong>Số sau</strong>{#each numberChoices as value}<button class:selected-build={buildRight === value} type="button" onclick={() => (buildRight = value)}>{value}</button>{/each}</div><div><strong>Kết quả</strong>{#each numberChoices as value}<button class:selected-build={buildResult === value} type="button" onclick={() => (buildResult = value)}>{value}</button>{/each}</div></div><button class="primary-action compact" type="button" onclick={submitBuild}>Kiểm tra</button>
      {:else}
        <div class="number-grid">{#each Array(11) as _, value}<button type="button" onclick={() => onAnswer(value)}>{value}</button>{/each}</div>
      {/if}
    {/if}
  </section>
</main>
