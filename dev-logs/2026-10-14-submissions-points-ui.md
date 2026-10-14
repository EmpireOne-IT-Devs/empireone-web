### Phase 1: Match submission points styling to leaderboard

- **Timestamp:** 2026-10-14
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + 🖥️ Frontend + 🎨 UI/UX + 🧪 QA
- **Files Modified/Created:**
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/table-section.jsx` — Restyle points as a prominent green total with a smaller base-and-bonus breakdown; retain daily, pending-survey, pending-review, and team leader context.
  - `tests/Frontend/challenge-survey.test.mjs` — Verify the submission table’s points hierarchy and challenge-specific wording.
- **Issues Encountered:** None.
- **Resolution:** Added a presentation-only points cell. No backend, API, database, route, or Redux changes were made.
- **QA Checklist Result:** ✅ Focused frontend suite passes (38 tests); editor diagnostics report no errors. Browser-level responsive and accessibility behavior requires browser verification.
- **Next Steps:** None.
