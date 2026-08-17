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
    <div><strong>{totalStars}</strong><span>ngôi sao</span></div>
    <div><strong>{currentStreak}</strong><span>ngày liên tiếp</span></div>
  </section>

  <section class="action-stack" aria-label="Chọn hoạt động">
    <button class="primary-action" type="button" onclick={onStartPractice}>
      <span class="action-symbol" aria-hidden="true">+</span>
      <span><strong>{todayComplete ? 'Luyện thêm hôm nay' : 'Bài học hôm nay'}</strong><small>Khoảng 10 phút</small></span>
    </button>
    <button class="secondary-action" type="button" onclick={onFreePractice}>
      <span class="action-symbol" aria-hidden="true">○</span>
      <span><strong>Luyện tập tự do</strong><small>Chọn điều con muốn luyện</small></span>
    </button>
  </section>
</main>
