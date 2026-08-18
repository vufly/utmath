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

  let selectedCells = $state<number[]>([]);
  let flashVisible = $state(false);

  const cellCount = $derived(exercise.layout === "dots" ? exercise.quantity : exercise.layout === "dice" ? 9 : exercise.layout === "domino" ? 10 : exercise.layout === "five-frame" ? 5 : 10);
  const columns = $derived(exercise.layout === "dots" ? Math.min(exercise.quantity, 3) : exercise.layout === "dice" ? 3 : exercise.layout === "domino" ? 5 : 5);
  const selectedCount = $derived(selectedCells.length);
  const showRepresentation = $derived(
    !exercise.flashDurationMs || flashVisible,
  );

  function isFilled(index: number, quantity = exercise.quantity, layout = exercise.layout): boolean {
    if (layout === "dice") {
      const dicePositions: Record<number, number[]> = {
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
      };
      return dicePositions[quantity]?.includes(index) ?? false;
    }
    if (layout === "domino") {
      const dominoPositions: Record<number, number[]> = {
        4: [0, 1, 5, 6],
        5: [0, 1, 5, 6, 7],
      };
      return dominoPositions[quantity]?.includes(index) ?? false;
    }
    return index < quantity;
  }

  function toggleCell(index: number): void {
    if (exercise.answerMode !== "frame") return;
    selectedCells = selectedCells.includes(index)
      ? selectedCells.filter((item) => item !== index)
      : [...selectedCells, index];
  }

  $effect(() => {
    const exerciseId = exercise.id;
    selectedCells = [];
    flashVisible = Boolean(exercise.flashDurationMs);
    if (!exercise.flashDurationMs) return;
    const timer = window.setTimeout(() => {
      if (exercise.id === exerciseId) flashVisible = false;
    }, exercise.flashDurationMs);
    return () => window.clearTimeout(timer);
  });
</script>

<main class="exercise-page page">
  <header class="exercise-header"><span>Bài {answered + 1}</span><span>{answered} bài đã làm</span></header>
  <section class="exercise-card" aria-labelledby="quantity-title">
    <p class="eyebrow">Nhìn nhanh số lượng</p>
    <h1 id="quantity-title">{exercise.answerMode === "frame" ? `Đặt ${exercise.quantity} chấm vào khung` : exercise.answerMode === "match" ? `Tìm hình có ${exercise.quantity} chấm` : exercise.flashDurationMs && flashVisible ? "Nhìn thật nhanh nhé" : "Có bao nhiêu chấm?"}</h1>
    {#if exercise.answerMode === "match"}
      <div class="quantity-match-options" aria-label="Chọn hình đúng">
        {#each exercise.matchChoices ?? [] as choice}
          <button class:ten-frame={choice > 5} class="quantity-match" type="button" onclick={() => onAnswer(choice)} aria-label={`${choice} chấm`}>
            {#each Array(choice > 5 ? 10 : choice) as _, index}<span class:empty-dot={!isFilled(index, choice, choice > 5 ? "ten-frame" : "five-frame")}><i></i></span>{/each}
          </button>
        {/each}
      </div>
    {:else if showRepresentation}
      <div class:ten-frame={exercise.layout === "ten-frame"} class:dot-layout={exercise.layout === "dots"} class:dice-layout={exercise.layout === "dice"} class:domino-layout={exercise.layout === "domino"} class:selectable-frame={exercise.answerMode === "frame"} class="quantity-frame" style={`--frame-columns: ${columns}`} aria-label={`${exercise.quantity} chấm`}>
        {#each Array(cellCount) as _, index}
          <button class:empty-dot={exercise.answerMode === "frame" ? !selectedCells.includes(index) : !isFilled(index)} type="button" aria-label={exercise.answerMode === "frame" ? `Ô ${index + 1}` : undefined} aria-pressed={exercise.answerMode === "frame" ? selectedCells.includes(index) : undefined} disabled={exercise.answerMode !== "frame"} onclick={() => toggleCell(index)}><i></i></button>
        {/each}
      </div>
      {#if exercise.answerMode === "frame"}<p class="quantity-selected">Đã đặt: <strong>{selectedCount}</strong> chấm</p>{/if}
    {:else}
      <p class="flash-hidden" aria-live="polite">Các chấm đã ẩn rồi. Con chọn số đúng nhé.</p>
    {/if}
    {#if hint}<aside class="hint-card" aria-live="polite"><strong>Gợi ý</strong><p>{typeof hint.payload === "string" ? hint.payload : "Nhìn các chấm theo khung nhé."}</p></aside>{/if}
    {#if feedback}<p class:success={feedback.includes("Đúng")} class="answer-feedback" role="status">{feedback}</p>{/if}
  </section>
  <section class="answer-panel" aria-label="Chọn câu trả lời"><button class="hint-button" type="button" onclick={onHint}>Gợi ý</button>{#if exercise.answerMode === "frame"}<button class="primary-action compact" type="button" onclick={() => onAnswer(selectedCount)}>Kiểm tra</button>{:else if exercise.answerMode === "numeral"}<div class="number-grid">{#each Array(11) as _, value}<button type="button" onclick={() => onAnswer(value)}>{value}</button>{/each}</div>{/if}</section>
</main>
