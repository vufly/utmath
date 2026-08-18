<script lang="ts">
  let { variant = "blue" }: { variant?: "blue" | "yellow" } = $props();

  const fruit = $derived(variant === "blue" ? "#ef4444" : "#22c55e");
</script>

<svg class="scene-object fruit" viewBox="0 0 56 60" aria-hidden="true">
  <path d="M29 13c2-7 6-10 12-10" fill="none" stroke="#166534" stroke-linecap="round" stroke-width="4" />
  <path d="M31 10c8-6 14-2 15 4-7 3-12 1-15-4Z" fill="#86efac" stroke="#166534" stroke-linejoin="round" stroke-width="2.5" />
  <path d="M28 16c14 0 22 10 20 25-2 11-10 17-20 17S8 52 8 41c-2-15 6-25 20-25Z" fill={fruit} stroke="#172554" stroke-width="3" />
  <path d="M18 29c4-5 8-6 12-5" fill="none" stroke="#fee2e2" stroke-linecap="round" stroke-width="3" />
</svg>
