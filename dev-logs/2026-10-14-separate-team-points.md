### Phase 1: Separate team points in employee profile history

- **Timestamp:** 2026-10-14 16:02 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + 🖥️ Frontend + ⚙️ Backend + 🧪 QA
- **Files Modified/Created:**
  - `resources/js/app/pages/accounts/_employee/rnr/my_profile/sections/points-summary-section.jsx` — Displays team-awarded, individual challenge, and survey points as distinct categories beside the associated challenge title.
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Exposes an explicit `team_points_awarded` value in profile history, set to zero for individual participation rows.
  - `tests/Frontend/challenge-survey.test.mjs` — Verifies team points render separately, the challenge title is present, and individual/survey points remain distinct.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Verifies profile history returns the team point category and challenge title.
  - `dev-logs/2026-10-14-separate-team-points.md` — Records this phase and QA.
- **Issues Encountered:** The profile history already included team submission rows and challenge titles, but team awards shared the generic challenge-points field and the frontend rendered a combined, unlabeled amount.
- **Resolution:** Added an explicit team-points field to the response and category-specific point labels in profile history without changing award calculations or total points.
- **QA Checklist Result:** ✅ JavaScript changes remain plain JavaScript. ✅ Focused frontend tests pass (34 tests). ✅ Challenge backend tests pass (39 tests, 456 assertions). ✅ PHP syntax checks pass. ✅ Diagnostics report no problems in changed files. ✅ Existing eligibility, survey reward, team point award, and totals behavior tests pass. ✅ No service/thunk changes, route changes, migration, or new UI primitives were needed. 🧪 Browser verification of the profile display on responsive widths remains outstanding.
- **Next Steps:** None.
