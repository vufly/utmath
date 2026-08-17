<script lang="ts">
  import type { ModuleId } from "../../core/types/domain";

  let { onSelect, onHome }: { onSelect: (module: ModuleId) => void; onHome: () => void } = $props();

  const modules: Array<{ id: ModuleId; title: string; detail: string; symbol: string }> = [
    { id: "A", title: "Nhìn nhanh số lượng", detail: "Chấm và khung số", symbol: "●" },
    { id: "B", title: "Liên kết số", detail: "Hai phần tạo thành một số", symbol: "⌁" },
    { id: "C", title: "Tính nhẩm", detail: "Cộng và trừ trong 10", symbol: "+" },
    { id: "D", title: "Số còn thiếu", detail: "Tìm số trong phép tính", symbol: "?" },
  ];
</script>

<main class="free-practice page">
  <button class="back-link" type="button" onclick={onHome}>← Trang chính</button>
  <section>
    <p class="eyebrow">Con muốn luyện gì?</p>
    <h1>Luyện tập tự do</h1>
    <p class="intro">Con chọn một trò chơi toán học nhé.</p>
  </section>
  <section class="module-picker" aria-label="Chọn nội dung luyện tập">
    {#each modules as module}
      <button type="button" onclick={() => onSelect(module.id)}>
        <span class="module-symbol" aria-hidden="true">{module.symbol}</span>
        <span><strong>{module.title}</strong><small>{module.detail}</small></span>
      </button>
    {/each}
  </section>
</main>
