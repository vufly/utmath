import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

const isPagesBuild = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  base: isPagesBuild ? "/utmath/" : "/",
  plugins: [
    svelte(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "Uyển Thanh Học Toán",
        short_name: "Uyển Thanh Toán",
        description: "Luyện toán lớp 1 cùng Uyển Thanh",
        lang: "vi-VN",
        start_url: "./#/",
        display: "standalone",
        background_color: "#fffaf0",
        theme_color: "#2563eb",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "index.html",
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
      },
    }),
  ],
  build: {
    target: "safari15",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
  },
});
