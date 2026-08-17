<script lang="ts">
  let { message = "", onExport, onImport, onBack }: {
    message?: string;
    onExport: () => void;
    onImport: (text: string) => void;
    onBack: () => void;
  } = $props();

  async function chooseImport(event: Event): Promise<void> {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (file) onImport(await file.text());
    input.value = "";
  }
</script>

<main class="backup-page page">
  <button class="back-link" type="button" onclick={onBack}>← Bảng tiến độ</button>
  <section class="backup-card">
    <p class="eyebrow">Sao lưu</p>
    <h1>Tiến độ học</h1>
    <p class="intro">Lưu một bản sao trước khi đổi thiết bị hoặc cập nhật ứng dụng.</p>
    <button class="primary-action compact" type="button" onclick={onExport}>Xuất tiến độ</button>
    <label class="import-control">
      Nhập bản sao đã lưu
      <input accept="application/json" type="file" onchange={chooseImport} />
    </label>
    {#if message}<p class="answer-feedback" role="status">{message}</p>{/if}
  </section>
</main>
