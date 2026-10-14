### Phase 1: Keep Individual and Team Challenge submissions available

- **Timestamp:** 2026-10-14 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + 🖥️ Frontend + ⚙️ Backend + 🧪 QA
- **Files Modified/Created:**
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-section.jsx` — Keeps the eligible team submission selector available after individual proof submission or approval.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-submit-section.jsx` — Shows an individual-submitted state while preserving the team submission path.
  - `resources/js/app/redux/engagement-thunk.js` — Suppresses overlapping survey fetches for the same challenge while allowing reloads after completion or failure.
  - `tests/Frontend/challenge-survey.test.mjs` — Covers role gating, both submission orders, single in-flight survey loading, and question count.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Covers sequential individual/team proof submissions retaining one challenge survey and its seven questions.
  - `dev-logs/2026-10-14-challenge-submission-fix.md` — Records the phase and QA outcome.
- **Issues Encountered:** Individual proof success updates the challenge to `submitted`, causing the flow to render only its submitted state and unmount the submission selector. The survey API already returns the related questions once and the reducer replaces survey data rather than appending it; survey creation is challenge-scoped and idempotent. The pre-existing frontend test fixture omitted the app state needed by the employee eligibility hook.
- **Resolution:** Kept team submission available for eligible leaders in submitted and approved states, while making individual proof read-only there. Added an in-flight fetch guard and regression tests confirming sequential proof submission does not create extra survey records or questions. Added the missing app state to the frontend test fixture.
- **QA Checklist Result:** ✅ Focused frontend suite passed (32 tests). ✅ Challenge survey/submission backend suite passed (37 tests, 445 assertions). ✅ Diagnostics report no problems in changed files. ✅ Existing eligibility, points, validation, duplicate-submission, and survey behavior tests pass. 🧪 Responsive, focus, and interactive tab-switching behavior are code-level verified; browser verification remains outstanding. No migration or build command was run.
- **Next Steps:** Browser-verify the submission tabs and modal behavior with an eligible team leader.
