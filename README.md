# SOAP — Escape the Timeline

A complete local browser arcade shooter inspired by the supplied @soapweb3 profile. The happy ape surfs a blue soap hoverboard through two waves of crypto-feed hazards, then fights The Algorithm.

The homepage is now the SOAP Universe showcase: Overview, Coin, Story, Roadmap, and The Clean Run challenge. The arcade lives at `/play`. Coin fields distinguish the concept from unannounced launch details; the character's origin story is explicitly fictional.

## Play

Double-click **START SOAP GAME.cmd**, or run `npm start` in this folder and open http://localhost:3000. Node.js is required. No installation, package downloads, API keys, or internet connection are needed.

- **Move:** WASD, arrow keys, mouse, or drag on touch.
- **Shoot:** automatic bubble blaster.
- **Dash:** Shift or the Dash button; brief protection, three-second cooldown.
- **Mega Rinse:** Space or the on-screen button; clears threats and damages the boss. Kills and survival refill it.
- **Pause:** P, Escape, or the pause button. The game pauses when the tab loses focus.
- **Power-ups:** bubble shield, nine-second rainbow triple shot, and an extra life.

Chain kills to raise your score multiplier. Survive 30 seconds to summon the boss, then defeat it to win. Your best score is stored locally. End screens export a PNG score card with actual run statistics.

The game uses native Canvas 2D and ES modules. Simulation is isolated in `public/game-core.js`; rendering and input/UI are separate modules. The renderer respects reduced-motion preferences. Sound effects are synthesized locally and off until enabled.

## Checks

`npm test` runs 19 game and challenge tests. `npm run check` checks the JavaScript syntax. `npm run build` copies the static game to `dist/` for hosting; `.openai/hosting.json` records its earlier Sites hosting project.

`npm run test:browser` runs the release browser suite. It needs Playwright and a browser: the test helper uses a separately installed `playwright` module, or the module directory in `SOAP_PLAYWRIGHT_PATH`. Set `SOAP_BROWSER_PATH` to a browser executable when needed. `SOAP_BASE_URL` selects the server to test (default: http://localhost:3000). Test reports and screenshots go into ignored `qa-artifacts/`.

The browser suite covers loading, keyboard/touch input, countdown, pause, help, sound, dash, Mega Rinse, fullscreen, responsive layouts, offline operation, victory/loss results, score-card PNGs, persistent best scores, restart, reduced motion, and unavailable browser storage. Deterministic browser scenarios exercise the real simulation's victory/loss transitions without modifying production files.

`npm run test:showcase` checks all five dashboard views, responsive navigation, artwork switching, lore tabs, roadmap accordions, challenge rules, game links, local history, and unavailable storage. `npm run test:playability` verifies a qualifying challenge run using normal simulation inputs.

## The Clean Run

Practice target: score **25,000+ points**, defeat the boss, and finish within **90 seconds of active play**, all in one run. The game records local run history and shows practice progress on the dashboard.

**US $1,000 is a proposed prize. No cash competition is live.** Funding, eligibility, dates, verified score review, and payout terms remain unconfirmed. No cash entries or claims are accepted, and browser-local results are not verified prize entries. See [CHALLENGE-RULES.md](CHALLENGE-RULES.md).

## GitHub and Vercel

GitHub repository: https://github.com/yderaoui/SOAP

Import the repository into Vercel with the repository root as the project root. `vercel.json` selects the static framework, runs `npm run build`, and publishes `dist/`. There are no environment variables or runtime services to configure. A linked Vercel project can also be deployed with `vercel --prod`.

The Windows launchers and local Node server are development conveniences. Vercel serves the built static game. Local project links and credentials in `.vercel/` and `.env*` are ignored by Git.

## Art direction and provenance

Retro-futuristic arcade: #0A0014, cyan #00FFFF, magenta #FF006E, local Orbitron and Space Mono fonts, CRT scanlines, neon glow, and a scrolling perspective grid.

`public/assets/pfp.png` is the supplied profile reference. `public/assets/hero.png` is a transparent character sprite generated with the built-in image tool specifically for this game. Its final prompt is in `ART-PROMPT.md`; asset specifications and provenance are in `public/assets/manifest.json`. Fonts are from the Google Fonts repository; their OFL licenses are included beside the font files.

This is an independent fan game. No affiliation, endorsement, token launch, or financial claims are made.
