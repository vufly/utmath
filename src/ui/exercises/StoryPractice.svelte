<script lang="ts">
  import type { Hint, StoryExercise } from "../../core/types/domain";
  import Bird from "../shared/Bird.svelte";

  let { exercise, feedback = "", hint, answered, onAnswer, onHint }: {
    exercise: StoryExercise;
    feedback?: string;
    hint?: Hint;
    answered: number;
    onAnswer: (answer: unknown) => void;
    onHint: () => void;
  } = $props();
  let buildLeft = $state<number | undefined>();
  let buildOperator = $state<"+" | "-" | undefined>();
  let buildRight = $state<number | undefined>();
  let buildResult = $state<number | undefined>();

  const isAdding = $derived(exercise.storyType !== "take-away");
  const operator = $derived(isAdding ? "+" : "-");
  const remainingCount = $derived(isAdding ? exercise.startCount ?? 0 : (exercise.startCount ?? 0) - (exercise.changeCount ?? 0));
  const movingCount = $derived(
    exercise.storyType === "missing-part" ? 0 : (exercise.changeCount ?? 0),
  );
  const equation = $derived(`${exercise.startCount}${operator}${exercise.changeCount}=${exercise.total}`);
  const numberChoices = $derived(
    [
      ...new Set([
        exercise.startCount ?? 0,
        exercise.changeCount ?? 0,
        exercise.total ?? 0,
        Math.min(10, (exercise.total ?? 0) + 1),
      ]),
    ],
  );
  const equationChoices = $derived([...new Set([equation, `${exercise.startCount}${isAdding ? "-" : "+"}${exercise.changeCount}=${isAdding ? (exercise.startCount ?? 0) - (exercise.changeCount ?? 0) : (exercise.startCount ?? 0) + (exercise.changeCount ?? 0)}`, `${exercise.changeCount}${operator}${exercise.startCount}=${exercise.total}`])]);
  const prompt = $derived(
    exercise.stage === "direction" ? "Số lượng đang tăng hay giảm?" :
    exercise.stage === "before-after" ? "Sau khi thay đổi, nhiều hơn hay ít hơn?" :
    exercise.stage === "parts-whole" ? "Hai phần ghép lại tạo thành số nào?" :
    exercise.stage === "operator" ? "Nên dùng dấu nào?" :
    exercise.stage === "numbers" ? "Hai số nào kể điều đang xảy ra?" :
    exercise.stage === "equation-choice" ? "Phép tính nào đúng với tranh?" :
    exercise.stage === "build" ? "Lập phép tính từ tranh" :
    exercise.storyType === "missing-part" ? "Cần thêm bao nhiêu con chim?" : "Có tất cả bao nhiêu?",
  );

  function submitBuild(): void {
    if (buildLeft === undefined || buildOperator === undefined || buildRight === undefined || buildResult === undefined) return;
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
    <p class="exercise-prompt">{exercise.storyType === "combine" ? `${exercise.startCount} con chim và ${exercise.changeCount} con chim.` : exercise.storyType === "missing-part" ? `${exercise.startCount} con chim, cần thành ${exercise.total} con chim.` : `${exercise.startCount} con chim. ${exercise.changeCount} con chim ${isAdding ? "bay đến" : "bay đi"}.`}</p>
    <div class="story-birds" aria-label={isAdding ? `${exercise.startCount} con chim và ${exercise.changeCount} con chim` : `${exercise.startCount} con chim, trong đó ${exercise.changeCount} con chim bay đi`}>
      {#each Array(remainingCount) as _}<Bird variant="blue" />{/each}
      {#each Array(movingCount) as _}<span class:arriving-bird={isAdding} class:departing-bird={!isAdding}><Bird variant="yellow" /></span>{/each}
    </div>
    {#if hint}<aside class="hint-card" aria-live="polite"><strong>Gợi ý</strong><p>{typeof hint.payload === "string" ? hint.payload : "Nhìn điều đang xảy ra trong tranh nhé."}</p></aside>{/if}
    {#if feedback}<p class:success={feedback.includes("Đúng")} class="answer-feedback" role="status">{feedback}</p>{/if}
  </section>
  <section class="answer-panel" aria-label="Chọn câu trả lời"><button class="hint-button" type="button" onclick={onHint}>Gợi ý</button>{#if exercise.stage === "direction" || exercise.stage === "before-after"}<div class="story-choice-grid"><button type="button" onclick={() => onAnswer("increase")}>Tăng lên</button><button type="button" onclick={() => onAnswer("decrease")}>Giảm đi</button></div>{:else if exercise.stage === "operator"}<div class="story-choice-grid"><button type="button" onclick={() => onAnswer("+")}>+</button><button type="button" onclick={() => onAnswer("-")}>−</button></div>{:else if exercise.stage === "numbers"}<div class="story-choice-grid">{#each numberChoices as first}{#each numberChoices as second}{#if first !== second}<button type="button" onclick={() => onAnswer(`${first},${second}`)}>{first} và {second}</button>{/if}{/each}{/each}</div>{:else if exercise.stage === "equation-choice"}<div class="story-choice-grid">{#each equationChoices as choice}<button type="button" onclick={() => onAnswer(choice)}>{choice.replace("=", " = ")}</button>{/each}</div>{:else if exercise.stage === "build"}<div class="equation-builder" aria-label="Lập phép tính"><div><strong>Số đầu</strong>{#each numberChoices as value}<button class:selected-build={buildLeft === value} type="button" onclick={() => (buildLeft = value)}>{value}</button>{/each}</div><div><strong>Dấu</strong><button class:selected-build={buildOperator === "+"} type="button" onclick={() => (buildOperator = "+")}>+</button><button class:selected-build={buildOperator === "-"} type="button" onclick={() => (buildOperator = "-")}>−</button></div><div><strong>Số sau</strong>{#each numberChoices as value}<button class:selected-build={buildRight === value} type="button" onclick={() => (buildRight = value)}>{value}</button>{/each}</div><div><strong>Kết quả</strong>{#each numberChoices as value}<button class:selected-build={buildResult === value} type="button" onclick={() => (buildResult = value)}>{value}</button>{/each}</div></div><button class="primary-action compact" type="button" onclick={submitBuild}>Kiểm tra</button>{:else}<div class="number-grid">{#each Array(11) as _, value}<button type="button" onclick={() => onAnswer(value)}>{value}</button>{/each}</div>{/if}</section>
</main>
