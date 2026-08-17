<script lang="ts">
  import { onMount } from 'svelte';
  import { hashForRoute, navigate, routeFromHash, type Route } from './app/navigation/routes';
  import { registerPwaUpdate } from './app/pwa/update';
  import { DEFAULT_PARENT_PIN, digestParentPin, verifyParentPin } from './app/state/parent-pin';
  import { defaultProfile } from './app/state/profile';
  import Home from './ui/child/Home.svelte';
  import PlaceholderScreen from './ui/child/PlaceholderScreen.svelte';
  import Dashboard from './ui/parent/Dashboard.svelte';
  import ParentPin from './ui/parent/ParentPin.svelte';
  import Modal from './ui/shared/Modal.svelte';

  let route: Route = 'home';
  let pinDigest = '';
  let pinError = '';
  let showUpdate = false;
  let showChangePin = false;
  let newPin = '';
  let confirmPin = '';
  let changePinError = '';
  let applyUpdate: (() => void) | undefined;

  function syncRoute(): void {
    route = routeFromHash(window.location.hash);
  }

  function isExerciseRoute(): boolean {
    return route === 'session';
  }

  async function openParent(pin: string): Promise<void> {
    if (await verifyParentPin(pin, pinDigest)) {
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
      newPin = '';
      confirmPin = '';
      changePinError = '';
      showChangePin = false;
    } catch {
      changePinError = 'Mã PIN cần gồm đúng 4 chữ số.';
    }
  }

  onMount(() => {
    if (!window.location.hash) window.location.hash = hashForRoute('home');
    syncRoute();
    window.addEventListener('hashchange', syncRoute);

    void digestParentPin(DEFAULT_PARENT_PIN).then((digest) => {
      pinDigest = digest;
      applyUpdate = registerPwaUpdate(() => {
        if (!isExerciseRoute()) showUpdate = true;
      });
    });

    return () => window.removeEventListener('hashchange', syncRoute);
  });
</script>

{#if route === 'home'}
  <Home
    profile={defaultProfile}
    onStartPractice={() => navigate('session')}
    onFreePractice={() => navigate('session')}
    onOpenParent={() => navigate('parent-pin')}
  />
{:else if route === 'parent-pin'}
  <ParentPin error={pinError} onSubmit={openParent} onHome={() => navigate('home')} />
{:else if route === 'parent-dashboard'}
  <Dashboard onHome={() => navigate('home')} onChangePin={() => (showChangePin = true)} onSettings={() => navigate('settings')} />
{:else if route === 'settings' || route === 'backup'}
  <PlaceholderScreen {route} onHome={() => navigate('parent-dashboard')} />
{:else}
  <PlaceholderScreen {route} onHome={() => navigate('home')} />
{/if}

{#if showChangePin}
  <Modal title="Đổi mã PIN" onClose={() => (showChangePin = false)}>
    <p class="modal-intro">Chọn mã gồm 4 chữ số. Mã này chỉ giúp ngăn trẻ vô tình vào khu vực bố mẹ.</p>
    <label>
      Mã PIN mới
      <input bind:value={newPin} inputmode="numeric" maxlength="4" pattern="[0-9]{4}" type="password" />
    </label>
    <label>
      Nhập lại mã PIN
      <input bind:value={confirmPin} inputmode="numeric" maxlength="4" pattern="[0-9]{4}" type="password" />
    </label>
    {#if changePinError}<p class="form-error" role="alert">{changePinError}</p>{/if}
    <button class="primary-action compact" type="button" onclick={saveNewPin}>Lưu mã PIN</button>
  </Modal>
{/if}

{#if showUpdate}
  <aside class="update-notice" aria-live="polite">
    <p>Có phiên bản mới sẵn sàng.</p>
    <button type="button" onclick={() => applyUpdate?.()}>Cập nhật</button>
    <button type="button" onclick={() => (showUpdate = false)}>Để sau</button>
  </aside>
{/if}
