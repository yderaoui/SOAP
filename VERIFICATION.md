# Verification

## Showcase and challenge update

The new homepage has five views: Overview, Coin, Story, Roadmap, and Challenge. The game remains at `/play`, with a Vercel rewrite and matching local-server route. The original game entry page is retained as `public/play.html`.

All **19** game and challenge unit tests pass. The five additional tests cover score/time boundaries, requiring all conditions in the same run, invalid results, bounded local history, and storage failures.

The **10-group showcase browser suite** passes across all five views at 320, 390, 768, and 1440 pixels. It checks navigation, character artwork switching, keyboard lore tabs, roadmap expansion, prize/rules disclosure, controlled local challenge progress, round-trip game navigation, local result sharing, and disabled storage. There are no browser errors or failed resources.

The **13-group arcade release browser suite** passes with the game at its new route. Win/loss scenarios use request-routed test fixtures, without changing the production simulation.

The normal-input challenge controller found a qualifying run with seed 1: **27,065 points**, boss defeated in approximately **39.97 seconds**, three lives remaining. Health, score, and enemy statistics were not modified. This verifies that the published target is reachable.

The proposed **US $1,000** prize is marked not live. No cash-entry or claim system is active. Funding and official competition terms are pending. Local history is personal practice data and does not establish eligibility for any payout.

Coin data is explicitly unannounced where no verified information was supplied. Character lore is clearly labeled as fiction and is not presented as a real person's biography.

## Simulation

All 14 Node test cases pass: frame-rate-independent movement and bounds; shield, invulnerability and death; bubble collisions and combos; Mega Rinse charge and threat clearing; directional dash and cooldown; pause/resume; pickups; boss arrival and victory; fresh-run reset; bounded long-session entity counts; stable results after fatal collisions or winning shots; Mega Rinse boss victory; combo and rainbow-power expiry.

The release review fixed combat continuing later in the frame after a win or loss. End-of-run statistics now remain consistent with the final simulation state. It also fixed movement keys held through countdown and Space activation of focused UI buttons.

JavaScript syntax checks pass for the simulation, renderer, UI/input module, and local server.

## Browser

Tested with Playwright and headless Microsoft Edge at 1440 × 1050 and a 390 × 844 touch viewport:

- Title screen, local fonts, transparent hero, help dialog, and start countdown render.
- Keyboard movement, directional dash, Mega Rinse, pause/resume, and sound toggle work.
- Mobile drag/tap movement and on-screen Mega Rinse work with reduced motion enabled.
- No browser JavaScript errors.
- A browser play-through reached both waves and the boss, ending at 45 seconds with 42 enemies cleaned. The boss had 2 HP remaining. The loss screen, real run statistics, PNG score-card download, and replay worked.
- The release browser suite additionally passed all 13 check groups against the packaged static build, with zero browser errors and zero failed same-origin resource requests.
- Those checks include keyboard-only start, held movement through countdown, Space activation of Resume and Sound, help/Escape, focus loss, fullscreen enter/exit, layout at 320/390/768/1440 pixels, and offline play.
- Browser victory and loss flows were exercised with controlled scenarios injected into the real simulation module through Playwright request routing. Both produced matching score/kill totals, valid 1080 × 1350 PNGs, persistent best scores, and clean restarts. Production files were not modified for the scenarios. These scenarios do not claim a human-input full-run victory.
- Touch input and reduced motion also passed with browser storage disabled.

Title, gameplay, boss entrance, pause, mobile, loss, and exported score-card images were inspected locally. The mobile hero framing was adjusted to keep the full character inside the screen.

## Asset

The built-in image tool generated `public/assets/hero.png`: 1254 × 1254 RGBA, alpha ranges from 0 to 255, 848,472 transparent pixels. The asset report passes. It has been inspected at title-screen and gameplay scale.

## Local server

http://localhost:3000 returns HTTP 200. The Node server is left running for play. The Windows launch script parses successfully.

The release suite report is saved in the ignored `qa-artifacts/release-report.json` file. Hosting source is pushed through the Sites source workflow. Deployment identity is tracked in `.openai/hosting.json`.
