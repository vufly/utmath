<script lang="ts">
  let { variant = "blue" }: { variant?: "blue" | "yellow" } = $props();

  const body = $derived(variant === "blue" ? "#60a5fa" : "#fbbf24");
</script>

<svg class="scene-object pencil" viewBox="0 0 34 72" aria-hidden="true">
  <path d="m8 58 9 11 9-11V9H8Z" fill={body} stroke="#172554" stroke-linejoin="round" stroke-width="3" />
  <path d="M8 9h18V3H8Z" fill="#fda4af" stroke="#172554" stroke-linejoin="round" stroke-width="3" />
  <path d="m8 58 9 11 9-11Z" fill="#fde68a" stroke="#172554" stroke-linejoin="round" stroke-width="3" />
  <path d="m14 65 3 4 3-4Z" fill="#172554" />
</svg>
