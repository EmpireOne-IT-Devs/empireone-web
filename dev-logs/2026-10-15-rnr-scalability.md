# R&R Scalability Hardening

### Phase 1: Concurrency safety and fewer queries on the challenge list

- **Timestamp:** 2026-10-15 21:30
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php`
    - `myChallenges` batch-loads the user's participations, today's daily logs and completed challenge surveys in 3 queries total, instead of 3–4 queries per challenge.
    - `formatChallenge` accepts an optional `$preloaded` array. Without it, it behaves exactly as before.
    - `index` eager-loads `survey` and uses `withCount('participants')`.
    - `join` runs in a transaction with the challenge row locked and re-checks the participant cap inside it. A duplicate-key race returns a 422 instead of a 500.
    - `submitProof` re-checks the participant status under a row lock. A rejected duplicate deletes its just-uploaded S3 files.
  - `database/migrations/2026_10_16_000001_add_rnr_performance_indexes.php` — Reversible, idempotent indexes:
    - participants `(status, submitted_at)`
    - daily logs `(status, log_date)`
    - team submissions `(status, submitted_at)`
  - `tests/Unit/ChallengeSurveyCreationTest.php` — 5 new tests:
    - query count stays constant as challenges grow
    - preloaded payload matches
    - participant cap and double join
    - double submit leaves no orphaned files
    - index migration up/down
- **Issues Encountered:**
  - The planned model change (`hasCompletedSurvey` reusing a precomputed value) was unnecessary. The preloaded flag is resolved in the controller, so the model was left untouched.
  - A separate `user_id` index was dropped from the plan because InnoDB already indexes that foreign key.
- **Resolution:** Not applicable.
- **QA Checklist Result:** ✅ All pass.
  - 54 PHPUnit tests (ChallengeSurveyCreationTest) and 43 frontend tests pass.
  - No API response shape changes and no UI changes.
- **Next Steps:**
  - The user must run `php artisan migrate`.
  - Phase 2: server-side pagination and filtering for the admin submissions list. Awaiting approval.

### Phase 2: Server-side pagination for the admin submissions list

- **Timestamp:** 2026-10-16
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend + 🖥️ Frontend + 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Controllers/API/Engagement/EngagementChallengeSubmissionsController.php` — `index()` accepts `type` (individual|team), `page`, `per_page` (max 50). With `type` it returns one DB-paginated page plus `meta`, `links`, `counts {individual, team}` and `filter_options {challenges, locations}`. Individual pages use a UNION ALL of single-proof and daily-log keys ordered by `submitted_at`, then hydrate only that page. Query/relation builders extracted and shared with the unchanged legacy full-list path (used when `type` is omitted). Export and stats unchanged.
  - `resources/js/app/redux/engagement-slice.js` — stores `challengeSubmissionsMeta`, `challengeSubmissionCounts`, `challengeSubmissionFilterOptions`.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/table-section.jsx` — requests `type/page/per_page`; tabs, auto-switch, empty state and pager use server counts/meta; client-side slicing removed; approve/decline refetch keeps the current page.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/search-section.jsx` — challenge/location options come from server `filter_options` (all submissions, not just the visible page).
  - `tests/Unit/ChallengeSurveyCreationTest.php` — 2 new tests (single+daily merge ordering across pages, filters/team type/counts/per_page limit/legacy response).
  - `tests/Frontend/challenge-survey.test.mjs` — submissions table tests updated for server meta/counts.
- **Issues Encountered:** New test 500'd with "no such table: sites" — `User::account_employee()` always eager-loads `site`, absent from the in-memory test schema.
- **Resolution:** Test seed helper creates a minimal `sites` table (fixture gap only; production unaffected).
- **QA Checklist Result:** ✅ All pass — 56 PHPUnit (`--filter=ChallengeSurveyCreationTest`), 43 frontend tests, `php -l` clean.
- **Next Steps:** Phase 3 — lighter participants/leaderboard endpoint (short cache invalidated on approve/decline) and production checklist (PHP-FPM workers, timeouts, Nginx `client_max_body_size`). Awaiting your approval.

### Phase 3: Lighter challenge participants and leaderboard

