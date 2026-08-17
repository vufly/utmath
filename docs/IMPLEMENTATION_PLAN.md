# Uyển Thanh Học Toán - Implementation Plan

## Confirmed Decisions

- Product title: `Uyển Thanh Học Toán`.
- Child-facing name: `Uyển Thanh`.
- Delivery: production-quality Module B vertical slice first, then Modules A-F MVP expansion.
- Visual style: minimal colorful; abstract counters and clear mathematical structure dominate decoration.
- Parent Mode default PIN: `2580`; it is a child-access barrier, not security, because static client builds are inspectable.
- Hosting: GitHub Pages at `https://vufly.github.io/utmath/`.
- Hard browser target: Safari 15 on iPadOS 15.8.x.

## Technical Baseline

- Svelte 5, TypeScript, Vite, and a static PWA. No SvelteKit, React, backend, global state library, component library, animation library, or charting library.
- npm lockfile and GitHub Actions for reproducible builds and Pages deployment.
- Vite configured for `/utmath/` GitHub Pages base path and explicit Safari 15 targets.
- `vite-plugin-pwa` caches application shell, compiled assets, fonts, SVGs, curriculum data, and triangle definitions. Runtime progress stays in IndexedDB.
- Hash router supports offline navigation and GitHub Pages without rewrite rules.
- Vitest tests pure domain logic, Svelte Testing Library tests key components, and Playwright covers browser flows. Physical iPad Safari 15 testing remains release criterion.

## Architecture

```text
src/
├── core/          Pure TypeScript: curriculum, skills, exercises, evaluation,
│                  hints, mastery, adaptive planning, sessions, rewards, randomness
├── exercises/     Module-specific generation and presentation adapters
├── persistence/   Repository interface, IndexedDB adapter, migrations, import/export
├── ui/            Child, parent, exercise, and shared Svelte components
├── app/           Hash navigation, application state, initialization, PWA updates
├── assets/        Self-hosted Nunito, SVG icons, and SVG object assets
└── main.ts
```

- `core/` has no Svelte, DOM, routing, storage, CSS, or device imports.
- UI coordinates routes and temporary interaction state only.
- Persistence is accessed only through `ProgressRepository`.
- Exercises are seeded and reproducible through generator ID, version, seed, and parameters.
- Vietnamese is used for child-facing content; internal identifiers remain English.

## Visual System

- Self-host Nunito weights 500, 600, and 700 with Vietnamese coverage.
- Warm off-white surfaces, navy text, blue primary actions, yellow rewards, green success, and restrained coral retry guidance.
- SVG/CSS instructional visuals, rounded geometry, large numerals, clear outlines, and low visual noise. No production emoji assets.
- Minimum 48px targets, answer controls in lower viewport, portrait-first responsive layout, visible keyboard focus, non-color feedback, and reduced-motion support.
- App icon and splash art use a geometric number-bond or ten-frame motif.

## Milestone 0 - Foundation

Implement project scaffold, type checking, formatting, testing, production build, base design tokens, responsive shell, shared controls, and hash navigation.

Create routes for Child Home, Session, Session Summary, Parent PIN, Parent Dashboard, Settings, and Import/Export. Initialize profile as `{ id: 'primary', displayName: 'Uyển Thanh' }`. Implement one-way PIN digest verification, default PIN `2580`, PIN change flow, and non-punitive invalid-entry feedback.

Configure manifest, icons, service worker, offline shell, and update prompt that never reloads during an active session. Add GitHub Actions to typecheck, test, build, and deploy Pages.

Exit gate: app installs from GitHub Pages, launches offline after first load, handles iPad portrait/landscape, and opens Parent Mode with `2580`.

## Milestone 1 - Domain Contracts

Implement discriminated `Exercise` union; `Attempt`, `SessionRecord`, `SkillDefinition`, `SkillState`, `RewardState`, `AppSettings`, `ParentOverrides`, export, evaluator, and hint contracts.

Add seeded PRNG, deterministic generator contract, curriculum registry, Module B skill registry, mastery update heuristic, and initial deterministic session planner. Mastery considers correctness, hints, representation diversity, repeat success, and delayed review without exposing a fake-precise score to users.

