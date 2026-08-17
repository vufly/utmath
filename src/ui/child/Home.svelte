<script lang="ts">
  import type { ChildProfile } from '../../app/state/profile';

  let { profile, totalStars, currentStreak, todayComplete, onStartPractice, onFreePractice, onOpenParent }: {
    profile: ChildProfile;
    totalStars: number;
    currentStreak: number;
    todayComplete: boolean;
    onStartPractice: () => void;
    onFreePractice: () => void;
    onOpenParent: () => void;
  } = $props();
</script>

<main class="child-home page">
  <header class="topbar">
    <a class="brand" href="#/" aria-label="Uyển Thanh Học Toán">Uyển Thanh Học Toán</a>
    <button class="quiet-button" type="button" onclick={onOpenParent}>Dành cho bố mẹ</button>
  </header>

  <section class="welcome-card" aria-labelledby="welcome-title">
    <div class="number-bond-mark" aria-hidden="true">
      <span>3</span><span>5</span><span>8</span>
    </div>
    <p class="eyebrow">Hôm nay mình cùng khám phá nhé</p>
    <h1 id="welcome-title">Chào {profile.displayName}!</h1>
    <p class="intro">Mỗi bài ngắn giúp con nhìn thấy những con số theo cách mới.</p>
  </section>

  <section class="reward-strip" aria-label="Phần thưởng">
    <div class="reward-card">
      <span class="reward-count">
        <strong>{totalStars}</strong>
        <svg class="reward-icon star-icon" viewBox="0 0 100 100" aria-hidden="true">
          <path d="m50 7 12 28 31 3-23 20 7 30-27-16-27 16 7-30L7 38l31-3z" fill="#fbbf24" stroke="#172554" stroke-linejoin="round" stroke-width="6" />
        </svg>
      </span>
      <span class="sr-only">{totalStars} ngôi sao</span>
    </div>
    <div class="reward-card">
      <span class="streak-count">
        <svg class="reward-icon fire-icon" viewBox="0 0 64 80" aria-hidden="true">
          <path d="M33 3c4 18-9 22-5 35 2 5 7 8 7 15 0 7-5 13-13 13-9 0-15-7-15-17 0-15 12-20 14-34 7 7 13 13 12 25 9-9 9-22 0-37Z" fill="#fb7185" stroke="#172554" stroke-linejoin="round" stroke-width="5" />
          <path d="M28 41c5 6 7 10 4 16-2 3-5 4-8 4-5 0-8-4-8-9 0-5 3-9 7-14 1 2 3 3 5 3Z" fill="#fbbf24" />
        </svg>
        <strong>{currentStreak}</strong>
        <span>ngày liên tiếp</span>
      </span>
    </div>
  </section>

  <section class="action-stack" aria-label="Chọn hoạt động">
    <button class="primary-action" type="button" onclick={onStartPractice}>
      <svg class="action-symbol" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 11v26M11 24h26" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="5" />
      </svg>
      <span><strong>{todayComplete ? 'Luyện thêm hôm nay' : 'Bài học hôm nay'}</strong><small>Khoảng 10 phút</small></span>
    </button>
    <button class="secondary-action" type="button" onclick={onFreePractice}>
      <svg class="action-symbol" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" stroke-width="4" />
      </svg>
      <span><strong>Luyện tập tự do</strong><small>Chọn điều con muốn luyện</small></span>
    </button>
  </section>
</main>
