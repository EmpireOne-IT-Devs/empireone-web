### Phase 1: Configurable challenge proof media and upload limits

- **Timestamp:** 2026-10-15 18:58:35 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🖥️ Frontend, 🎨 Designer, 🧪 QA
- **Files Modified/Created:**
  - `database/migrations/2026_10_15_080000_add_proof_media_configuration_to_reward_challenges.php` — Persist proof type and media metadata with a reversible migration.
  - `public/.user.ini` — Set PHP upload limits for the configured 50 MB video maximum.
  - `app/Http/Requests/Engagement/SubmitChallengeProofRequest.php` — Validate individual and daily proof files and enforce challenge proof-type configuration.
  - `app/Http/Requests/Engagement/SubmitTeamChallengeRequest.php` — Validate team proof file types, counts, sizes, and configured video support.
  - `app/Http/Requests/Engagement/StoreEngagementRewardChallengeRequest.php` — Validate challenge creation fields, proof configuration, and duration.
  - `app/Http/Requests/Engagement/UpdateEngagementRewardChallengeRequest.php` — Validate challenge edits, proof configuration, and duration.
  - `app/Http/Requests/Engagement/Concerns/ValidatesChallengeDuration.php` — Share the date-bounded duration validation rule.
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Persist/return proof configuration, store individual/daily media, preserve legacy proof fields, and clean up failed S3 uploads.
  - `app/Services/ChallengeTeamSubmissionService.php` — Store team proof media in S3 and persist/clean up the media references.
  - `app/Http/Controllers/API/Engagement/EngagementChallengeSubmissionsController.php` — Include media URLs and proof metadata in submission review data.
  - `app/Http/Resources/Engagement/EngagementRewardChallengeTeamSubmissionResource.php` — Expose team proof media URLs with legacy fallback.
  - `app/Models/Engagement/EngagementRewardChallenge.php` — Add proof-type persistence and media to the participant pivot.
  - `app/Models/Engagement/EngagementRewardChallengeParticipant.php` — Cast and allow-list participant submission media.
  - `app/Models/Engagement/EngagementRewardChallengeDailyLog.php` — Cast and allow-list daily submission media.
  - `app/Models/Engagement/EngagementRewardChallengeTeamSubmission.php` — Cast and allow-list team submission media.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/sections/create-new-challenge.jsx` — Add the Photo Only / Photo or Video challenge setting.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/dashboard/sections/edit-challenge-section.jsx` — Load and persist proof type while editing.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-submit-section.jsx` — Support up to three image proofs or one configured video, previews, removal, and upload progress.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/team-submission-section.jsx` — Apply the same proof upload behavior to team submissions.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-submitted-section.jsx` — Display submitted image/video proof.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-approved-section.jsx` — Display approved image/video proof.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/proof-section.jsx` — Allow reviewers to view image/video proof.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/manage/sections/participants-table-section.jsx` — Expose participant proof media to reviewers.
  - `resources/js/app/services/engagement-service.js` — Send multipart image/video proof payloads.
  - `resources/js/app/redux/engagement-thunk.js` — Pass upload progress through the existing Redux flow.
  - `resources/js/app/redux/engagement-slice.js` — Store and reset proof upload progress.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Cover proof configuration, create/update validation, and individual, daily, and team media validation/storage.
  - `tests/Frontend/challenge-survey.test.mjs` — Cover multipart payloads, proof settings, and upload UI constraints.
- **Issues Encountered:** QA found that challenge creation and editing used inline controller validation. The existing submission controller also has pre-existing editor diagnostics related to magic Eloquent property access. Browser interaction and deployment proxy limits could not be verified in this workspace.
- **Resolution:** Moved create/edit validation into Form Requests while preserving the existing rules and response behavior, and shared the date-bounded duration rule. Kept legacy single-photo compatibility. PHP syntax checks and focused regression suites pass. Deployment must confirm PHP honors `public/.user.ini` and any reverse proxy allows at least 52 MB request bodies.
- **QA Checklist Result:** ✅ Feature-scoped tests, PHP syntax, request validation for changed challenge configuration/proof endpoints, upload constraints, Redux/service wiring, migration reversibility, and code-level responsive/accessibility checks passed. ⚠️ Existing project-level conventions remain: `web.php` contains redirect logic in addition to Inertia rendering; the existing challenge join endpoint has no Form Request; and the challenge API retains its established inline JSON envelope rather than converting every response to an Eloquent Resource. These were not broadly refactored to avoid unrelated API changes. Browser-only interaction checks remain pending.
- **Next Steps:** Verify file selection/playback and responsive behavior in a browser, then confirm PHP-FPM/CGI and upstream request-size configuration in the deployment environment.

### Phase 2: Move proof type choice into challenge form

