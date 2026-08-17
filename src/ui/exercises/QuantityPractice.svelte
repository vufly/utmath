<script lang="ts">
  import type { Hint, QuantityExercise } from "../../core/types/domain";

  let { exercise, feedback = "", hint, answered, onAnswer, onHint }: {
    exercise: QuantityExercise;
    feedback?: string;
    hint?: Hint;
    answered: number;
    onAnswer: (answer: number) => void;
    onHint: () => void;
  } = $props();

  const columns = $derived(exercise.representation === "dots" ? exercise.quantity : 5);
</script>

<main class="exercise-page page">
  <header class="exercise-header"><span>Bài {answered + 1}</span><span>{answered} bài đã làm</span></header>
  <section class="exercise-card" aria-labelledby="quantity-title">
    <p class="eyebrow">Nhìn nhanh số lượng</p>
    <h1 id="quantity-title">Có bao nhiêu chấm?</h1>
    <div class:ten-frame={exercise.representation === "ten-frame"} class="quantity-frame" style={`--frame-columns: ${columns}`} aria-label={`${exercise.quantity} chấm`}>
      {#each Array(exercise.representation === "ten-frame" ? 10 : exercise.quantity) as _, index}
        <span class:empty-dot={index >= exercise.quantity}><i></i></span>
      {/each}
    </div>
    {#if hint}<aside class="hint-card" aria-live="polite"><strong>Gợi ý</strong><p>{typeof hint.payload === "string" ? hint.payload : "Nhìn các chấm theo khung nhé."}</p></aside>{/if}
    {#if feedback}<p class:success={feedback.includes("Đúng")} class="answer-feedback" role="status">{feedback}</p>{/if}
  </section>
  <section class="answer-panel" aria-label="Chọn câu trả lời"><button class="hint-button" type="button" onclick={onHint}>Gợi ý</button><div class="number-grid">{#each Array(11) as _, value}<button type="button" onclick={() => onAnswer(value)}>{value}</button>{/each}</div></section>
</main>
