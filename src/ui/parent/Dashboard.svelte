<script lang="ts">
  import type { RewardState, SessionRecord, SkillState } from '../../core/types/domain';

  let { rewards, sessions, skillStates, onHome, onChangePin, onPracticeNow, onBackup, onToggleFocus, onTogglePause }: {
    rewards: RewardState;
    sessions: SessionRecord[];
    skillStates: SkillState[];
    onHome: () => void;
    onChangePin: () => void;
    onPracticeNow: () => void;
    onBackup: () => void;
    onToggleFocus: () => void;
    onTogglePause: () => void;
  } = $props();

  const bondState = $derived(skillStates.find((state) => state.skillId === 'B.bond.5'));
  const completedToday = $derived(sessions.some((session) => session.type === 'today' && session.completed));
</script>

<main class="parent-dashboard page">
  <header class="topbar">
    <button class="back-link" type="button" onclick={onHome}>← Trang chính</button>
    <button class="quiet-button" type="button" onclick={onBackup}>Sao lưu</button>
  </header>
  <section>
    <p class="eyebrow">Khu vực người lớn</p>
    <h1>Tiến độ của Uyển Thanh</h1>
    <p class="intro">Theo dõi sự tự tin và mức cần gợi ý, không chỉ số câu đúng.</p>
  </section>
  <section class="dashboard-grid">
    <article><strong>{completedToday ? 'Đã xong' : 'Chưa học'}</strong><span>Bài học hôm nay</span></article>
    <article><strong>{rewards.currentStreak}</strong><span>Ngày liên tiếp</span></article>
    <article><strong>{bondState?.stage ?? 'Chưa bắt đầu'}</strong><span>Liên kết số 5</span></article>
  </section>
  <section class="parent-actions">
    <button class="secondary-action compact" type="button" onclick={onPracticeNow}>Luyện liên kết số</button>
    <button class="secondary-action compact" type="button" onclick={onToggleFocus}>{bondState?.parentFocus ? 'Bỏ tập trung' : 'Tập trung số 5'}</button>
    <button class="secondary-action compact" type="button" onclick={onTogglePause}>{bondState?.parentPaused ? 'Bỏ tạm dừng' : 'Tạm dừng số 5'}</button>
    <button class="secondary-action compact" type="button" onclick={onChangePin}>Đổi mã PIN</button>
  </section>
</main>