- **Timestamp:** 2026-10-15 19:02:41 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, 🖥️ Frontend, 🎨 UI/UX, 🧪 QA
- **Files Modified/Created:**
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/sections/create-new-challenge.jsx` — Move the proof-type selector from the page beside the launch button into the actual challenge-creation modal form.
  - `tests/Frontend/challenge-survey.test.mjs` — Assert selector placement inside the form, Photo Only default, and submitted proof type.
- **Issues Encountered:** The selector had been rendered outside the modal/form, despite already being persisted correctly.
- **Resolution:** Relocated the selector within the form after the challenge description; retained both options, default, and current submission payload.
- **QA Checklist Result:** ✅ Feature behavior preserved; plain JavaScript; no backend, route, database, Redux, or authorization changes; existing selector remains keyboard-operable using native buttons with `aria-pressed`; focused tests passed (42/42); editor diagnostics clear. ⚠️ Visual/modal behavior in a live browser was not verified. Existing repository-level backend/API convention findings remain as recorded in Phase 1.
- **Next Steps:** No further code changes are planned for this correction; browser verification can be done in the running application.

### Phase 3: Raise maximum challenge video size to 1 GB

- **Timestamp:** 2026-10-15 19:13:54 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🖥️ Frontend, 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Requests/Engagement/SubmitChallengeProofRequest.php` — Set the individual/daily video maximum to 1 GB while retaining format checks.
  - `app/Http/Requests/Engagement/SubmitTeamChallengeRequest.php` — Set the team video maximum to 1 GB while retaining format checks.
  - `public/.user.ini` — Set PHP `upload_max_filesize` to 1024M and `post_max_size` to 1100M; extend input/execution timeouts for large uploads.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-submit-section.jsx` — Permit and display videos up to 1 GB in individual/daily submission UI.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/team-submission-section.jsx` — Permit and display videos up to 1 GB in team submission UI.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Assert the API validation limits and PHP upload configuration.
  - `tests/Frontend/challenge-survey.test.mjs` — Assert both upload forms expose the matching 1 GB client-side limit and guidance.
- **Issues Encountered:** `PostTooLargeException` can still occur if the deployed PHP handler or an upstream web server/proxy does not apply or allow these limits.
- **Resolution:** Aligned frontend, backend, and repository PHP configuration at 1 GB (1024 MiB); kept image limits and S3 storage flow unchanged. Smaller videos remain valid; 1 GB is the maximum, not a required upload size.
- **QA Checklist Result:** ✅ Focused backend tests passed (47 tests, 599 assertions); frontend tests passed (42 tests); PHP syntax and frontend editor diagnostics passed; no stale 50 MB video limit remains in the changed validators/forms/config. ⚠️ Deployment PHP/FPM and proxy behavior cannot be confirmed from repository tests; verify effective `upload_max_filesize` / `post_max_size` and any upstream body-size limit on the server. Code-level accessibility/responsiveness unchanged; browser verification still pending.
- **Next Steps:** Confirm the production PHP handler honors `.user.ini` and upstream request size is at least 1100M; restart/reload the PHP handler if needed.

### Phase 4: Direct-to-S3 proof uploads and stale survey question fix

