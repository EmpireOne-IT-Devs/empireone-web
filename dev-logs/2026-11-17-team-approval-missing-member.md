### Phase 1: Approve a team proof when a member's participation record is missing

- **Timestamp:** 2026-11-17 00:28 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🧪 QA
- **Files Modified/Created:**
  - `app/Services/ChallengeTeamSubmissionService.php` — In `approve()`, skip a member whose participation record no longer exists, and skip a member with no daily log for the team proof, instead of failing with a 404.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — One test: a team proof whose member's participation row was deleted can still be approved, with points awarded to the leader.
- **Issues Encountered:** On production, `POST /api/engagement/reward-challenge-submissions/team-12/approve` returned 404 with `No query results for model [EngagementRewardChallengeParticipant] 165`. The team submission still has a member row pointing at a participation row that was deleted (the member left the challenge or the user account was removed; not determined). The members migration defines `cascadeOnDelete` on `participant_id`, so production is evidently not enforcing that foreign key. The same response contained file paths and a full stack trace, which shows production runs with `APP_DEBUG=true`.
- **Resolution:** `approve()` now uses `find()`/`first()` and continues past members with no participation record or daily log. Points, bonus, the survey rule and the leader-only award are unchanged; the member's stored name stays on the team record. `decline()` did not need a change because it never looks up member participation rows. The production data and configuration were not touched.
- **QA Checklist Result:** ✅ New test passed (1 test, 8 assertions): it deletes a member's participation row with foreign keys disabled, confirms the member row remains, then approves the team proof and checks status and points. ✅ No migration, route, response-shape, Redux or UI changes; reviewer policy on team approval unchanged; no guarded commands run. Only this one targeted test was run. Not verified on production: the fix must be deployed before submission 12 can be approved.
- **Next Steps:** Deploy, then approve team submission 12. Set `APP_DEBUG=false` in the production `.env`. Optional product decision: block leaving a challenge while the member's team proof is pending or approved, to stop new orphan member rows.
