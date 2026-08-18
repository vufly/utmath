<script lang="ts">
  import type {
    ArithmeticExercise,
    Hint,
    MissingNumberExercise,
  } from "../../core/types/domain";

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
  const numberLineStart = $derived(
    exercise.kind === "arithmetic" && exercise.operation === "add"
      ? exercise.strategySkillId === "C.start-larger"
        ? Math.max(exercise.left, exercise.right)
        : exercise.left
      : exercise.kind === "arithmetic"
        ? exercise.left
        : undefined,
  );
  const numberLineEnd = $derived(
    exercise.kind === "arithmetic" ? exercise.result : undefined,
  );
  const numberLineSteps = $derived(
    numberLineStart === undefined || numberLineEnd === undefined
      ? 0
      : Math.abs(numberLineEnd - numberLineStart),
  );
  const numberLineInstruction = $derived(
    numberLineStart === undefined || numberLineEnd === undefined
      ? ""
      : numberLineSteps === 0
        ? `Đứng yên ở ${numberLineStart}.`
        : `Bắt đầu ở ${numberLineStart}. ${numberLineEnd > numberLineStart ? "Tiến" : "Lùi"} ${numberLineSteps} bước trên đường số.`,
  );
  const missingVisual = $derived.by(() => {
    if (exercise.kind !== "missing-number" || hint?.type !== "visual")
      return undefined;
    const params = exercise.generator?.params;
    if (
      typeof params?.left !== "number" ||
      typeof params.right !== "number" ||
      typeof params.result !== "number"
    )
      return undefined;
    if (exercise.operation === "add") {
      if (exercise.unknown === "result")
        return {
          total: params.left + params.right,
          known: params.left,
          split: params.left,
        };
      const known = exercise.unknown === "left" ? params.right : params.left;
      return { total: params.result, known, split: known };
    }
    if (exercise.unknown === "left")
      return {
        total: params.right + params.result,
        known: params.right + params.result,
        split: params.right,
      };
    if (exercise.unknown === "right")
      return { total: params.left, known: params.result, split: params.result };
    return {
      total: params.left,
      known: params.left - params.right,
      split: params.left - params.right,
    };
  });
</script>

<main class="exercise-page page">
  <header class="exercise-header"><span>Bài {answered + 1}</span><span>{answered} bài đã làm</span></header>
  <section class="exercise-card equation-card" aria-labelledby="equation-title">
    <p class="eyebrow">{exercise.kind === "arithmetic" ? "Tính nhẩm" : "Số còn thiếu"}</p>
    <h1 id="equation-title">Tìm số đúng</h1>
    <p class="large-equation">{equation}</p>
    {#if hint}
      <aside class="hint-card" aria-live="polite">
        <strong>Gợi ý</strong>
        <p>{typeof hint.payload === "string" ? hint.payload : "Con thử nhìn mối liên hệ giữa các số nhé."}</p>
        {#if hint.type === "visual" && numberLineStart !== undefined && numberLineEnd !== undefined}
          <p class="number-line-instruction">{numberLineInstruction}</p>
          <div class="strategy-number-line" aria-label={`Từ ${numberLineStart} đến ${numberLineEnd}, ${numberLineSteps} bước`}>
            {#each Array(11) as _, value}
              <span class:line-start={value === numberLineStart} class:line-end={value === numberLineEnd} class:line-step={value > Math.min(numberLineStart, numberLineEnd) && value < Math.max(numberLineStart, numberLineEnd)}>{value}</span>
            {/each}
          </div>
        {/if}
        {#if missingVisual}
          <div class="missing-number-frame" aria-label="Sơ đồ phần và cả số">
            {#each Array(missingVisual.total) as _, index}
              <span class:known-counter={index < missingVisual.known} class:split-counter={index === missingVisual.split}><i></i></span>
            {/each}
          </div>
        {/if}
      </aside>
    {/if}
    {#if feedback}<p class:success={feedback.includes("Đúng")} class="answer-feedback" role="status">{feedback}</p>{/if}
  </section>
  <section class="answer-panel" aria-label="Chọn câu trả lời"><button class="hint-button" type="button" onclick={onHint}>Gợi ý</button><div class="number-grid">{#each Array(11) as _, value}<button type="button" onclick={() => onAnswer(value)}>{value}</button>{/each}</div></section>
</main>
