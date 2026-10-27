### Phase 1: Finalize team challenge completion history

- **Timestamp:** 2026-10-26
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend + 🧪 QA + 🏗️ Tech Lead
- **Files Modified/Created:**
  - `app/Services/ChallengeTeamSubmissionService.php` — Finalize the leader's participation when team proof is approved and defer/release awards based on survey completion.
  - `app/Services/ChallengeCompletionService.php` — Prevent team leaders from receiving duplicate individual challenge points.
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Consolidate the leader's participant and team submission into one history row, and include `survey_required` in eager-loaded challenge data so history status reflects incomplete surveys.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Verify deferred awards, both proof/survey completion orderings, single-row team history, survey points, and approved leader status.
- **Issues Encountered:** The profile history query selected a limited set of challenge columns but omitted `survey_required`; the status formatter therefore showed an approved team row even when the leader had not completed the required survey.
- **Resolution:** Added `survey_required` to both eager-loaded challenge selections and added regression assertions for pending survey status and the consolidated approved history row.
- **QA Checklist Result:**
  - ✅ PHP syntax checks pass for all modified PHP files.
  - ✅ `ChallengeSurveyCreationTest.php`: 63 tests, 840 assertions passed.
  - ✅ Both completion orderings preserve the single team award and correctly finalize the leader.
  - ✅ Team profile history contains one row, combines survey points, and does not award individual challenge points to the team leader.
  - ✅ JavaScript purity, Redux, internal-link, and UI/accessibility checks: not applicable; no frontend files changed.
  - ✅ API route, request validation, resource formatting, policies, and migrations were not changed in this phase; no migration command was run.
- **Next Steps:** Deploy the code and apply the pending-points migration in any environment where the `pending_base_points` and `pending_bonus_points` columns are missing.
