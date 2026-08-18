<script lang="ts">
  import type { StoryExercise } from "../../core/types/domain";
  import Bird from "../shared/Bird.svelte";
  import Book from "../shared/Book.svelte";
  import Duck from "../shared/Duck.svelte";
  import Fish from "../shared/Fish.svelte";
  import Fruit from "../shared/Fruit.svelte";
  import Pencil from "../shared/Pencil.svelte";

  let { exercise, replay = false }: { exercise: StoryExercise; replay?: boolean } = $props();

  const startCount = $derived(exercise.startCount ?? 0);
  const changeCount = $derived(exercise.changeCount ?? 0);
  const remainingCount = $derived(
    exercise.storyType === "take-away" ? startCount - changeCount : startCount,
  );
  const showMotion = $derived(
    replay || exercise.stage === "direction" || exercise.stage === "before-after",
  );
  const sceneLabel = $derived.by(() => {
    if (exercise.sceneId === "bird-tree")
      return `${remainingCount} con chim còn đậu trên cành, ${changeCount} con chim bay đi.`;
    if (exercise.sceneId === "duck-pond")
      return `${startCount} con vịt ở ao, ${changeCount} con vịt bơi vào ao.`;
    if (exercise.sceneId === "fruit-basket")
      return `${startCount} quả táo và ${changeCount} quả táo ghép vào cùng giỏ.`;
    if (exercise.sceneId === "fish-pond")
      return `${startCount} con cá và ${changeCount} con cá bơi vào cùng ao.`;
    if (exercise.sceneId === "book-desk")
      return `${startCount} quyển sách trên bàn, cần đủ ${exercise.total} quyển.`;
    return `${startCount} bút chì trên bàn, cần đủ ${exercise.total} bút.`;
  });
</script>

<div
  class:scene-motion={showMotion}
  class:scene-replay={replay}
  class="story-scene"
  data-scene={exercise.sceneId}
  role="img"
  aria-label={sceneLabel}
