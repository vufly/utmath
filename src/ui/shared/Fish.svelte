<script lang="ts">
  let { variant = "blue" }: { variant?: "blue" | "yellow" } = $props();

  const body = $derived(variant === "blue" ? "#60a5fa" : "#fbbf24");
</script>

<svg class="scene-object fish" viewBox="0 0 72 52" aria-hidden="true">
  <path d="M15 26 3 12l2 14-2 14 12-14" fill={body} stroke="#172554" stroke-linejoin="round" stroke-width="3" />
  <ellipse cx="39" cy="26" rx="27" ry="17" fill={body} stroke="#172554" stroke-width="3" />
  <path d="M29 16c8 6 8 14 0 20" fill="none" stroke="#dbeafe" stroke-linecap="round" stroke-width="3" />
  <circle cx="53" cy="23" r="2.5" fill="#172554" />
</svg>
