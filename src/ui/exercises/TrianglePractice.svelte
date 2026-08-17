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
  let selectedIds = $state<string[]>([]);
  let selectionMessage = $state("");

  function selectTriangle(id: string): void {
    if (selectedIds.includes(id)) {
      selectionMessage = "Con đã tìm tam giác này rồi.";
      return;
    }
    selectedIds = [...selectedIds, id];
    selectionMessage = "";
  }
</script>

<main class="exercise-page page">
  <header class="exercise-header"><span>Bài {answered + 1}</span><span>{answered} bài đã làm</span></header>
  <section class="exercise-card" aria-labelledby="triangle-title">
    <p class="eyebrow">Đếm tam giác</p>
    <h1 id="triangle-title">{exercise.answerMode === "select" ? "Chạm vào mọi tam giác" : "Có bao nhiêu tam giác?"}</h1>
    {#if definition}<svg class="triangle-figure" viewBox="0 0 200 200" role="group" aria-label="Hình gồm các tam giác"><path d={definition.path} fill="none" stroke="#172554" stroke-linecap="round" stroke-linejoin="round" stroke-width="6" />{#each definition.regions ?? [] as region}<polygon class:selected={selectedIds.includes(region.id)} points={region.points} role="button" aria-label="Chọn tam giác" tabindex="0" onclick={() => selectTriangle(region.id)} onkeydown={(event) => { if (event.key === "Enter" || event.key === " ") selectTriangle(region.id); }} />{/each}</svg>{/if}
    {#if exercise.answerMode === "select"}<p class="triangle-count">Con đã tìm: <strong>{selectedIds.length}</strong></p>{/if}
    {#if selectionMessage}<p class="answer-feedback">{selectionMessage}</p>{/if}
    {#if hint}<aside class="hint-card" aria-live="polite"><strong>Gợi ý</strong><p>{typeof hint.payload === "string" ? hint.payload : "Con thử nhìn các cạnh bên trong hình nhé."}</p></aside>{/if}
    {#if feedback}<p class:success={feedback.includes("Đúng")} class="answer-feedback" role="status">{feedback}</p>{/if}
  </section>
  <section class="answer-panel" aria-label={exercise.answerMode === "select" ? "Kiểm tra tam giác" : "Chọn câu trả lời"}><button class="hint-button" type="button" onclick={onHint}>Gợi ý</button>{#if exercise.answerMode === "select"}<button class="primary-action compact" type="button" onclick={() => onAnswer(selectedIds.length)}>Kiểm tra</button>{:else}<div class="number-grid">{#each Array(11) as _, value}<button type="button" onclick={() => onAnswer(value)}>{value}</button>{/each}</div>{/if}</section>
</main>
