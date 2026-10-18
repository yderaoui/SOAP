# The Clean Run — practice challenge

The proposed prize amount supplied by the project owner is **US $1,000**. Funding, eligibility, competition dates, verified score review, and payout terms have not been confirmed. No cash competition is live. Practice completion does not currently earn a cash award, and no cash entries or claims are accepted.

## Practice target

In one run:

1. Score at least **25,000 points**.
2. Defeat **The Algorithm**.
3. Finish within **90 seconds of active game time**. Paused time does not count.

The simulation's actual scoring and difficulty remain unchanged. All three conditions must be satisfied by the same completed run. Local results are recorded on this browser for practice only. They can be edited by the browser user and are not verification of a prize-winning result.

## Reachability check

`npm run test:playability` runs a seeded controller using the game's normal movement, dash, and Mega Rinse inputs. It found a qualifying run with seed 1: **27,065 points**, boss defeated in approximately **39.97 seconds**, with three lives remaining. The controller did not alter health, score, enemy statistics, or active game timing.

This demonstrates that the target is achievable under the shipped simulation. It does not imply a guarantee that a person will complete it, or that a funded competition exists.

## Before opening a real cash competition

Publish confirmed funding, rules, eligibility, dates, score review, and payout terms. A browser score or screenshot alone is not sufficient verification for a payout. This implementation has no cash-entry collection or payout capability.
