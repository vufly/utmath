<script lang="ts">
  import { triangleDefinitions } from "../../exercises/triangle/triangle";
  import type { Hint, TriangleExercise } from "../../core/types/domain";

  let { exercise, feedback = "", hint, answered, onAnswer, onHint }: {
    exercise: TriangleExercise;
    feedback?: string;
    hint?: Hint;
    answered: number;
    onAnswer: (answer: number) => void;
    onHint: () => void;
  } = $props();

  const definition = $derived(triangleDefinitions.find((item) => item.id === exercise.definitionId));
</script>

<main class="exercise-page page">
  <header class="exercise-header"><span>Bài {answered + 1}</span><span>{answered} bài đã làm</span></header>
  <section class="exercise-card" aria-labelledby="triangle-title">
    <p class="eyebrow">Đếm tam giác</p>
    <h1 id="triangle-title">Có bao nhiêu tam giác?</h1>
    {#if definition}<svg class="triangle-figure" viewBox="0 0 200 200" role="img" aria-label="Hình gồm các tam giác"><path d={definition.path} fill="none" stroke="#172554" stroke-linecap="round" stroke-linejoin="round" stroke-width="6" /></svg>{/if}
    {#if hint}<aside class="hint-card" aria-live="polite"><strong>Gợi ý</strong><p>{typeof hint.payload === "string" ? hint.payload : "Con thử nhìn các cạnh bên trong hình nhé."}</p></aside>{/if}
    {#if feedback}<p class:success={feedback.includes("Đúng")} class="answer-feedback" role="status">{feedback}</p>{/if}
  </section>
  <section class="answer-panel" aria-label="Chọn câu trả lời"><button class="hint-button" type="button" onclick={onHint}>Gợi ý</button><div class="number-grid">{#each Array(11) as _, value}<button type="button" onclick={() => onAnswer(value)}>{value}</button>{/each}</div></section>
</main>
