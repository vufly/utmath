<script lang="ts">
  let { onHome, onChangePin, onSettings }: {
    onHome: () => void;
    onChangePin: () => void;
    onSettings: () => void;
  } = $props();
</script>

<main class="parent-dashboard page">
  <header class="topbar">
    <button class="back-link" type="button" onclick={onHome}>← Trang chính</button>
    <button class="quiet-button" type="button" onclick={onSettings}>Cài đặt</button>
  </header>
  <section>
    <p class="eyebrow">Khu vực người lớn</p>
    <h1>Tiến độ của Uyển Thanh</h1>
    <p class="intro">Dữ liệu học tập sẽ hiển thị ở đây sau bài học đầu tiên.</p>
  </section>
  <section class="dashboard-grid">
    <article><strong>Chưa học</strong><span>Bài học hôm nay</span></article>
    <article><strong>0</strong><span>Ngày liên tiếp</span></article>
    <article><strong>Chưa bắt đầu</strong><span>Liên kết số</span></article>
  </section>
  <section class="parent-actions">
    <button class="secondary-action compact" type="button" onclick={onChangePin}>Đổi mã PIN</button>
  </section>
</main>
