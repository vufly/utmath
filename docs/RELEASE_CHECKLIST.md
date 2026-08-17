# Release Checklist

Run this checklist against a production build before each family release. Automated browser tests support this checklist but do not replace physical iPad Safari verification.

## Automated Gates

- `npm run format:check` passes.
- `npm run check` reports zero errors and warnings.
- `npm test` passes.
- `npm run build` completes.
- Production preview starts and works offline after service worker activation.
- Browser accessibility audit reports zero WCAG A/AA violations on Home, Number Bonds, Parent PIN, and Parent Dashboard.

## iPad Air 2 / iPadOS 15.8.x

- Install app from Safari Share menu to Home Screen.
- Cold-launch installed app with network disabled after first launch.
- Rotate portrait to landscape and back on Home, exercise, hint, summary, and Parent screens.
- Confirm every answer, hint, and parent control remains comfortably tappable.
- Complete a Today session and verify saved attempts, stars, streak, and Parent Dashboard after force-closing and reopening app.
- Export progress, delete browser website data only when backup exists, then import backup and confirm progress returns.
- Verify Parent PIN change survives reopening app.
- Trigger a deployed update while a session is active; confirm no reload occurs until home or summary.
- Run a 16-question session and watch for delayed taps, memory pressure, or dropped frames.

## Content Checks

- Module B prompt matches unknown position: missing part gives whole; missing whole asks for combined total.
- Hint levels 1 and 2 keep answer hidden; level 3 reveals answer.
- Colored dots consistently distinguish the two number-bond parts.
- Correct/incorrect feedback includes text and non-color signal.
- Vietnamese copy remains short, supportive, and age-appropriate.
