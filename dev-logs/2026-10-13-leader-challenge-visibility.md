### Phase 1: Restore Team Challenge Visibility for Leaders

- **Timestamp:** 2026-10-13 13:22 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🖥️ Frontend, 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Resolve direct reports from both leader-subordinate records and employee `e_r_leader_id` mappings; show a Team challenge when at least one direct report is eligible.
  - `app/Services/ChallengeTeamSubmissionService.php` — Use the same combined direct-report source and submit only for direct reports with employee profiles that meet challenge eligibility.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-event-section.jsx` — Show an error and Retry action when challenge loading fails instead of displaying an empty state.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Cover Team visibility and team upload with employee leader mappings, a missing subordinate-table mapping, and mixed challenge eligibility.
- **Issues Encountered:** The initial focused tests exposed an Eloquent collection key-selection issue introduced while narrowing the eligible team members.
- **Resolution:** Filter profile models by whether their user IDs exist in the eligible employee collection; all focused tests then passed.
- **QA Checklist Result:** ✅ Focused backend tests: 33 passed, 399 assertions. ✅ Frontend challenge regression tests: 28 passed. ✅ PHP syntax checks passed for changed PHP files. ✅ Frontend diagnostics reported no errors. ✅ Leader identification and Team challenge visibility are tested. ✅ Server-side upload eligibility remains enforced and only eligible direct reports are included in a shared submission. ✅ Challenge-list load failures now provide an explicit Retry action rather than an empty-success appearance.
- **Next Steps:** If the leader still sees no Team challenges after deploying this change, check that the account has an `e_r_leaders` record linked to its `users.id` and that its reports have employee profiles assigned to the leader.
