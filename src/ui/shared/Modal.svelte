<script lang="ts">
  let { title, onClose, children }: { title: string; onClose: () => void; children: import('svelte').Snippet } = $props();
</script>

<div class="modal-backdrop">
  <dialog class="modal" open aria-labelledby="modal-title">
    <div class="modal-header">
      <h2 id="modal-title">{title}</h2>
      <button class="icon-button" type="button" aria-label="Đóng" onclick={onClose}>×</button>
    </div>
    {@render children()}
  </dialog>
</div>
