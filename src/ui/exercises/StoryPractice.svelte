<script lang="ts">
  import type { Hint, StoryExercise } from "../../core/types/domain";

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
      {#each Array(remainingCount) as _}<svg class="bird" viewBox="0 0 64 48" aria-hidden="true"><path d="M12 33c5-14 17-20 29-13 3-10 12-13 19-8-6 5-8 10-8 16 5 2 8 6 9 11-9-1-16-5-22-10-6 9-16 12-29 7 4-2 7-5 11-9-4 1-8 2-11 1Z" fill="#60a5fa" stroke="#172554" stroke-linejoin="round" stroke-width="3"/><circle cx="42" cy="18" r="2.5" fill="#172554"/><path d="m54 22 7 3-7 3" fill="#fbbf24" stroke="#172554" stroke-linejoin="round" stroke-width="2"/></svg>{/each}
      {#each Array(movingCount) as _}<svg class:arriving-bird={isAdding} class:departing-bird={!isAdding} class="bird" viewBox="0 0 64 48" aria-hidden="true"><path d="M12 33c5-14 17-20 29-13 3-10 12-13 19-8-6 5-8 10-8 16 5 2 8 6 9 11-9-1-16-5-22-10-6 9-16 12-29 7 4-2 7-5 11-9-4 1-8 2-11 1Z" fill="#fbbf24" stroke="#172554" stroke-linejoin="round" stroke-width="3"/><circle cx="42" cy="18" r="2.5" fill="#172554"/><path d="m54 22 7 3-7 3" fill="#fb7185" stroke="#172554" stroke-linejoin="round" stroke-width="2"/></svg>{/each}
    </div>
    {#if hint}<aside class="hint-card" aria-live="polite"><strong>Gợi ý</strong><p>{typeof hint.payload === "string" ? hint.payload : "Nhìn điều đang xảy ra trong tranh nhé."}</p></aside>{/if}
    {#if feedback}<p class:success={feedback.includes("Đúng")} class="answer-feedback" role="status">{feedback}</p>{/if}
  </section>
  <section class="answer-panel" aria-label="Chọn câu trả lời"><button class="hint-button" type="button" onclick={onHint}>Gợi ý</button><div class="number-grid">{#each Array(11) as _, value}<button type="button" onclick={() => onAnswer(value)}>{value}</button>{/each}</div></section>
</main>
