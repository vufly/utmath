<script lang="ts">
  import type { Hint, PartWholeExercise } from "../../core/types/domain";

  let { exercise, feedback = "", hint, answered, onAnswer, onHint }: {
    exercise: PartWholeExercise;
    feedback?: string;
    hint?: Hint;
    answered: number;
    onAnswer: (answer: number) => void;
    onHint: () => void;
  } = $props();

  const params = $derived(exercise.generator?.params);
  const whole = $derived(typeof params?.whole === "number" ? params.whole : 0);
  const hintFrameData = $derived(
    hint && typeof params?.whole === "number" && typeof params.partA === "number" && typeof params.partB === "number"
      ? { whole: params.whole, partA: params.partA, partB: params.partB }
      : undefined,
  );
  const hintAnswer = $derived(
    typeof hint?.payload === "object" && hint.payload !== null && typeof (hint.payload as { answer?: unknown }).answer === "number"
      ? (hint.payload as { answer: number }).answer
      : undefined,
  );
  const revealedAnswer = $derived(hint?.level === 3 ? hintAnswer : undefined);
  const knownPart = $derived(
    exercise.unknown === "part-a" ? exercise.partB : exercise.unknown === "part-b" ? exercise.partA : undefined,
  );
  const blueCounterCount = $derived(knownPart ?? hintFrameData?.partA ?? 0);
  const visibleWhole = $derived(exercise.whole ?? revealedAnswer ?? "?");
  const visiblePartA = $derived(exercise.partA ?? revealedAnswer ?? "?");
  const visiblePartB = $derived(exercise.partB ?? revealedAnswer ?? "?");
  const prompt = $derived(
    exercise.unknown === "whole"
      ? `${exercise.partA} và ${exercise.partB} ghép lại tạo thành số nào?`
      : `Hai phần ghép lại tạo thành ${whole}.`,
  );
</script>

<main class="exercise-page page">
  <header class="exercise-header">
    <span>Bài {answered + 1}</span>
    <span>{answered} bài đã làm</span>
  </header>

  <section class="exercise-card" aria-labelledby="exercise-title">
    <p class="eyebrow">Liên kết số</p>
    <h1 id="exercise-title">Số nào còn thiếu?</h1>
    <p class="exercise-prompt">{prompt}</p>

    <svg class="bond-diagram" viewBox="0 0 360 260" role="img" aria-label={`Sơ đồ số ${whole}, hai phần là ${visiblePartA} và ${visiblePartB}`}>
      <path d="M180 92 95 190M180 92l85 98" fill="none" stroke="#172554" stroke-linecap="round" stroke-width="8" />
      <circle cx="180" cy="68" r="48" fill="#fef3c7" stroke="#172554" stroke-width="6" />
      <circle cx="95" cy="208" r="48" fill="#dbeafe" stroke="#172554" stroke-width="6" />
      <circle cx="265" cy="208" r="48" fill="#d1fae5" stroke="#172554" stroke-width="6" />
      <text x="180" y="84" text-anchor="middle">{visibleWhole}</text>
      <text x="95" y="224" text-anchor="middle">{visiblePartA}</text>
      <text x="265" y="224" text-anchor="middle">{visiblePartB}</text>
    </svg>

    {#if feedback}
      <p class:success={feedback.includes("Đúng")} class="answer-feedback" role="status">{feedback}</p>
    {/if}

    {#if hint}
      <aside class="hint-card" aria-live="polite">
        <strong>Gợi ý</strong>
        {#if hintFrameData}
          <p>{hint.level === 1 ? typeof hint.payload === "string" ? hint.payload : "Con thử nhìn hai phần trong sơ đồ nhé." : hint.level === 2 ? typeof knownPart === "number" ? "Nhìn các chấm theo hai màu. Phần màu xanh lá là phần còn thiếu." : "Nhìn các chấm theo hai màu. Ghép hai phần lại để tìm số ở trên." : `Đáp án là ${hintAnswer}.`}</p>
          <div class="hint-frame">
            {#each Array(hintFrameData.whole) as _, index}
              <span class:known-counter={index < blueCounterCount} class="hint-counter"><i></i></span>
            {/each}
          </div>
        {:else}
          <p>{typeof hint.payload === "string" ? hint.payload : hintAnswer === undefined ? 'Con thử nhìn hai phần trong sơ đồ nhé.' : `Đáp án là ${hintAnswer}.`}</p>
        {/if}
      </aside>
    {/if}
  </section>

  <section class="answer-panel" aria-label="Chọn câu trả lời">
    <button class="hint-button" type="button" onclick={onHint}>Gợi ý</button>
    <div class="number-grid">
      {#each Array(11) as _, value}
        <button type="button" onclick={() => onAnswer(value)}>{value}</button>
      {/each}
    </div>
  </section>
</main>
