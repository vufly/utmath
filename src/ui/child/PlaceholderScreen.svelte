<script lang="ts">
  import type { Route } from '../../app/navigation/routes';

  let { route, onHome }: { route: Route; onHome: () => void } = $props();

  const labels: Record<Route, { title: string; detail: string }> = {
    home: { title: '', detail: '' },
    session: { title: 'Bài học hôm nay', detail: 'Bài học số đầu tiên đang được chuẩn bị.' },
    summary: { title: 'Hoàn thành rồi!', detail: 'Trang tổng kết sẽ xuất hiện sau mỗi buổi học.' },
    'parent-pin': { title: '', detail: '' },
    'parent-dashboard': { title: '', detail: '' },
    settings: { title: '', detail: '' },
    backup: { title: '', detail: '' },
  };
</script>

<main class="placeholder page">
  <p class="eyebrow">Uyển Thanh Học Toán</p>
  <h1>{labels[route].title}</h1>
  <p>{labels[route].detail}</p>
  <button class="primary-action compact" type="button" onclick={onHome}>Về trang chính</button>
</main>
