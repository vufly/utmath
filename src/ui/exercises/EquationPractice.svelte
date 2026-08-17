<script lang="ts">
  import type { ArithmeticExercise, Hint, MissingNumberExercise } from "../../core/types/domain";

  let { exercise, feedback = "", hint, answered, onAnswer, onHint }: {
    exercise: ArithmeticExercise | MissingNumberExercise;
    feedback?: string;
    hint?: Hint;
    answered: number;
    onAnswer: (answer: number) => void;
    onHint: () => void;
  } = $props();

  const operator = $derived(exercise.operation === "add" ? "+" : "−");
  const equation = $derived(
    exercise.kind === "arithmetic"
      ? `${exercise.left} ${operator} ${exercise.right} = ?`
      : `${exercise.left ?? "?"} ${operator} ${exercise.right ?? "?"} = ${exercise.result ?? "?"}`,
  );
</script>

<main class="exercise-page page">
  <header class="exercise-header"><span>Bài {answered + 1}</span><span>{answered} bài đã làm</span></header>
  <section class="exercise-card equation-card" aria-labelledby="equation-title">
    <p class="eyebrow">{exercise.kind === "arithmetic" ? "Tính nhẩm" : "Số còn thiếu"}</p>
    <h1 id="equation-title">Tìm số đúng</h1>
    <p class="large-equation">{equation}</p>
    {#if hint}<aside class="hint-card" aria-live="polite"><strong>Gợi ý</strong><p>{typeof hint.payload === "string" ? hint.payload : "Con thử nhìn mối liên hệ giữa các số nhé."}</p></aside>{/if}
    {#if feedback}<p class:success={feedback.includes("Đúng")} class="answer-feedback" role="status">{feedback}</p>{/if}
  </section>
  <section class="answer-panel" aria-label="Chọn câu trả lời"><button class="hint-button" type="button" onclick={onHint}>Gợi ý</button><div class="number-grid">{#each Array(11) as _, value}<button type="button" onclick={() => onAnswer(value)}>{value}</button>{/each}</div></section>
</main>