Exit gate: same seed reproduces same exercise; domain tests run without browser globals; invalid ranges, ambiguous answers, and inconsistent fact families are rejected.

## Milestone 2 - Persistence and Recovery

Build schema-versioned IndexedDB stores for profile, settings, skills, attempts, sessions, rewards, curriculum state, and metadata. Add migrations, startup initialization without overwriting progress, resilient attempt saving, and parent-facing recovery states.

Support JSON export and validated import with migration, preview, confirmation, and atomic replacement. Imports never silently merge.

Exit gate: reload persists progress, migration fixtures pass, invalid imports cannot overwrite data, and export-reset-import restores equivalent state.

## Milestone 3 - Module B Vertical Slice

Build reusable counter groups, split/combine interaction, part-whole diagram, number families 5-10, make-5, make-10, fact-family derivation, beginner multiple choice, and later direct numeric input.

Generate seeded exercises constrained to 0-10; track weak pairs separately. Evaluate answers with evidence-backed error codes. Hints progress from Vietnamese strategy prompt to visual part-whole/counters to guided interaction, never immediately reveal answer. Give one useful self-correction before scaffolding without trapping child on same item.

Exit gate: child completes 15-20 Module B interactions; attempts capture timing, hints, response, generator reference, representation, and skill evidence; interactions work by tap on Safari 15.

## Milestone 4 - Session, Rewards, Parent Mode

Child Home shows `Bài học hôm nay`, `Luyện tập tự do`, stars, and streak. Today's Practice has no countdown. Free Practice initially exposes Module B and records evidence without aggressive advancement.

Completion awards 1-3 stars for completion, persistence, and independence, not accuracy alone. Streaks use local calendar dates, one Today credit per day, with best streak tracked separately.

Parent Mode shows completion, streaks, stars, practice days, qualitative Module B status, skill evidence, weak pairs, recent sessions, and common errors. Add focus, pause, practice-now, unlock, reset-with-confirmation, settings, export, and import.

Exit gate: home -> session -> evaluation -> hint -> persistence -> mastery -> summary -> stars/streak -> dashboard -> export works without losing saved attempts.

## Milestone 5 - Hardening

Test generators, evaluators, hints, mastery, planner, stars, streaks, PIN verification, migrations, and import/export. Run invariant tests across seeds for bounds, intended answers, fact-family consistency, and deterministic replay. Test key Svelte interactions plus first launch, offline reload, Today's Practice, Parent Mode, Free Practice, import/export, and delayed PWA update end to end.

Test production build on physical iPad Air 2/iPadOS 15.8.x: install, cold/offline launch, IndexedDB, touch targets, rotation, fonts, service-worker updates, and long-session performance. Lazy-load Parent Mode and avoid full scene rerenders.

## Curriculum Expansion

1. Module A: dots, dice/domino patterns, five-frame, ten-frame, flash quantity, and representation matching; track 1-3, structured 4-5, and 6-10 five-anchor separately.
2. Module C: no-change, plus/minus 1 and 2, start-from-larger, doubles, near doubles, 5 anchor, make-10, and subtraction through bonds; retain strategy tags.
3. Module D: six unknown positions, fact-family rotation, and reused part-whole hints.
4. Module E: self-hosted SVG object library, generated combine/add-to/take-away/missing-part scenes, operator and number selection, equation builder, and model-versus-arithmetic remediation.
5. Module F: authored deterministic geometry, generous SVG hit regions, unique/duplicate selection tracking, size/composite classification, systematic hints, and independent worksheet count mode.

Each module requires full progression, hints, evidence, parent reporting, and tests, not a demo question.

## Adaptive System and Release

After exercise families are stable, replace deterministic sequencing with a planner targeting roughly 50% learning, 30% spaced review, 15% remediation, and 5% challenge. Select exercises just in time, revisit fact relationships across representations, prevent repeated-template false advancement, schedule remediation for later sessions, and respect parent overrides.

Final work expands dashboard/history/replay, reviews Vietnamese child language, replaces placeholders with SVG assets, verifies accessibility, profiles old-device performance, and passes full PWA, data, curriculum, and physical Safari 15 acceptance criteria. GitHub Issues track every milestone and release task.