- **Timestamp:** 2026-10-15 (Phase 4 completion)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🖥️ Frontend, 🧪 QA
- **Files Modified/Created:**
  - `app/Services/ChallengeProofUploadService.php` — New. Issues presigned S3 PUT URLs (60 min), tracks pending keys per user/challenge in cache, verifies object size in S3, releases keys after save, and discards abandoned uploads.
  - `app/Http/Requests/Engagement/CreateChallengeProofUploadRequest.php` — New. Validates upload-link requests (mode, 1–3 files, MIME, size, proof type, one video only, team leader authorization).
  - `app/Http/Requests/Engagement/DiscardChallengeProofUploadRequest.php` — New. Validates keys for discarding a failed upload batch.
  - `app/Http/Requests/Engagement/Concerns/ValidatesChallengeProofMedia.php` — New shared trait for individual/daily/team submit validation (upload keys or legacy files); discards owned uploads when validation fails.
  - `app/Http/Requests/Engagement/SubmitChallengeProofRequest.php`, `SubmitTeamChallengeRequest.php` — Use the shared trait; team leader authorization is unchanged.
  - `app/Http/Resources/Engagement/ChallengeProofUploadResource.php` — New. Shapes upload-link responses (key, type, url, headers).
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — New `createProofUploads` and `discardProofUploads` endpoints. Submit endpoints accept upload keys, clean up on rejection, and release keys on success.
  - `app/Services/ChallengeTeamSubmissionService.php` — Optional `$preparedMedia` parameter, so verified S3 uploads skip the server-side store.
  - `app/Services/ChallengeSurveyService.php` — Detaches stale/foreign questions (from a deleted Post Event survey whose ID was reused) before deduplication, on survey load and on creation.
  - `app/Http/Controllers/API/Engagement/EngagementPostEventSurveyController.php` — `destroy` now deletes options, answers, responses and questions with the survey.
  - `routes/api.php` — `POST` and `DELETE reward-challenges/{id}/proof-uploads` (throttle 30/min).
  - `resources/js/app/services/engagement-service.js` — Presign/discard services, XHR PUT to S3 with progress, and JSON key-based submit services.
  - `resources/js/app/redux/engagement-thunk.js` — Thunks now do presign → parallel S3 upload (combined progress) → submit keys; failed batches are discarded and a clear message is shown.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-submit-section.jsx`, `team-submission-section.jsx` — "Uploading X%" / "Saving submission…" stage text; double-submit guard on the individual form.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — 7 new tests: direct S3 flow, limits/proof type, ownership/missing/oversized cleanup, daily and team, non-leader block, stale questions, survey delete cascade. Also stabilized one timestamp-order-dependent assertion.
  - `tests/Frontend/challenge-survey.test.mjs` — Replaced the multipart service tests with S3 flow tests (keys only, three images/one video, failed-upload discard).
- **Issues Encountered:**
  1. `PostTooLargeException`: the app runs on `php artisan serve` (PHP built-in server), which ignores `public/.user.ini`, so the 8M `post_max_size` from the CLI php.ini applies.
  2. Duplicate survey questions: challenge surveys #4 and #5 inherited questions from a deleted Post Event survey. Its ID was reused, `destroy` only removed the survey row, and the `engagement_post_event_*` tables are MyISAM (no FK cascade).
- **Resolution:**
  1. Media now goes from the browser straight to S3 through presigned PUT URLs, so PHP body limits no longer apply. The backend still enforces type, count, proof type, size (checked in S3), ownership and single use.
  2. Stale questions are detached when the survey is loaded or created (self-healing), and survey deletion now removes child rows.
  - **Deviation from plan:** no FK or data-repair migration, because MyISAM cannot enforce foreign keys and the app-level fix self-heals existing data.
  - The legacy multipart submit is still accepted for compatibility.
- **QA Checklist Result:** ✅ Backend 54 tests / 682 assertions passed. ✅ Frontend 43 tests passed. ✅ `php -l` and editor diagnostics are clean. No guarded commands were run. Browser items are code-level ✅ and still require browser verification.
- **Next Steps:**
  - Configure S3 bucket CORS: allow `PUT` from the app origins and the headers `Content-Type` and `x-amz-acl`; expose `ETag`.
  - Verify a real video upload in the browser.

### Phase 5: Revert direct-to-S3 uploads to server-side S3 storage

- **Timestamp:** 2026-10-15
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🖥️ Frontend + 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Proofs are uploaded as multipart again and stored by the server on the `s3` disk (`storeProofMedia`); removed the upload-key/presign logic.
  - `app/Services/ChallengeTeamSubmissionService.php` — Removed the prepared-media parameter; the service stores the uploaded files directly again.
  - `app/Http/Requests/Engagement/Concerns/ValidatesChallengeProofMedia.php` — File-only rules: max 3 images (5 MB each) or 1 video (mp4/mov/webm, 1 GB); videos are rejected for Photo Only challenges.
  - `routes/api.php` — Removed the `proof-uploads` routes.
  - Deleted: `app/Services/ChallengeProofUploadService.php`, `CreateChallengeProofUploadRequest.php`, `DiscardChallengeProofUploadRequest.php`, `app/Http/Resources/Engagement/ChallengeProofUploadResource.php`.
  - `resources/js/app/services/engagement-service.js` — Multipart `FormData` (`photos[]` / `video`) with upload progress.
  - `resources/js/app/redux/engagement-thunk.js` — Removed the S3 PUT helpers; added a progress dispatcher and a friendly message for 413 errors and network failures.
  - `tests/Unit/ChallengeSurveyCreationTest.php`, `tests/Frontend/challenge-survey.test.mjs` — Removed the direct-upload tests; added multipart, progress and 413 tests.
  - Outside the repo: `C:\Users\PrimeOne\scoop\apps\php8.3\current\php.ini` — `upload_max_filesize=1024M`, `post_max_size=1100M`, `max_input_time=600` (backup: `php.ini.bak-2026-10-15`).
- **Issues Encountered:** The browser PUT to S3 failed because the bucket's CORS policy does not allow this origin, and the user asked for server-side file creation. `PostTooLargeException` happened because `php artisan serve` ignores `public/.user.ini`, so the CLI php.ini limits (8M/2M) applied.
- **Resolution:** Reverted to server-side storage on the existing S3 disk and raised the local PHP limits. The Phase 4 survey duplicate fix (stale questions on reused survey IDs) was kept.
- **QA Checklist Result:** ✅ All pass. 49 PHPUnit tests (ChallengeSurveyCreationTest) and 43 frontend tests pass. Browser items: code-level ✅, still need browser verification.
- **Next Steps:** Restart `php artisan serve`. In production, set PHP-FPM `upload_max_filesize`/`post_max_size` and Nginx `client_max_body_size` to at least 1100M.