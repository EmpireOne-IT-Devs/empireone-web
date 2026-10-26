### Phase 1: Separate team and individual challenge proof

- **Timestamp:** 2026-10-26 23:06:02 +08:00
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend + 🖥️ Frontend + 🧪 QA + 🏗️ Tech Lead
- **Files Modified/Created:**
  - `app/Models/Engagement/EngagementRewardChallengeParticipant.php` - Distinguish individual proof from team-generated proof for leaders and members.
  - `app/Services/ChallengeCompletionService.php` - Gate individual challenge points on the participant's own approved proof and required survey.
  - `app/Services/ChallengeTeamSubmissionService.php` - Keep team submission state and awards out of member individual participation records; defer team awards until the leader submits the survey.
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` - Keep challenge-card status, individual proof submission, daily progress, and profile history separate; lock daily individual creation and support same-day team/individual logs.
  - `app/Http/Controllers/API/Engagement/EngagementChallengeSubmissionsController.php` - Exclude legacy team-only participant rows from individual review while retaining real individual submissions.
  - `app/Http/Resources/Engagement/EngagementRewardChallengeTeamSubmissionResource.php` - Return pending base and bonus points for team submissions.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/table-section.jsx` - Show team points as pending while the leader survey is incomplete.
  - `database/migrations/2026_10_26_220000_redefer_unearned_team_challenge_points.php` - Move previously awarded team points back to pending when the leader has not submitted the survey.
  - `database/migrations/2026_10_26_230000_separate_team_and_individual_daily_challenge_logs.php` - Allow one individual and one team daily proof per participant/date, preserving duplicate protection per proof lane.
  - `tests/Unit/ChallengeSurveyCreationTest.php` - Cover individual/team proof coexistence, legacy team-only state, survey-gated awards, migration rollback, and same-day daily proof lanes.
- **Issues Encountered:** The daily-log unique index originally prevented same-day individual proof when a team proof existed. Legacy team approvals could also be mistaken for individual proof on the leader's participant row.
- **Resolution:** Added separate generated-date uniqueness keys for team and individual daily logs; lock and recheck individual daily submission within a transaction; identify matching legacy team proof for both leaders and members; clear legacy approval/award fields when an individual proof is submitted.
- **QA Checklist Result:** ✅ `ChallengeSurveyCreationTest.php`: 67 tests, 913 assertions. ✅ `ChallengeManagementAccessTest.php`: 1 test, 6 assertions. ✅ PHP syntax checks and JSX syntax transforms pass. ✅ Team points remain pending until the leader survey is submitted; member points remain zero; team and individual proofs can coexist. ✅ SQLite migration up/down tested. ⚠️ Browser interaction/responsive checks were code-level only; MySQL migration execution was not available in this test environment.
- **Next Steps:** Deploy and run `php artisan migrate --force` so the target database receives pending-point columns and the separate daily proof indexes. Verify the challenge flow in a browser after deployment.
