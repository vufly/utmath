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
  const showFactFamily = $derived(
    completed &&
      exercise.stage !== "direction" &&
      exercise.stage !== "before-after" &&
      exercise.stage !== "operator" &&
      exercise.stage !== "numbers",
  );
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
  const firstOperand = $derived(
    exercise.sceneId === "fruit-basket"
      ? (exercise.changeCount ?? 0)
      : (exercise.startCount ?? 0),
  );
  const secondOperand = $derived(
    exercise.sceneId === "fruit-basket"
      ? (exercise.startCount ?? 0)
      : (exercise.changeCount ?? 0),
  );
  const equation = $derived(
    `${firstOperand}${operator}${secondOperand}=${exercise.total}`,
  );
  const factFamily = $derived.by(() => {
    const start = exercise.startCount ?? 0;
    const change = exercise.changeCount ?? 0;
    const total = exercise.total ?? 0;

    return isAdding
      ? [
          `${firstOperand} + ${secondOperand} = ${total}`,
          `${secondOperand} + ${firstOperand} = ${total}`,
          `${total} − ${secondOperand} = ${firstOperand}`,
          `${total} − ${firstOperand} = ${secondOperand}`,
        ]
      : [
          `${start} − ${change} = ${total}`,
          `${start} − ${total} = ${change}`,
          `${total} + ${change} = ${start}`,
          `${change} + ${total} = ${start}`,
        ];
  });
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
      `${firstOperand}${isAdding ? "-" : "+"}${secondOperand}=${isAdding ? Math.abs(firstOperand - secondOperand) : firstOperand + secondOperand}`,
      `${secondOperand}${operator}${firstOperand}=${isAdding ? (exercise.total ?? 0) - 1 : (exercise.total ?? 0) + 1}`,
    ]),
  ]);
  const prompt = $derived(
    exercise.stage === "direction"
      ? exercise.storyType === "missing-part"
        ? "Số lượng cần tăng hay giảm?"
        : "Số lượng đang tăng hay giảm?"
      : exercise.stage === "before-after"
        ? "Sau khi thay đổi, nhiều hơn hay ít hơn?"
        : exercise.stage === "parts-whole"
          ? exercise.storyType === "missing-part"
            ? `Cần thêm bao nhiêu ${objectLabel} để đủ ${exercise.total}?`
            : "Hai phần ghép lại tạo thành số nào?"
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
                    : exercise.storyType === "take-away"
                      ? `Còn lại bao nhiêu ${objectLabel}?`
                      : "Có tất cả bao nhiêu?",
  );
  const hintText = $derived(
    typeof hint?.payload === "string"
      ? hint.payload
      : exercise.storyType === "take-away"
        ? "Có chim bay đi, nên số chim còn lại ít hơn lúc đầu."
        : exercise.storyType === "missing-part"
          ? `Cần thêm vào để đủ ${exercise.total} ${objectLabel}.`
          : "Có thêm vào, nên số lượng sau đó nhiều hơn lúc đầu.",
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
        ? `${firstOperand} ${objectLabel} và ${secondOperand} ${objectLabel}.`
        : exercise.storyType === "missing-part"
          ? `${exercise.startCount} ${objectLabel}, cần thành ${exercise.total} ${objectLabel}.`
          : `${exercise.startCount} ${objectLabel}. ${exercise.changeCount} ${objectLabel} ${isAdding ? actionLabel : "bay đi"}.`}
    </p>
    <StoryScene {exercise} replay={replayAction} />
    {#if hint}<aside class="hint-card" aria-live="polite"><strong>Gợi ý</strong><p>{hintText}</p></aside>{/if}
    {#if feedback}<p class:success={completed} class="answer-feedback" role="status">{feedback}</p>{/if}
    {#if showFactFamily}
      <section class="story-fact-family" aria-label="Các phép tính cùng liên kết số">
        <strong>Con đọc to bốn phép tính để nhớ nhé:</strong>
        {#each factFamily as fact}<span>{fact}</span>{/each}
      </section>
    {/if}
  </section>
  <section class="answer-panel" aria-label="Chọn câu trả lời">
    {#if completed}
      <button class="primary-action compact" type="button" onclick={onNext}>{showFactFamily ? "Con đã đọc xong, tiếp tục" : "Tiếp tục"}</button>
    {:else}
      <button class="hint-button" type="button" onclick={onHint}>Gợi ý</button>
      {#if exercise.stage === "direction" || exercise.stage === "before-after"}
        <div class="story-choice-grid"><button type="button" onclick={() => onAnswer("increase")}>{exercise.stage === "before-after" ? "Nhiều hơn" : "Tăng lên"}</button><button type="button" onclick={() => onAnswer("decrease")}>{exercise.stage === "before-after" ? "Ít hơn" : "Giảm đi"}</button></div>
      {:else if exercise.stage === "operator"}
        <div class="story-choice-grid"><button type="button" onclick={() => onAnswer("+")}>+</button><button type="button" onclick={() => onAnswer("-")}>−</button></div>
      {:else if exercise.stage === "numbers"}
        <div class="story-choice-grid">{#each numberChoices as first}{#each numberChoices as second}{#if first !== second || (firstOperand === first && secondOperand === second)}<button type="button" onclick={() => onAnswer(`${first},${second}`)}>{first} và {second}</button>{/if}{/each}{/each}</div>
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
