<script lang="ts">
  let { variant = "blue" }: { variant?: "blue" | "yellow" } = $props();

  const body = $derived(variant === "blue" ? "#60a5fa" : "#fbbf24");
  const wing = $derived(variant === "blue" ? "#dbeafe" : "#fef3c7");
</script>

<svg class="scene-object duck" viewBox="0 0 72 56" aria-hidden="true">
  <ellipse cx="34" cy="34" rx="25" ry="15" fill={body} stroke="#172554" stroke-width="3" />
  <circle cx="53" cy="20" r="12" fill={body} stroke="#172554" stroke-width="3" />
  <path d="M63 21 71 25 63 29Z" fill="#fb923c" stroke="#172554" stroke-linejoin="round" stroke-width="2.5" />
  <path d="M17 30c11-9 24-7 28 4-9 4-17 2-24-3Z" fill={wing} stroke="#172554" stroke-linejoin="round" stroke-width="2.5" />
  <circle cx="56" cy="18" r="2.5" fill="#172554" />
</svg>
