### Phase 2: Challenge-specific winner rankings

- **Timestamp:** 2026-10-14
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🖥️ Frontend + 🎨 UI/UX + 🧪 QA
- **Files Modified/Created:**
  - `app/Services/ChallengeLeaderboardService.php` — Build separate, challenge-scoped individual and team rankings from approved challenge points, including bonuses and ties.
  - `app/Http/Resources/ChallengeLeaderboardEntryResource.php` — Serialize ranked leaderboard entries and winner metadata.
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Add ranked response datasets while preserving existing participant response keys.
  - `resources/js/app/redux/engagement-slice.js` — Prefer pre-ranked API entries for the Individual and Team leaderboard views with compatibility fallbacks.
  - `resources/js/app/redux/engagement-thunk.js` — Refresh the currently selected challenge ranking after approval changes its score.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/participant-table-section.jsx` — Rank by approved points, display award breakdowns and mark winners/co-winners; keep unapproved entries unranked.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/top-participant-section.jsx` — Display all winners for the selected submission type.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/manage/sections/participants-table-section.jsx` — Use the approval thunk’s challenge refresh rather than issuing a duplicate fetch.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Cover challenge-specific scoring, bonus inclusion, team aggregation, team-member exclusion, pending/declined exclusion, and co-winners.
  - `tests/Frontend/challenge-survey.test.mjs` — Cover separate rankings, co-winner display, and Redux consumption of ranked API data.
- **Issues Encountered:** The existing leaderboard ranked by completion speed and displayed a podium capped at three, which could not represent a points winner or all tied co-winners.
- **Resolution:** The backend now computes separate rankings from approved challenge-only awards, aggregates team awards by leader, leaves pending/rejected entries unranked, and marks all positive top-score ties as co-winners. The UI renders those winner entries rather than inferring winners from completion speed.
- **QA Checklist Result:** ✅ All applicable checks pass. 37 frontend tests pass; 41 backend tests pass (516 assertions); changed PHP files pass syntax checks; editor diagnostics report no errors. The existing API route remains Sanctum-authenticated, no route or migration was added, and existing response keys were retained. Browser-level accessibility and responsive behavior still require browser verification.
- **Next Steps:** None for the approved two-phase feature.
