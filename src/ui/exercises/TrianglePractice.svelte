<script lang="ts">
  import { pathForDefinition, pointsForTriangle, triangleDefinitions } from "../../exercises/triangle/triangle";
  import type { Hint, TriangleExercise } from "../../core/types/domain";

  let { exercise, feedback = "", hint, answered, onAnswer, onHint }: {
    exercise: TriangleExercise;
    feedback?: string;
    hint?: Hint;
    answered: number;
    onAnswer: (answer: unknown) => void;
    onHint: () => void;
  } = $props();
  const definition = $derived(triangleDefinitions.find((item) => item.id === exercise.definitionId));
  const hintTriangleId = $derived(
    typeof hint?.payload === "object" && hint.payload !== null && typeof (hint.payload as { hintTriangleId?: unknown }).hintTriangleId === "string"
      ? (hint.payload as { hintTriangleId: string }).hintTriangleId
      : undefined,
  );
  let selectedIds = $state<string[]>([]);
  let activeSize = $state<"small" | "medium" | "large">("small");
  let selectionMessage = $state("");
  const visibleTriangles = $derived(definition?.validTriangles.filter((item) => item.sizeClass === activeSize) ?? []);
  const nextSize = $derived.by(() => {
    const sizes: Array<"small" | "medium" | "large"> = ["small", "medium", "large"];
    const index = sizes.indexOf(activeSize);
    return sizes.slice(index + 1).find((size) =>
      definition?.validTriangles.some((item) => item.sizeClass === size && !selectedIds.includes(item.id)),
    );
  });

  function selectTriangle(id: string): void {
    if (selectedIds.includes(id)) {
      selectionMessage = "Con đã tìm tam giác này rồi.";
      return;
    }
    const nextSelectedIds = [...selectedIds, id];
    selectedIds = nextSelectedIds;
    const foundAllVisible = visibleTriangles.every((triangle) =>
      nextSelectedIds.includes(triangle.id),
    );
    if (foundAllVisible && nextSize) {
      activeSize = nextSize;
      selectionMessage = `Con đã tìm hết tam giác ${activeSize === "large" ? "nhỏ" : "vừa"}. Bây giờ tìm tam giác ${nextSize === "large" ? "lớn" : "vừa"}.`;
      return;
    }
    selectionMessage = "";
  }
</script>

<main class="exercise-page page">
  <header class="exercise-header"><span>Bài {answered + 1}</span><span>{answered} bài đã làm</span></header>
  <section class="exercise-card" aria-labelledby="triangle-title">
    <p class="eyebrow">Đếm tam giác</p>
    <h1 id="triangle-title">{exercise.answerMode === "select" ? "Chạm vào mọi tam giác" : "Có bao nhiêu tam giác?"}</h1>
    {#if definition}<svg class="triangle-figure" viewBox="0 0 200 200" role="group" aria-label="Hình gồm các tam giác"><path d={pathForDefinition(definition)} fill="none" stroke="#172554" stroke-linecap="round" stroke-linejoin="round" stroke-width="6" />{#if exercise.answerMode === "select"}{#each visibleTriangles as triangle}<polygon class:selected={selectedIds.includes(triangle.id)} class:hint-region={hintTriangleId === triangle.id} points={pointsForTriangle(definition, triangle)} role="button" aria-label={`Chọn tam giác ${triangle.sizeClass}`} tabindex="0" onclick={() => selectTriangle(triangle.id)} onkeydown={(event) => { if (event.key === "Enter" || event.key === " ") selectTriangle(triangle.id); }} />{/each}{/if}</svg>{/if}
    {#if exercise.answerMode === "select"}<div class="triangle-size-controls" aria-label="Chọn kích thước tam giác"><button class:active-size={activeSize === "small"} type="button" onclick={() => (activeSize = "small")}>Nhỏ</button>{#if definition?.validTriangles.some((item) => item.sizeClass === "medium")}<button class:active-size={activeSize === "medium"} type="button" onclick={() => (activeSize = "medium")}>Vừa</button>{/if}{#if definition?.validTriangles.some((item) => item.sizeClass === "large")}<button class:active-size={activeSize === "large"} type="button" onclick={() => (activeSize = "large")}>Lớn</button>{/if}</div><p class="triangle-count">Con đã tìm: <strong>{selectedIds.length}</strong> / {definition?.validTriangles.length ?? 0}</p>{/if}
    {#if selectionMessage}<p class="answer-feedback">{selectionMessage}</p>{/if}
    {#if hint}<aside class="hint-card" aria-live="polite"><strong>Gợi ý</strong><p>{typeof hint.payload === "string" ? hint.payload : "Nhìn phần được viền, rồi tìm tam giác chưa chọn nhé."}</p></aside>{/if}
    {#if feedback}<p class:success={feedback.includes("Đúng")} class="answer-feedback" role="status">{feedback}</p>{/if}
  </section>
  <section class="answer-panel" aria-label={exercise.answerMode === "select" ? "Kiểm tra tam giác" : "Chọn câu trả lời"}><button class="hint-button" type="button" onclick={onHint}>Gợi ý</button>{#if exercise.answerMode === "select"}<button class="primary-action compact" type="button" onclick={() => onAnswer({ count: selectedIds.length, selectedIds })}>Kiểm tra</button>{:else}<div class="number-grid">{#each Array(11) as _, value}<button type="button" onclick={() => onAnswer(value)}>{value}</button>{/each}</div>{/if}</section>
</main>
