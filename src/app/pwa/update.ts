import { registerSW } from "virtual:pwa-register";

export function registerPwaUpdate(onNeedRefresh: () => void): () => void {
  const updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh,
  });

  return () => updateServiceWorker(true);
}
