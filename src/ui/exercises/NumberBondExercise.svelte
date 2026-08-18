<script lang="ts">
  import type { Hint, PartWholeExercise } from "../../core/types/domain";

  let { exercise, feedback = "", hint, answered, onAnswer, onHint, onNext = () => {} }: {
    exercise: PartWholeExercise;
    feedback?: string;
    hint?: Hint;
    answered: number;
    onAnswer: (answer: number) => void;
    onHint: () => void;
    onNext?: () => void;
  } = $props();

  const params = $derived(exercise.generator?.params);
  const whole = $derived(typeof params?.whole === "number" ? params.whole : 0);
  const partA = $derived(typeof params?.partA === "number" ? params.partA : 0);
  const partB = $derived(typeof params?.partB === "number" ? params.partB : 0);
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
    exercise.presentation === "combine"
      ? `${partA} và ${partB} chấm có tất cả bao nhiêu?`
      : exercise.presentation === "split"
        ? `Có ${whole} chấm. Nhóm bên trái có ${partA} chấm. Nhóm bên phải có mấy chấm?`
        : exercise.presentation === "fact-family"
          ? "Từ hai phần, tổng là bao nhiêu?"
          : exercise.unknown === "whole"
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
    <h1 id="exercise-title">{exercise.presentation === "combine" ? "Ghép hai nhóm" : exercise.presentation === "split" ? "Tách một nhóm" : exercise.presentation === "fact-family" ? "Gia đình phép tính" : "Số nào còn thiếu?"}</h1>
    <p class="exercise-prompt">{prompt}</p>

    {#if exercise.presentation === "combine"}
      <div class="bond-counters" aria-label={`${partA} chấm và ${partB} chấm`}>
        <div class="counter-group blue">{#each Array(partA) as _}<i></i>{/each}</div>
        <strong>và</strong>
        <div class="counter-group green">{#each Array(partB) as _}<i></i>{/each}</div>
      </div>
    {:else if exercise.presentation === "split"}
      <div class="bond-counters split-counters" aria-label={`${whole} chấm, ${partA} chấm đã biết`}>
        <div class="counter-group blue" role="group" aria-label={`Nhóm bên trái: ${partA} chấm`}>{#each Array(partA) as _}<i></i>{/each}</div>
        <span class="split-divider" aria-hidden="true"></span>
        <div class="counter-group green" role="group" aria-label={`Nhóm bên phải: ${partB} chấm`}>{#each Array(partB) as _}<i></i>{/each}</div>
      </div>
    {:else}
      <svg class="bond-diagram" viewBox="0 0 360 260" role="img" aria-label={`Sơ đồ số ${whole}, hai phần là ${visiblePartA} và ${visiblePartB}`}>
        <path d="M180 92 95 190M180 92l85 98" fill="none" stroke="#172554" stroke-linecap="round" stroke-width="8" />
        <circle cx="180" cy="68" r="48" fill="#fef3c7" stroke="#172554" stroke-width="6" />
        <circle cx="95" cy="208" r="48" fill="#dbeafe" stroke="#172554" stroke-width="6" />
        <circle cx="265" cy="208" r="48" fill="#d1fae5" stroke="#172554" stroke-width="6" />
        <text x="180" y="84" text-anchor="middle">{visibleWhole}</text>
        <text x="95" y="224" text-anchor="middle">{visiblePartA}</text>
        <text x="265" y="224" text-anchor="middle">{visiblePartB}</text>
      </svg>
      {#if exercise.presentation === "fact-family"}
        <div class="fact-family" aria-label="Các phép tính từ hai phần">
          <span>{partA} + {partB} = {visibleWhole}</span>
          <span>{partB} + {partA} = {visibleWhole}</span>
          <span>{visibleWhole} − {partA} = {partB}</span>
          <span>{visibleWhole} − {partB} = {partA}</span>
        </div>
      {/if}
    {/if}

    {#if feedback}
      <p class:success={feedback.includes("Đúng")} class="answer-feedback" role="status">{feedback}</p>
    {/if}
    {#if feedback.includes("Đúng")}
      <section class="bond-fact-family" aria-label="Các phép tính cùng liên kết số">
        <strong>Con đọc to bốn phép tính để nhớ nhé:</strong>
        <span>{whole} − {partB} = {partA}</span>
        <span>{whole} − {partA} = {partB}</span>
        <span>{partB} + {partA} = {whole}</span>
        <span>{partA} + {partB} = {whole}</span>
      </section>
    {/if}

    {#if hint}
      <aside class="hint-card" aria-live="polite">
        <strong>Gợi ý</strong>
        {#if hintFrameData}
          <p>{typeof hint.payload === "string" ? hint.payload : hintAnswer === undefined ? "Con thử nhìn hai phần trong sơ đồ nhé." : `Đáp án là ${hintAnswer}.`}</p>
          <div class="hint-frame">
            {#each Array(hintFrameData.whole) as _, index}
              <span class:known-counter={index < blueCounterCount} class="hint-counter"><i></i></span>
            {/each}
          </div>
        {:else}
          <p>{typeof hint.payload === "string" ? hint.payload : hintAnswer === undefined ? "Con thử nhìn hai phần trong sơ đồ nhé." : `Đáp án là ${hintAnswer}.`}</p>
        {/if}
      </aside>
    {/if}
  </section>

  <section class="answer-panel" aria-label="Chọn câu trả lời">
    {#if feedback.includes("Đúng")}
      <button class="primary-action compact" type="button" onclick={onNext}>Con đã đọc xong, tiếp tục</button>
    {:else}
      <button class="hint-button" type="button" onclick={onHint}>Gợi ý</button>
      <div class="number-grid">
        {#each Array(11) as _, value}
          <button type="button" onclick={() => onAnswer(value)}>{value}</button>
        {/each}
      </div>
    {/if}
  </section>
</main>
