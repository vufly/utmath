<script lang="ts">
  let { error = '', onSubmit, onHome }: {
    error?: string;
    onSubmit: (pin: string) => void;
    onHome: () => void;
  } = $props();

  let pin = $state('');

  function addDigit(digit: string): void {
    if (pin.length < 4) pin += digit;
  }

  function removeDigit(): void {
    pin = pin.slice(0, -1);
  }

  function submit(): void {
    if (pin.length === 4) onSubmit(pin);
  }
</script>

<main class="parent-gate page">
  <button class="back-link" type="button" onclick={onHome}>← Về trang chính</button>
  <section class="parent-card" aria-labelledby="parent-title">
    <p class="eyebrow">Khu vực người lớn</p>
    <h1 id="parent-title">Nhập mã PIN</h1>
    <p>Mã PIN giúp Uyển Thanh không vô tình thay đổi tiến độ học.</p>

    <div class="pin-dots" aria-label={`${pin.length} trong 4 số đã nhập`}>
      {#each Array(4) as _, index}
        <span class:filled={index < pin.length}></span>
      {/each}
    </div>

    {#if error}
      <p class="form-error" role="alert">{error}</p>
    {/if}

    <div class="pin-pad" aria-label="Bàn phím số">
      {#each ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as digit}
        <button type="button" onclick={() => addDigit(digit)}>{digit}</button>
      {/each}
      <button type="button" aria-label="Xóa số" onclick={removeDigit}>Xóa</button>
      <button type="button" onclick={() => addDigit('0')}>0</button>
      <button class="submit-pin" type="button" onclick={submit} disabled={pin.length !== 4}>Mở</button>
    </div>
  </section>
</main>
