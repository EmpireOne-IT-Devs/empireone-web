# Revert Team Submission Feature & Restore Universal Challenge Visibility

### Phase 1: Removed the team submission flow and restored the original individual join/submit flow for all challenges

- **Timestamp:** 2026-10-13 14:55 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🖥️ Frontend + 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Removed `ERLeader`/subordinate team lookups from `myChallenges()` (the recursive `subordinates()` eager-load chain was the root cause of the 128MB memory exhaustion in `JsonResponse`). Admins (role 1) now see every challenge; employees see `all_employees` challenges plus department/account matches. `formatChallenge()` now serializes `departments`/`accounts` as lightweight `{id, name}` arrays. Removed `submitTeamProof()` and all `type === 'Team'` blocks in `join()`, `leave()`, `submitProof()`, `submitDailyProof()` so Team-type challenges follow the standard individual flow. Dropped the `is_leader` response flag.
  - `app/Http/Controllers/API/Engagement/EngagementChallengeSubmissionsController.php` — Removed `teamIndex()`, the `team-` ID branches in `approve()`/`decline()`, team counts in `stats()`, and the `type = 'Individual'` / `team_submission_id` filters so all submissions appear in the single review list again.
  - `routes/api.php` — Removed `POST reward-challenges/{id}/submit-team` and `GET reward-challenge-team-submissions`.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/page.jsx` — Removed `<TeamChallengeUploadSection />`.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-card-section.jsx` — Removed the Team-specific action-button branch; all challenges use the standard Join → Submit → Review buttons.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-section.jsx` — Removed the "team leader submits the shared proof" branch; the normal join/submit wizard now renders for every challenge type.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/manager-view-section.jsx` — Removed `<TeamTableSection />` and the split heading from the submissions tab.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/page.jsx` — Same revert for the admin submissions page.
  - `resources/js/app/services/engagement-service.js` — Removed `get_reward_challenge_team_submissions_service` and `submit_reward_challenge_team_proof_service`.
  - `resources/js/app/redux/engagement-thunk.js` — Removed the two team thunks and their service imports.
  - `resources/js/app/redux/engagement-slice.js` — Removed team thunk imports/re-exports, extraReducer cases, and state fields (`isChallengeLeader`, `challengeTeamSubmissions*`, `challengeTeamSubmissionUploading`).
  - Deleted: `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/team-challenge-upload-section.jsx`, `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/team-table-section.jsx`.
- **Intentionally Kept (no destructive DB action without explicit instruction):**
  - Migration `2026_10_12_232600_create_engagement_reward_challenge_team_submissions_tables.php`, models `EngagementRewardChallengeTeamSubmission`/`...Member`, `ChallengeTeamSubmissionService`, `EngagementRewardChallengeTeamSubmissionPolicy`, `SubmitTeamChallengeRequest`, and `EngagementRewardChallengeTeamSubmissionResource` remain on disk but are fully unwired. If you want the tables gone, run `php artisan migrate:rollback --step=1` (or targeted rollback) yourself, then these files can be deleted in a follow-up phase.
- **Issues Encountered:** IDE PHP diagnostics flag `Storage::disk('s3')->url()` / `auth()->id()` as "undefined method" — pre-existing Intelephense false positives on Laravel magic methods, not regressions.
- **Resolution:** Verified with `php -l` (no syntax errors) and `php artisan route:list --path=engagement/reward-challenge` (24 routes resolve, team routes gone).
- **QA Checklist Result:** ✅ All pass (see chat report; browser-dependent items marked Code-level ✅).
- **Next Steps:** None pending — feature fully reverted. Optional Phase 2 (delete the now-dead backend team files + roll back the migration) available on request — awaiting your approval.
