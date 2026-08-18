<script lang="ts">
  let { variant = "blue" }: { variant?: "blue" | "yellow" } = $props();

  const cover = $derived(variant === "blue" ? "#60a5fa" : "#fbbf24");
</script>

<svg class="scene-object book" viewBox="0 0 60 58" aria-hidden="true">
  <rect x="8" y="7" width="44" height="44" rx="5" fill={cover} stroke="#172554" stroke-width="3" />
  <path d="M18 15h23M18 24h23M18 33h16" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="3" />
  <path d="M15 7v44" stroke="#172554" stroke-width="3" />
</svg>
