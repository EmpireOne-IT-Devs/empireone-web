### Phase 4: Prevent duplicate challenge survey responses

- **Timestamp:** 2026-10-13 20:35 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🖥️ Frontend + 🎨 UI/UX + 🧪 QA
- **Files Modified/Created:**
  - `database/migrations/2026_10_13_000002_add_unique_user_challenge_survey_response.php` — Added a reversible unique index to enforce one response per user and survey; migration stops with an explicit message if duplicate legacy rows exist.
  - `app/Models/Engagement/EngagementRewardChallengeParticipant.php` — Checks completion by user and challenge survey, not only by the participant-linked response.
  - `app/Services/ChallengeSurveyService.php` — Locks the challenge and returns the existing response on repeat submissions, awarding the survey only once.
  - `app/Models/User.php` — Added the challenge participation relationship needed to load the leader’s survey state on team review rows.
  - `app/Http/Resources/ChallengeSurveySubmissionResource.php` — Safely returns a nullable completion timestamp for idempotent submissions.
  - `app/Http/Resources/Engagement/EngagementRewardChallengeTeamSubmissionResource.php` — Exposes the leader’s survey completion alongside team members’ individual status.
  - `app/Http/Controllers/API/Engagement/EngagementChallengeSubmissionsController.php` and `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Eager-load leader participation status for team review and upload responses.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/table-section.jsx` — Shows leader survey status independently from direct reports’ team survey status.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Covers repeat submissions without duplicate response rows, shared leader status in individual/team submissions, and index rollback.
- **Issues Encountered:** Survey response completion was checked through one participant relationship, and the team review table displayed only direct reports’ completion states.
- **Resolution:** Survey completion is now keyed to the authenticated user and challenge survey. A unique database index provides a final duplicate guard, while the challenge-row lock serializes survey submissions. Team review shows the leader’s survey status separately from team-member completion.
- **QA Checklist Result:** ✅ Focused challenge suite passes (35 tests). ✅ PHP syntax checks pass for all changed backend files. ✅ Babel parses the modified JSX. ✅ Repeated submission returns the existing completion state without inserting another response. ✅ The unique-index migration has a tested down/up path. ✅ No migration, build, or destructive command was run. 🧪 Browser verification of the survey display remains outstanding.
- **Next Steps:** Apply the new additive migration through the normal deployment process. If existing duplicate `(survey, user)` response rows are present, resolve them before applying; the migration intentionally fails with a clear error instead of deleting survey data.