>
  {#if exercise.sceneId === "bird-tree"}
    <svg class="scene-setting tree-setting" viewBox="0 0 360 180" aria-hidden="true">
      <path d="M71 172V64c0-24 23-38 41-49" fill="none" stroke="#8b5a2b" stroke-linecap="round" stroke-width="24" />
      <path d="M83 98c56-15 106-9 179 10" fill="none" stroke="#8b5a2b" stroke-linecap="round" stroke-width="18" />
      <circle cx="86" cy="35" r="37" fill="#86efac" stroke="#166534" stroke-width="4" />
      <circle cx="133" cy="45" r="42" fill="#86efac" stroke="#166534" stroke-width="4" />
      <path d="M38 158h286" stroke="#86efac" stroke-linecap="round" stroke-width="18" />
    </svg>
    <div class="scene-objects perched-birds">
      {#each Array(remainingCount) as _}<Bird variant="blue" />{/each}
    </div>
    <svg class="scene-arrow leaving-arrow" viewBox="0 0 110 70" aria-hidden="true"><path d="M16 56C37 51 59 34 85 15m-17 1 18-2-6 17" fill="none" stroke="#d97706" stroke-linecap="round" stroke-linejoin="round" stroke-width="5" /></svg>
    <div class="scene-objects departing-birds">
      {#each Array(changeCount) as _}<Bird variant="yellow" />{/each}
    </div>
  {:else if exercise.sceneId === "duck-pond"}
    <svg class="scene-setting pond-setting" viewBox="0 0 360 180" aria-hidden="true">
      <path d="M43 133c21-64 243-75 279-7 20 39-51 43-147 43S31 166 43 133Z" fill="#bae6fd" stroke="#0284c7" stroke-width="4" />
      <path d="M84 133c24-10 46-9 67-2m28 14c20-10 42-9 62-2m18-22c16-8 31-7 45-2" fill="none" stroke="#38bdf8" stroke-linecap="round" stroke-width="4" />
      <path d="M31 154c12-36 22-55 39-76m-13 53c8-29 18-43 34-61" fill="none" stroke="#65a30d" stroke-linecap="round" stroke-width="6" />
    </svg>
    <div class="scene-objects pond-ducks">
      {#each Array(startCount) as _}<Duck variant="blue" />{/each}
    </div>
    <svg class="scene-arrow entering-arrow" viewBox="0 0 100 70" aria-hidden="true"><path d="M12 18c30 4 49 17 72 36m-15-18 16 19-23 1" fill="none" stroke="#d97706" stroke-linecap="round" stroke-linejoin="round" stroke-width="5" /></svg>
    <div class="scene-objects arriving-ducks">
      {#each Array(changeCount) as _}<Duck variant="yellow" />{/each}
    </div>
  {:else if exercise.sceneId === "fruit-basket"}
    <svg class="scene-setting basket-setting" viewBox="0 0 360 180" aria-hidden="true">
      <path d="M126 100c12-45 96-45 108 0" fill="none" stroke="#8b5a2b" stroke-linecap="round" stroke-width="13" />
      <path d="M103 104h154l-18 56H121Z" fill="#fdba74" stroke="#9a3412" stroke-linejoin="round" stroke-width="4" />
      <path d="M117 122h126m-119 18h112" stroke="#f97316" stroke-width="4" />
    </svg>
    <div class="scene-objects basket-fruit">
      {#each Array(changeCount) as _}<Fruit variant="yellow" />{/each}
    </div>
    <div class="scene-objects incoming-fruit">
      {#each Array(startCount) as _}<Fruit variant="blue" />{/each}
    </div>
    <svg class="scene-arrow combine-arrow" viewBox="0 0 92 58" aria-hidden="true"><path d="M8 29h66m-18-17 19 17-19 17" fill="none" stroke="#d97706" stroke-linecap="round" stroke-linejoin="round" stroke-width="5" /></svg>
  {:else if exercise.sceneId === "fish-pond"}
    <svg class="scene-setting fish-setting" viewBox="0 0 360 180" aria-hidden="true">
      <path d="M27 133c9-56 288-70 306-2 14 52-68 44-151 44S16 177 27 133Z" fill="#bae6fd" stroke="#0284c7" stroke-width="4" />
      <path d="M46 102c41-18 223-30 272 0" fill="none" stroke="#7dd3fc" stroke-linecap="round" stroke-width="8" />
      <path d="M62 141c23-12 47-12 69-2m64 14c25-12 49-12 70-2" fill="none" stroke="#38bdf8" stroke-linecap="round" stroke-width="4" />
    </svg>
    <div class="scene-objects fish-group fish-left">
      {#each Array(startCount) as _}<Fish variant="blue" />{/each}
    </div>
    <svg class="scene-arrow fish-arrow" viewBox="0 0 92 58" aria-hidden="true"><path d="M8 29h66m-18-17 19 17-19 17" fill="none" stroke="#d97706" stroke-linecap="round" stroke-linejoin="round" stroke-width="5" /></svg>
    <div class="scene-objects fish-group fish-right">
      {#each Array(changeCount) as _}<Fish variant="yellow" />{/each}
    </div>
  {:else}
    <svg class="scene-setting desk-setting" viewBox="0 0 360 180" aria-hidden="true">
      <rect x="28" y="26" width="304" height="103" rx="10" fill="#fef3c7" stroke="#92400e" stroke-width="4" />
      <path d="M15 130h330" stroke="#92400e" stroke-linecap="round" stroke-width="18" />
      <path d="M56 149v24m248-24v24" stroke="#92400e" stroke-linecap="round" stroke-width="10" />
    </svg>
    <div class="scene-objects desk-objects">
      {#if exercise.sceneId === "book-desk"}
        {#each Array(startCount) as _}<Book variant="blue" />{/each}
      {:else}
        {#each Array(startCount) as _}<Pencil variant="blue" />{/each}
      {/if}
    </div>
    <div class="scene-objects missing-slots" aria-hidden="true">
      {#each Array(changeCount) as _}<span></span>{/each}
    </div>
  {/if}
</div>