- **Timestamp:** 2026-10-15 21:33 +08:00
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend + 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — The participants endpoint selects only the user, pivot, team submission, and member fields used in its existing response. Team participant IDs are derived from the already-loaded team members, removing a separate query. Leaderboards use the new short-lived cache.
  - `app/Services/ChallengeLeaderboardService.php` — Caches computed individual and team leaderboard arrays for 60 seconds and provides immediate and after-commit invalidation.
  - `app/Http/Controllers/API/Engagement/EngagementChallengeSubmissionsController.php` — Invalidates the challenge leaderboard cache after successful individual, daily, and team approvals or declines. Transactional changes invalidate after commit.
  - `app/Http/Controllers/API/Engagement/ChallengeSurveyController.php` — Invalidates after successful survey completion, which can finalize and award challenge points.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Added cache warm/clear assertions for join, individual and daily proof submissions, survey completion, and individual, team, and daily reviews.
- **Issues Encountered:** None blocking. Static diagnostics continue to flag existing Laravel facade calls (`auth()`, `Storage::url()`) and date casts in the challenge controllers; PHP lint and runtime tests pass, and no diagnostics were reported in the new leaderboard cache service or survey controller.
- **Resolution:** Kept participant and team-submission rows fresh on every request; only the computed leaderboard arrays are cached. Cleared the cache on every leaderboard-changing write (join, leave, proof submission, survey completion, approve, decline), using after-commit invalidation for transactional writes.
- **QA Checklist Result:** ✅ All applicable checks pass.
  - PHP syntax: all 5 changed PHP files pass `php -l`.
  - PHPUnit: 56 tests / 731 assertions pass with `php artisan test --filter=ChallengeSurveyCreationTest`.
  - Frontend regression: 43 tests pass with `node --test tests/Frontend/challenge-survey.test.mjs`.
  - Existing response shapes, routes, authorization, and frontend files are unchanged.
  - Cache invalidation regression assertions pass for all tested write paths.
  - Code-level ✅ — requires browser verification: no UI code changed; existing keyboard, responsive and modal behaviors were not exercised in a browser.
- **Production upload checklist (no server settings changed):**
  - Set `upload_max_filesize` to at least `1024M` and `post_max_size` to at least `1100M`; verify the values in the PHP-FPM/web SAPI, not only CLI PHP.
  - Set Nginx `client_max_body_size` to at least `1100M` for the upload routes and reload Nginx after configuration changes.
  - Set PHP and FastCGI request/read timeouts to exceed the expected maximum upload duration; validate uploads through the actual production proxy and application path.
  - Size PHP-FPM `pm.max_children` from measured per-worker memory use and the memory budget available to PHP; monitor queueing, worker saturation, memory, and upload latency rather than raising the limit blindly.
  - Restart/reload PHP-FPM after PHP configuration changes, and load-test representative concurrent uploads while monitoring PHP-FPM, Nginx, S3 and database metrics.
  - Apply the previously created reversible R&R index migration with `php artisan migrate` during the deployment window; this command was not run in this phase.
- **Next Steps:** No further R&R optimization phase is planned in this approved scope.

### Phase 3 follow-up: Use the employee profile department column

- **Timestamp:** 2026-10-15 21:59 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Removed selections and relation access to nonexistent `users.department_id`. The challenge participants response now obtains department names in one batched join through `account_employees.department_id`. The department-analytics export uses the same actual employee profile column for individual and team point aggregation.
  - `app/Services/ChallengeLeaderboardService.php` — Existing leaderboard formatting receives the batched department-name map; no duplicate lookup/helper was introduced.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Removed the inaccurate `users.department_id` test column; verifies participant and leaderboard department names and the department-analytics CSV through employee profiles.
- **Issues Encountered:** The initial optimization selected a `users.department_id` column that is absent from the production schema. The same assumption was also present in the department-analytics export.
- **Resolution:** Traced the Laravel migrations and `AccountEmployee` relationship; both paths now use `account_employees.department_id`. A single batched lookup is shared by participant response formatting and leaderboard formatting.
- **QA Checklist Result:** ✅ All applicable checks pass.
  - PHP syntax: all 3 changed PHP files pass `php -l`.
  - Focused leaderboard regression: 1 test / 25 assertions pass.
  - PHPUnit: 56 tests / 735 assertions pass with `php artisan test --filter=ChallengeSurveyCreationTest`.
  - Frontend regression: 43 tests pass with `node --test tests/Frontend/challenge-survey.test.mjs`.
  - Static diagnostics report no errors in the changed controller, service or test; existing Laravel facade warnings elsewhere in the test file remain unrelated.
  - No changes to routes, auth, validation, Redux, services, UI or reusable components.
- **Next Steps:** None.
