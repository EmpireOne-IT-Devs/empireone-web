### Phase 1: Refresh team survey availability on the challenge card

- **Timestamp:** 2026-10-26 19:05 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend + 🧪 QA + 🏗️ Tech Lead
- **Files Modified/Created:**
  - `resources/js/app/redux/engagement-thunk.js` — Wait for the employee challenge list refresh after successful team submission.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-card-section.jsx` — Show Complete Survey for eligible pending/approved single-proof team submissions; otherwise show the team submission status instead of Submit Proof.
  - `dev-logs/2026-10-26-team-survey-card-button.md` — Record this phase.
- **Issues Encountered:** The team-submission thunk initiated the challenge refresh but did not wait for updated team and survey eligibility before completing.
- **Resolution:** Await the refresh; use the API’s leader-only team submission status as an additional card readiness signal for single-proof team challenges. Daily challenges still require the explicit survey eligibility flag.
- **QA Checklist Result:** ✅ JSX/JavaScript parsing passed for modified files. ✅ Team survey regression suite passed: 59 tests, 763 assertions. ✅ No backend, database, route, or TypeScript changes in this phase. Code-level ✅ — requires browser verification.
- **Next Steps:** None.
