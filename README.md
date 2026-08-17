# Uyển Thanh Học Toán

Offline-first Vietnamese math practice PWA for Uyển Thanh, focused on building Grade 1 number sense for values 0-10. It runs entirely in browser, stores progress locally, and targets iPad Air 2 on iPadOS 15.8.x first.

Initial delivery is a production-quality Number Bonds vertical slice, followed by quantity recognition, mental math, missing numbers, picture equations, and triangle counting. The app is a static Svelte 5 PWA with no backend.

## Current Status

Foundation complete: responsive child home, Parent Mode PIN screen, hash navigation, PWA configuration, and GitHub Pages workflow. Default Parent Mode PIN is `2580`; it is a child-access barrier, not security.

## Local Setup

Requires Node.js 22 and npm.

```bash
npm install
npm run dev
```

Open the address shown by Vite, usually `http://localhost:5173`.

## Commands

```bash
npm run check        # Svelte and TypeScript diagnostics
npm test             # Unit tests
npm run format:check # Verify formatting
npm run build        # Production PWA build
npm run preview      # Serve production build locally
```

## Documentation

- [Product and technical specification](docs/PRODUCT_TECHNICAL_SPEC.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)

## Deployment

GitHub Actions verifies formatting, type checks, tests, and builds every pull request. Pushes to `master` deploy to GitHub Pages at `https://vufly.github.io/utmath/` after Pages is enabled for this repository.
