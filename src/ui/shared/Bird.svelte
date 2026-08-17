<script lang="ts">
  let { variant = "blue" }: { variant?: "blue" | "yellow" } = $props();

  const body = $derived(variant === "blue" ? "#60a5fa" : "#fbbf24");
  const wing = $derived(variant === "blue" ? "#dbeafe" : "#fef3c7");
</script>

<svg class="bird" viewBox="0 0 72 56" aria-hidden="true">
  <path d="m18 30-15-8 8 11-8 8 16-4" fill={body} stroke="#172554" stroke-linejoin="round" stroke-width="3" />
  <ellipse cx="34" cy="32" rx="24" ry="15" fill={body} stroke="#172554" stroke-width="3" />
  <circle cx="53" cy="20" r="12" fill={body} stroke="#172554" stroke-width="3" />
  <path d="M63 20 71 24 63 28Z" fill="#fb923c" stroke="#172554" stroke-linejoin="round" stroke-width="2.5" />
  <path d="M19 31c5-12 18-15 27-5-9 1-14 6-18 13-5-1-8-4-9-8Z" fill={wing} stroke="#172554" stroke-linejoin="round" stroke-width="2.5" />
  <circle cx="56" cy="18" r="2.5" fill="#172554" />
</svg>
