<script lang="ts">
  import { onMount } from 'svelte';
  import { hashForRoute, navigate, routeFromHash, type Route } from './app/navigation/routes';
  import { registerPwaUpdate } from './app/pwa/update';
  import { DEFAULT_PARENT_PIN, digestParentPin, verifyParentPin } from './app/state/parent-pin';
  import { defaultProfile } from './app/state/profile';
  import { moduleBCurriculum } from './core/curriculum/module-b';
  import { awardTodayReward, calculateSessionStars, localDateKey } from './core/gamification/rewards';
  import { createInitialSkillState, updateMastery } from './core/mastery/update';
  import type { AppSettings, Attempt, Hint, PartWholeExercise, RewardState, SessionRecord, SkillState } from './core/types/domain';
  import { generateNumberBondExercise, evaluateNumberBondAnswer, numberBondHint } from './exercises/number-bond/number-bond';
  import { migrateProgressExport } from './persistence/export-import/progress-export';
  import { IndexedDbProgressRepository } from './persistence/indexeddb/repository';
  import { defaultRewards, defaultSettings } from './persistence/repository';
  import Home from './ui/child/Home.svelte';
  import SessionSummary from './ui/child/SessionSummary.svelte';
  import NumberBondExercise from './ui/exercises/NumberBondExercise.svelte';
  import Backup from './ui/parent/Backup.svelte';
  import Dashboard from './ui/parent/Dashboard.svelte';
  import ParentPin from './ui/parent/ParentPin.svelte';
  import Modal from './ui/shared/Modal.svelte';

  let route: Route = 'home';
  let repository: IndexedDbProgressRepository | undefined;
  let profile = defaultProfile;
  let settings: AppSettings = defaultSettings;
  let rewards: RewardState = defaultRewards;
  let skillStates: SkillState[] = [];
  let sessions: SessionRecord[] = [];
  let pinDigest = '';
  let pinError = '';
  let persistenceError = '';
  let backupMessage = '';
  let showUpdate = false;
  let showChangePin = false;
  let newPin = '';
  let confirmPin = '';
  let changePinError = '';
  let applyUpdate: (() => void) | undefined;
  let activeSession: SessionRecord | undefined;
  let sessionTarget = 16;
  let sessionSeed = 0;
  let answered = 0;
  let independentCorrect = 0;
  let currentExercise: PartWholeExercise | undefined;
  let feedback = '';
  let hint: Hint | undefined;
  let hintLevel: 0 | 1 | 2 | 3 = 0;
  let incorrectAttempts = 0;
  let summaryStars: 0 | 1 | 2 | 3 = 0;

  function syncRoute(): void {
    route = routeFromHash(window.location.hash);
  }

  function isExerciseRoute(): boolean {
    return route === 'session';
  }

  function refreshExercise(): void {
    currentExercise = generateNumberBondExercise({ seed: sessionSeed + answered, whole: 5, difficulty: answered > 4 ? 2 : 1 });
    feedback = '';
    hint = undefined;
    hintLevel = 0;
    incorrectAttempts = 0;
  }

  async function loadProgress(): Promise<void> {
    if (!repository) return;
    const [savedProfile, savedSettings, savedRewards, savedStates, savedSessions] = await Promise.all([
      repository.getProfile(),
      repository.getSettings(),
      repository.getRewards(),
      repository.getSkillStates(),
      repository.listSessions(),
    ]);
    profile = { id: 'primary', displayName: savedProfile.displayName ?? 'Uyển Thanh' };
    settings = savedSettings;
    rewards = savedRewards;
    skillStates = savedStates;
    sessions = savedSessions;
  }

  async function initialize(): Promise<void> {
    try {
      repository = await IndexedDbProgressRepository.create({ factory: window.indexedDB });
      await loadProgress();
      const savedSettings = await repository.getSettings();
      pinDigest = savedSettings.parentPinHash ?? (await digestParentPin(DEFAULT_PARENT_PIN));
      if (!savedSettings.parentPinHash) {
        settings = { ...savedSettings, parentPinHash: pinDigest };
        await repository.saveSettings(settings);
      }
      applyUpdate = registerPwaUpdate(() => {
        if (!isExerciseRoute()) showUpdate = true;
      });
    } catch {
      persistenceError = 'Không thể mở dữ liệu học. Bố mẹ hãy kiểm tra bộ nhớ trình duyệt hoặc nhập bản sao lưu.';
    }
  }

  async function openParent(pin: string): Promise<void> {
    if (pinDigest && (await verifyParentPin(pin, pinDigest))) {
      pinError = '';
      navigate('parent-dashboard');
      return;
    }
    pinError = 'Mã PIN chưa đúng. Bố mẹ thử lại nhé.';
  }

  async function saveNewPin(): Promise<void> {
    if (newPin !== confirmPin) {
      changePinError = 'Hai mã PIN chưa giống nhau.';
      return;
    }
    try {
      pinDigest = await digestParentPin(newPin);
      settings = { ...settings, parentPinHash: pinDigest };
      await repository?.saveSettings(settings);
      newPin = '';
      confirmPin = '';
      changePinError = '';
      showChangePin = false;
    } catch {
      changePinError = 'Mã PIN cần gồm đúng 4 chữ số.';
    }
  }

  async function startSession(type: SessionRecord['type']): Promise<void> {
    if (!repository) return;
    const now = Date.now();
    sessionTarget = type === 'free-practice' ? 10 : 16;
    sessionSeed = now;
    answered = 0;
    independentCorrect = 0;
    activeSession = {
      id: `session-${now}`,
      type,
      startedAt: now,
      attemptIds: [],
      plannedSkillIds: ['B.bond.5'],
      practicedSkillIds: [],
      completed: false,
    };
    await repository.saveSession(activeSession);
    refreshExercise();
    navigate('session');
  }

  async function answerExercise(answer: number): Promise<void> {
    if (!repository || !activeSession || !currentExercise) return;
    const evaluation = evaluateNumberBondAnswer(currentExercise, answer);
    if (!evaluation.correct) {
      incorrectAttempts += 1;
      feedback = incorrectAttempts === 1 ? 'Chưa đúng. Con thử nhìn hai phần một lần nữa nhé.' : 'Mình dùng một gợi ý nhỏ nhé.';
      if (incorrectAttempts > 1) showHint();
      return;
    }

    const now = Date.now();
    const attempt: Attempt = {
      id: `${activeSession.id}-attempt-${answered + 1}`,
      sessionId: activeSession.id,
      exerciseId: currentExercise.id,
      module: 'B',
      skillIds: currentExercise.skillIds,
      startedAt: now,
      completedAt: now,
      responseMs: 0,
      correct: true,
      hintLevelUsed: hintLevel,
      hintCount: hintLevel,
      answer,
      representation: currentExercise.representation,
      source: activeSession.type === 'today' ? 'today' : activeSession.type === 'free-practice' ? 'free-practice' : 'parent-practice',
      generator: currentExercise.generator,
    };
    await repository.addAttempt(attempt);
    const nextStates = [...skillStates];
    for (const skillId of currentExercise.skillIds) {
      const index = nextStates.findIndex((state) => state.skillId === skillId);
      const previous = index === -1 ? createInitialSkillState(skillId) : nextStates[index]!;
      const next = updateMastery(previous, {
        correct: true,
        hintLevelUsed: hintLevel,
        representation: currentExercise.representation,
        completedAt: now,
      });
      if (index === -1) nextStates.push(next);
      else nextStates[index] = next;
    }
    skillStates = nextStates;
    await repository.putSkillStates(nextStates);
    if (hintLevel === 0) independentCorrect += 1;
    answered += 1;
    feedback = 'Đúng rồi! Con đã ghép được hai phần.';
    activeSession = {
      ...activeSession,
      attemptIds: [...activeSession.attemptIds, attempt.id],
      practicedSkillIds: [...new Set([...activeSession.practicedSkillIds, ...currentExercise.skillIds])],
    };
    await repository.saveSession(activeSession);

    if (answered >= sessionTarget) {
      await finishSession();
      return;
    }
    window.setTimeout(refreshExercise, 450);
  }

  function showHint(): void {
    if (!currentExercise) return;
    hintLevel = hintLevel < 3 ? ((hintLevel + 1) as 1 | 2 | 3) : 3;
    hint = numberBondHint(currentExercise, hintLevel);
  }

  async function finishSession(): Promise<void> {
    if (!repository || !activeSession) return;
    const completedAt = Date.now();
    summaryStars = 0;
    if (activeSession.type === 'today') {
      const input = {
        completed: true,
        completedAttempts: answered,
        independentCorrectAttempts: independentCorrect,
        localDate: localDateKey(completedAt),
      };
      summaryStars = calculateSessionStars(input);
      rewards = awardTodayReward(rewards, input);
      await repository.saveRewards(rewards);
    }
    const completedSession: SessionRecord = {
      ...activeSession,
      completed: true,
      completedAt,
      starsAwarded: summaryStars || undefined,
    };
    activeSession = completedSession;
    await repository.saveSession(completedSession);
    sessions = [completedSession, ...sessions.filter((session) => session.id !== completedSession.id)];
    navigate('summary');
  }

  async function toggleBondState(field: 'parentFocus' | 'parentPaused'): Promise<void> {
    if (!repository) return;
    const existing = skillStates.find((state) => state.skillId === 'B.bond.5') ?? createInitialSkillState('B.bond.5');
    const next = { ...existing, [field]: !existing[field] };
    skillStates = [...skillStates.filter((state) => state.skillId !== 'B.bond.5'), next];
    await repository.putSkillStates(skillStates);
  }

  async function exportProgress(): Promise<void> {
    if (!repository) return;
    const data = await repository.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `uyen-thanh-hoc-toan-${data.exportedAt}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    backupMessage = 'Đã xuất bản sao lưu.';
  }

  async function importProgress(text: string): Promise<void> {
    if (!repository) return;
    try {
      await repository.importAll(migrateProgressExport(JSON.parse(text)));
      await loadProgress();
      backupMessage = 'Đã nhập bản sao lưu.';
    } catch {
      backupMessage = 'Không thể nhập tệp này. Dữ liệu hiện tại không bị thay đổi.';
    }
  }

  onMount(() => {
    if (!window.location.hash) window.location.hash = hashForRoute('home');
    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    void initialize();
    return () => window.removeEventListener('hashchange', syncRoute);
  });
</script>

{#if route === 'home'}
  <Home {profile} totalStars={rewards.totalStars} currentStreak={rewards.currentStreak} todayComplete={rewards.lastPracticeDate === localDateKey(Date.now())} onStartPractice={() => startSession('today')} onFreePractice={() => startSession('free-practice')} onOpenParent={() => navigate('parent-pin')} />
{:else if route === 'session' && currentExercise}
  <NumberBondExercise exercise={currentExercise} {feedback} {hint} {answered} onAnswer={answerExercise} onHint={showHint} />
{:else if route === 'summary'}
  <SessionSummary stars={summaryStars} onHome={() => navigate('home')} />
{:else if route === 'parent-pin'}
  <ParentPin error={pinError} onSubmit={openParent} onHome={() => navigate('home')} />
{:else if route === 'parent-dashboard'}
  <Dashboard {rewards} {sessions} {skillStates} onHome={() => navigate('home')} onChangePin={() => (showChangePin = true)} onPracticeNow={() => startSession('parent-practice')} onBackup={() => navigate('backup')} onToggleFocus={() => toggleBondState('parentFocus')} onTogglePause={() => toggleBondState('parentPaused')} />
{:else if route === 'backup'}
  <Backup message={backupMessage} onExport={exportProgress} onImport={importProgress} onBack={() => navigate('parent-dashboard')} />
{:else}
  <main class="placeholder page"><h1>Đang chuẩn bị bài học</h1><button class="primary-action compact" type="button" onclick={() => navigate('home')}>Về trang chính</button></main>
{/if}

{#if persistenceError}
  <aside class="storage-warning" role="alert">{persistenceError}</aside>
{/if}

{#if showChangePin}
  <Modal title="Đổi mã PIN" onClose={() => (showChangePin = false)}>
    <p class="modal-intro">Chọn mã gồm 4 chữ số. Mã này chỉ giúp ngăn trẻ vô tình vào khu vực bố mẹ.</p>
    <label>Mã PIN mới<input bind:value={newPin} inputmode="numeric" maxlength="4" pattern="[0-9]{4}" type="password" /></label>
    <label>Nhập lại mã PIN<input bind:value={confirmPin} inputmode="numeric" maxlength="4" pattern="[0-9]{4}" type="password" /></label>
    {#if changePinError}<p class="form-error" role="alert">{changePinError}</p>{/if}
    <button class="primary-action compact" type="button" onclick={saveNewPin}>Lưu mã PIN</button>
  </Modal>
{/if}

{#if showUpdate}
  <aside class="update-notice" aria-live="polite"><p>Có phiên bản mới sẵn sàng.</p><button type="button" onclick={() => applyUpdate?.()}>Cập nhật</button><button type="button" onclick={() => (showUpdate = false)}>Để sau</button></aside>
{/if}
