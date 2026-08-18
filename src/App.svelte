<script lang="ts">
  import { onMount } from 'svelte';
  import { hashForRoute, navigate, routeFromHash, type Route } from './app/navigation/routes';
  import { registerPwaUpdate } from './app/pwa/update';
  import { DEFAULT_PARENT_PIN, digestParentPin, verifyParentPin } from './app/state/parent-pin';
  import { defaultProfile } from './app/state/profile';
  import { planAdaptiveToday } from './core/adaptive/today';
  import { awardTodayReward, calculateSessionStars, localDateKey } from './core/gamification/rewards';
  import { createInitialSkillState, updateMastery } from './core/mastery/update';
  import type { AppSettings, Attempt, Exercise, Hint, ModuleId, RewardState, SessionRecord, SkillState } from './core/types/domain';
  import { arithmeticHint, evaluateArithmeticAnswer, generateArithmeticExercise } from './exercises/arithmetic/arithmetic';
  import { evaluateMissingNumberAnswer, generateMissingNumberExercise, missingNumberHint } from './exercises/missing-number/missing-number';
  import { generateNumberBondExercise, evaluateNumberBondAnswer, numberBondHint } from './exercises/number-bond/number-bond';
  import { evaluateQuantityAnswer, generateQuantityExercise, quantityHint } from './exercises/quantity/quantity';
  import { evaluateStoryAnswer, generateStoryExercise, storyHint, type StoryStage } from './exercises/story/story';
  import { evaluateTriangleAnswer, generateTriangleExercise, triangleHint } from './exercises/triangle/triangle';
  import { migrateProgressExport } from './persistence/export-import/progress-export';
  import { IndexedDbProgressRepository } from './persistence/indexeddb/repository';
  import { defaultRewards, defaultSettings } from './persistence/repository';
  import Home from './ui/child/Home.svelte';
  import FreePractice from './ui/child/FreePractice.svelte';
  import SessionSummary from './ui/child/SessionSummary.svelte';
  import EquationPractice from './ui/exercises/EquationPractice.svelte';
  import NumberBondExercise from './ui/exercises/NumberBondExercise.svelte';
  import QuantityPractice from './ui/exercises/QuantityPractice.svelte';
  import StoryPractice from './ui/exercises/StoryPractice.svelte';
  import TrianglePractice from './ui/exercises/TrianglePractice.svelte';
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
  let showResetProgress = false;
  let newPin = '';
  let confirmPin = '';
  let changePinError = '';
  let applyUpdate: (() => void) | undefined;
  let activeSession: SessionRecord | undefined;
  let sessionTarget = 16;
  let sessionSeed = 0;
  let answered = 0;
  let independentCorrect = 0;
  let currentExercise: Exercise | undefined;
  let currentModule: ModuleId = 'B';
  let sessionModules: ModuleId[] = [];
  let recentAttempts: Attempt[] = [];
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
    const seed = sessionSeed + answered;
    const module = sessionModules[answered] ?? currentModule;
    currentModule = module;
    currentExercise =
      module === 'A'
        ? generateQuantityExercise({
            seed,
            flashDurationMs: skillStates.find((state) => state.skillId === 'A.quantity.flash')?.score && skillStates.find((state) => state.skillId === 'A.quantity.flash')!.score >= 0.7 ? 800 : 1300,
          })
        : module === 'B'
          ? generateNumberBondExercise({
              seed,
              difficulty: answered > 4 ? 2 : 1,
              stage: ['combine', 'split', 'diagram', 'make-five', 'make-ten', 'fact-family'][answered % 6] as 'combine' | 'split' | 'diagram' | 'make-five' | 'make-ten' | 'fact-family',
            })
          : module === 'C'
            ? generateArithmeticExercise({ seed })
            : module === 'D'
              ? generateMissingNumberExercise({ seed, form: ['add-result', 'add-second', 'add-first', 'sub-result', 'sub-removed', 'sub-start'][answered % 6] as 'add-result' | 'add-second' | 'add-first' | 'sub-result' | 'sub-removed' | 'sub-start' })
              : module === 'E'
                ? generateStoryExercise({ seed, stage: ['direction', 'before-after', 'parts-whole', 'operator', 'numbers', 'equation-choice', 'build', 'result'][answered % 8] as StoryStage })
                : generateTriangleExercise({
                    seed,
                    definitionId: ['three-separate', 'four-in-rectangle', 'rectangle-composites', 'rectangle-composites'][answered % 4],
                    stage: answered % 4 === 3 ? 'independent' : 'select',
                  });
    feedback = '';
    hint = undefined;
    hintLevel = 0;
    incorrectAttempts = 0;
  }

  async function loadProgress(): Promise<void> {
    if (!repository) return;
    const [savedProfile, savedSettings, savedRewards, savedStates, savedSessions, savedAttempts] = await Promise.all([
      repository.getProfile(),
      repository.getSettings(),
      repository.getRewards(),
      repository.getSkillStates(),
      repository.listSessions(),
      repository.listAttempts({ limit: 30 }),
    ]);
    profile = { id: 'primary', displayName: savedProfile.displayName ?? 'Uyển Thanh' };
    settings = savedSettings;
    rewards = savedRewards;
    skillStates = savedStates;
    sessions = savedSessions;
    recentAttempts = savedAttempts;
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

  async function startSession(type: SessionRecord['type'], module: ModuleId = 'B'): Promise<void> {
    if (!repository) return;
    const now = Date.now();
    sessionTarget = type === 'free-practice' ? 10 : 16;
    sessionSeed = now;
    currentModule = module;
    sessionModules =
      type === 'today'
        ? planAdaptiveToday({
            skillStates,
            recentAttempts,
            parentOverrides: {
              focusedSkillIds: skillStates.filter((state) => state.parentFocus).map((state) => state.skillId),
              pausedSkillIds: skillStates.filter((state) => state.parentPaused).map((state) => state.skillId),
              manuallyUnlockedSkillIds: skillStates.filter((state) => state.manuallyUnlocked).map((state) => state.skillId),
            },
            slotCount: 16,
          })
        : Array.from({ length: 10 }, () => module);
    answered = 0;
    independentCorrect = 0;
    activeSession = {
      id: `session-${now}`,
      type,
      startedAt: now,
      attemptIds: [],
      plannedSkillIds: sessionModules.map((plannedModule) => `${plannedModule}.start`),
      practicedSkillIds: [],
      completed: false,
    };
    await repository.saveSession(activeSession);
    refreshExercise();
    navigate('session');
  }

  async function answerExercise(answer: unknown): Promise<void> {
    if (!repository || !activeSession || !currentExercise) return;
    let evaluation;
    if (currentExercise.kind === 'part-whole') evaluation = evaluateNumberBondAnswer(currentExercise, answer);
    else if (currentExercise.kind === 'quantity') evaluation = evaluateQuantityAnswer(currentExercise, answer);
    else if (currentExercise.kind === 'arithmetic') evaluation = evaluateArithmeticAnswer(currentExercise, answer);
    else if (currentExercise.kind === 'missing-number') evaluation = evaluateMissingNumberAnswer(currentExercise, answer);
    else if (currentExercise.kind === 'story') evaluation = evaluateStoryAnswer(currentExercise, answer);
    else if (currentExercise.kind === 'triangle') evaluation = evaluateTriangleAnswer(currentExercise, answer);
    else throw new Error('Unsupported exercise kind.');
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
      module: currentExercise.module,
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
    feedback = 'Đúng rồi! Con đã tìm ra đáp án.';
    activeSession = {
      ...activeSession,
      attemptIds: [...activeSession.attemptIds, attempt.id],
      practicedSkillIds: [...new Set([...activeSession.practicedSkillIds, ...currentExercise.skillIds])],
    };
    await repository.saveSession(activeSession);

    if (answered >= sessionTarget) {
      if (currentExercise.kind === 'part-whole') return;
      await finishSession();
      return;
    }
    if (currentExercise.kind === 'part-whole') return;
    window.setTimeout(refreshExercise, 450);
  }

  async function continueNumberBond(): Promise<void> {
    if (
      currentExercise?.kind !== 'part-whole' ||
      !feedback.includes('Đúng')
    )
      return;
    if (answered >= sessionTarget) {
      await finishSession();
      return;
    }
    refreshExercise();
  }

  function showHint(): void {
    if (!currentExercise) return;
    hintLevel = hintLevel < 3 ? ((hintLevel + 1) as 1 | 2 | 3) : 3;
    if (currentExercise.kind === 'part-whole') hint = numberBondHint(currentExercise, hintLevel);
    else if (currentExercise.kind === 'quantity') hint = quantityHint(currentExercise, hintLevel);
    else if (currentExercise.kind === 'arithmetic') hint = arithmeticHint(currentExercise, hintLevel);
    else if (currentExercise.kind === 'missing-number') hint = missingNumberHint(currentExercise, hintLevel);
    else if (currentExercise.kind === 'story') hint = storyHint(currentExercise, hintLevel);
    else if (currentExercise.kind === 'triangle') hint = triangleHint(currentExercise, hintLevel);
    else throw new Error('Unsupported exercise kind.');
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

  async function resetProgress(): Promise<void> {
    if (!repository) return;
    await repository.resetProgress();
    activeSession = undefined;
    currentExercise = undefined;
    await loadProgress();
    showResetProgress = false;
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
  <Home {profile} totalStars={rewards.totalStars} currentStreak={rewards.currentStreak} todayComplete={rewards.lastPracticeDate === localDateKey(Date.now())} onStartPractice={() => startSession('today')} onFreePractice={() => navigate('free-practice')} onOpenParent={() => navigate('parent-pin')} />
{:else if route === 'free-practice'}
  <FreePractice onSelect={(module) => startSession('free-practice', module)} onHome={() => navigate('home')} />
{:else if route === 'session' && currentExercise}
  {#if currentExercise.kind === 'part-whole'}
    <NumberBondExercise exercise={currentExercise} {feedback} {hint} {answered} onAnswer={answerExercise} onHint={showHint} onNext={continueNumberBond} />
  {:else if currentExercise.kind === 'quantity'}
    <QuantityPractice exercise={currentExercise} {feedback} {hint} {answered} onAnswer={answerExercise} onHint={showHint} />
  {:else if currentExercise.kind === 'arithmetic' || currentExercise.kind === 'missing-number'}
    <EquationPractice exercise={currentExercise} {feedback} {hint} {answered} onAnswer={answerExercise} onHint={showHint} />
  {:else if currentExercise.kind === 'story'}
    <StoryPractice exercise={currentExercise} {feedback} {hint} {answered} onAnswer={answerExercise} onHint={showHint} />
  {:else if currentExercise.kind === 'triangle'}
    <TrianglePractice exercise={currentExercise} {feedback} {hint} {answered} onAnswer={answerExercise} onHint={showHint} />
  {/if}
{:else if route === 'summary'}
  <SessionSummary stars={summaryStars} onHome={() => navigate('home')} />
{:else if route === 'parent-pin'}
  <ParentPin error={pinError} onSubmit={openParent} onHome={() => navigate('home')} />
{:else if route === 'parent-dashboard'}
  <Dashboard {rewards} {sessions} {skillStates} onHome={() => navigate('home')} onChangePin={() => (showChangePin = true)} onPracticeNow={() => startSession('parent-practice')} onBackup={() => navigate('backup')} onToggleFocus={() => toggleBondState('parentFocus')} onTogglePause={() => toggleBondState('parentPaused')} onResetProgress={() => (showResetProgress = true)} />
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

{#if showResetProgress}
  <Modal title="Đặt lại tiến độ" onClose={() => (showResetProgress = false)}>
    <p class="modal-intro">Thao tác này xóa lịch sử bài học, mức thành thạo và ngôi sao. Tên của Uyển Thanh, mã PIN và cài đặt vẫn được giữ lại.</p>
    <button class="primary-action compact" type="button" onclick={resetProgress}>Xóa tiến độ học</button>
  </Modal>
{/if}

{#if showUpdate}
  <aside class="update-notice" aria-live="polite"><p>Có phiên bản mới sẵn sàng.</p><button type="button" onclick={() => applyUpdate?.()}>Cập nhật</button><button type="button" onclick={() => (showUpdate = false)}>Để sau</button></aside>
{/if}
