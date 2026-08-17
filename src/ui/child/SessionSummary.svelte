<script lang="ts">
  let { stars, onHome }: { stars: number; onHome: () => void } = $props();
</script>

<main class="summary-page page">
  <section class="summary-card" aria-labelledby="summary-title">
    <svg class="summary-star" viewBox="0 0 100 100" aria-hidden="true">
      <path d="m50 7 12 28 31 3-23 20 7 30-27-16-27 16 7-30L7 38l31-3z" fill="#fbbf24" stroke="#172554" stroke-linejoin="round" stroke-width="6" />
    </svg>
    <p class="eyebrow">Con đã hoàn thành</p>
    <h1 id="summary-title">Giỏi lắm, Uyển Thanh!</h1>
    <p class="intro">Hôm nay con đã luyện cách nhìn một số thành hai phần.</p>
    <p class="stars-earned"><strong>{stars}</strong> ngôi sao</p>
    <button class="primary-action compact" type="button" onclick={onHome}>Về trang chính</button>
  </section>
</main>
