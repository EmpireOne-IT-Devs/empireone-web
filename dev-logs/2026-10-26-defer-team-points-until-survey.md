### Phase 1: Defer team points until required survey completion

- **Timestamp:** 2026-10-26 19:24 +08:00
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend + 🧪 QA + 🏗️ Tech Lead
- **Files Modified/Created:**
  - `database/migrations/2026_10_26_190000_defer_team_challenge_points_until_survey.php` — Add pending award columns, defer historical approved awards for leaders without submitted surveys, and restore pending values on rollback.
  - `app/Models/Engagement/EngagementRewardChallengeTeamSubmission.php` — Add pending award columns to model fillable attributes and casts.
  - `app/Services/ChallengeTeamSubmissionService.php` — Store approved team points as pending when a challenge requires a survey.
  - `app/Services/ChallengeSurveyService.php` — Release pending team awards once, after the submitting leader completes the required survey.
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Include unawarded team submissions in profile history so the UI displays “No points awarded yet”; totals remain based on actual awarded points.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Test award deferral, one-time release, legacy-data backfill and rollback, and daily team awards after completion and survey.
- **Issues Encountered:** Team approval immediately wrote base and bonus points to the awarded fields, independently of survey completion; profile history also omitted zero-award team submissions.
- **Resolution:** Added pending base/bonus award storage, kept awarded fields at zero until the leader submits the survey, release pending values transactionally, and migrate existing unpaid awards to the pending fields.
- **QA Checklist Result:** ✅ PHP syntax checks pass for all modified PHP files. ✅ Challenge survey regression suite passes: 62 tests, 819 assertions. ✅ Server-side leader-only survey checks and one-response enforcement retained. ✅ No frontend changes required; the existing points UI displays “No points awarded yet” for zero awards.
- **Next Steps:** None.
