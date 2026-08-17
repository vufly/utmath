<script lang="ts">
  import type { Hint, StoryExercise } from "../../core/types/domain";
  import Bird from "../shared/Bird.svelte";

  let { exercise, feedback = "", hint, answered, onAnswer, onHint }: {
    exercise: StoryExercise;
    feedback?: string;
    hint?: Hint;
    answered: number;
    onAnswer: (answer: number) => void;
    onHint: () => void;
  } = $props();
  const isAdding = $derived(exercise.storyType === "add-to");
  const remainingCount = $derived(
    isAdding
      ? (exercise.startCount ?? 0)
      : (exercise.startCount ?? 0) - (exercise.changeCount ?? 0),
  );
  const movingCount = $derived(exercise.changeCount ?? 0);

</script>

<main class="exercise-page page">
  <header class="exercise-header"><span>Bài {answered + 1}</span><span>{answered} bài đã làm</span></header>
  <section class="exercise-card" aria-labelledby="story-title">
    <p class="eyebrow">Toán tranh</p>
    <h1 id="story-title">Có tất cả bao nhiêu?</h1>
    <p class="exercise-prompt">{exercise.startCount} con chim. {exercise.changeCount} con chim {exercise.storyType === "add-to" ? "bay đến" : "bay đi"}.</p>
    <div class="story-birds" aria-label={isAdding ? `${exercise.startCount} con chim và ${exercise.changeCount} con chim bay đến` : `${exercise.startCount} con chim, trong đó ${exercise.changeCount} con chim bay đi`}>
      {#each Array(remainingCount) as _}<Bird variant="blue" />{/each}
      {#each Array(movingCount) as _}<span class:arriving-bird={isAdding} class:departing-bird={!isAdding}><Bird variant="yellow" /></span>{/each}
    </div>
    {#if hint}<aside class="hint-card" aria-live="polite"><strong>Gợi ý</strong><p>{typeof hint.payload === "string" ? hint.payload : "Nhìn điều đang xảy ra trong tranh nhé."}</p></aside>{/if}
    {#if feedback}<p class:success={feedback.includes("Đúng")} class="answer-feedback" role="status">{feedback}</p>{/if}
  </section>
  <section class="answer-panel" aria-label="Chọn câu trả lời"><button class="hint-button" type="button" onclick={onHint}>Gợi ý</button><div class="number-grid">{#each Array(11) as _, value}<button type="button" onclick={() => onAnswer(value)}>{value}</button>{/each}</div></section>
</main>
