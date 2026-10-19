### Phase 1: Idempotent migration guards

- **Timestamp:** 2026-10-19
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend + 🏗️ Tech Lead
- **Files Modified/Created:**
  - `database/migrations/2026_09_03_100000_add_submission_review_columns_to_reward_challenge_participants_table.php` — per-column guards (was skipped entirely if `submission_path` existed).
  - `database/migrations/2026_09_03_110000_add_points_awarded_to_reward_challenge_participants_table.php` — `after('review_note')` only if that column exists.
  - `database/migrations/2026_10_07_182500_create_engagement_e_stores_table.php` — `hasTable` guard.
  - `database/migrations/2026_10_09_185319_create_p_m_reaches_table.php` — `hasTable` guard.
  - `database/migrations/2026_10_09_000001_add_lead_attribution_to_job_applications_table.php` — per-column guards.
  - `database/migrations/2026_10_12_081200_link_engagement_surveys_to_reward_challenges.php` — per-column guards.
- **Issues Encountered:** Live DB schema was out of sync with the `migrations` table (tables/columns existing without migration records, `review_note` missing).
- **Resolution:** Guarded the unguarded migrations; `down()` methods unchanged. No migrations were run.
- **QA Checklist Result:** ✅ `php -l` passes on all edited files. Not run against the live DB.
- **Next Steps:** Run `php artisan migrate` on the server; send any new failure.
