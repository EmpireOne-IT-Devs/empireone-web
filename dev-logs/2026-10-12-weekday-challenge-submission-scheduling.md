### Phase 1: Add weekday-based challenge proof schedules

- **Timestamp:** 2026-10-12
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🖥️ Frontend, 🎨 UI/UX, 🧪 QA
- **Files Modified/Created:**
  - `database/migrations/2026_10_12_210000_add_weekday_schedules_to_reward_challenges.php` — Persist challenge weekdays and each participant's required-date snapshot.
  - `app/Models/Engagement/EngagementRewardChallenge.php` — Generate scheduled dates and preserve duration-based legacy behavior.
  - `app/Models/Engagement/EngagementRewardChallengeParticipant.php` — Read the participant date snapshot consistently.
  - `app/Services/ChallengeCompletionService.php` — Preserve approval thresholds, including a one-occurrence weekday schedule.
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Validate schedules, snapshot dates on join, expose date statuses, and validate selected proof dates.
  - `app/Http/Controllers/API/Engagement/EngagementChallengeSubmissionsController.php` — Label scheduled dates in review entries.
  - `resources/js/app/lib/challenge-schedule.js` — Share weekday labels and inclusive schedule-preview counting.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/sections/create-new-challenge.jsx` — Replace the ambiguous duration field with weekday controls and a proof-date preview.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/dashboard/sections/edit-challenge-section.jsx` — Edit weekday schedules while retaining existing legacy duration schedules.
  - `resources/js/app/services/engagement-service.js` — Include the selected scheduled date in proof uploads.
  - `resources/js/app/redux/engagement-thunk.js` — Pass the chosen date through the daily-proof request.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-submit-section.jsx` — Select eligible dates and show schedule status, deadline, loading, and no-date feedback.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-details-section.jsx` — Show scheduled weekdays and required proof-date count.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-rules-section.jsx` — Explain weekday-specific submission rules.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-next-steps-section.jsx` — Explain late scheduled-date submission through the deadline.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-progress-section.jsx` — Label progress as approved scheduled dates.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-card-section.jsx` — Show scheduled-date approval progress.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Cover date snapshots, late/unscheduled/future/duplicate/after-deadline submissions, one-date completion, migration reversibility, and survey regressions.
  - `tests/Frontend/challenge-survey.test.mjs` — Cover schedule counting, selected-date upload payload, employee schedule UI, and compile the admin forms.
- **Issues Encountered:** The participant pivot supplied `required_dates` as a JSON string when formatting join responses; an initial backend test exposed Carbon attempting to parse the entire JSON string as one date. A frontend compile attempt that imported the admin form at runtime also loaded a browser-only editor dependency in Node.
- **Resolution:** Added a strict JSON decoder on the participant pivot and used it for API formatting and validation. The frontend test now syntax-transforms admin forms without executing browser-only dependencies. Adjusted the one-date assertion to match the existing review response shape.
- **QA Checklist Result:** ✅ Plain JavaScript only. ✅ No new routes or API/resource surfaces; existing endpoint validation and Axios/Redux patterns were retained. ✅ Migration has a reversible `down()` and its rollback/reapply behavior is tested. ✅ Existing duration-based challenges and survey tests remain passing. ✅ Controls have associated labels, employee date selection uses a native keyboard-accessible select, and loading/error/empty feedback is present. ✅ Responsive classes cover small, medium, and large breakpoints. ✅ No destructive database or version-control commands were run. Code-level accessibility, focus, and responsive checks pass; interactive browser verification is still required.
- **Validation:** `php artisan test --filter=ChallengeSurveyCreationTest` — 29 passed, 358 assertions. `node --test tests\Frontend\challenge-survey.test.mjs` — 28 passed. PHP syntax checks passed for the changed controller, pivot model, migration, and backend test.
- **Issues/Limitations:** `vendor\bin\pint --test` reported formatting fixers in the touched controller and pivot model; no broad auto-format was applied to avoid unrelated file churn. The migration was not applied to any persistent database.
- **Next Steps:** Phase 2 tightened the weekday policy so join and proof submission are restricted to the selected exact days; the migration still must be applied before using weekday schedules.

### Phase 2: Enforce selected weekdays for joining and proof submission

- **Timestamp:** 2026-10-12
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🖥️ Frontend, 🎨 UI/UX, 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Reject off-weekday joins and proof submissions; report next join day; mark past unsubmitted dates missed; snapshot proof dates from the participant's allowed join day onward.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-card-section.jsx` — Disable weekday-scheduled join action off schedule and show the next eligible join date.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-details-section.jsx` — Explain weekday-only joining and disable joining until an eligible day.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-submit-section.jsx` — Limit employee guidance and available date selection to today's scheduled date; clearly state that missed dates cannot be submitted later.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-rules-section.jsx` — Explain exact-day proof policy.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-next-steps-section.jsx` — Explain selected-weekday join and exact-day proof requirements.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Cover off-weekday join rejection, exact-day proof acceptance, missed/future/unscheduled/duplicate/after-deadline rejection, and retained approval behavior.
  - `tests/Frontend/challenge-survey.test.mjs` — Verify off-day join messaging/disabled controls and exact-day proof instructions.
- **Issues Encountered:** Initial test results caught comparing the current time-of-day against date-only challenge boundaries, which could reject a valid selected weekday later in the day. A front-end assertion also expected a pluralized weekday label that the UI intentionally renders in singular form.
- **Resolution:** Compare normalized start-of-day dates on the backend and adjust the UI assertion to match the displayed weekday names.
- **QA Checklist Result:** ✅ Plain JavaScript only. ✅ Existing JSON endpoints continue to enforce authentication and eligibility; no new route, request type, or resource was introduced. ✅ Backend enforces selected weekdays independently from the UI. ✅ Existing duration-based daily challenge behavior and survey-gated completion remain covered by passing regressions. ✅ Join and submit controls communicate unavailability; labels, native controls, loading/error/waiting states are retained. ✅ Responsive breakpoints remain defined. ✅ No destructive database or Git commands were run. Keyboard/focus/responsive behavior is code-level checked and still requires browser verification.
- **Validation:** `php artisan test --filter=ChallengeSurveyCreationTest` — 30 passed, 366 assertions. `node --test tests\Frontend\challenge-survey.test.mjs` — 29 passed. PHP syntax checks and Node test syntax check passed.
- **Issues/Limitations:** The migration remains unapplied to persistent databases. Build and interactive browser checks were not run.
- **Next Steps:** Apply the existing reversible migration through the normal deployment process before using weekday schedules; then verify employee flows in a browser.

### Phase 3: Restore duration-based challenge proof requirements

- **Timestamp:** 2026-10-12 23:04 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🖥️ Frontend, 🧪 QA
- **Files Modified/Created:**
  - `app/Models/Engagement/EngagementRewardChallenge.php` — Remove weekday scheduling model support and restore duration-only multi-day detection.
  - `app/Models/Engagement/EngagementRewardChallengeParticipant.php` — Remove the weekday date snapshot field and helper.
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Restore unrestricted challenge joining and duration-based daily proof validation.
  - `app/Http/Controllers/API/Engagement/EngagementChallengeSubmissionsController.php` — Restore duration-day labels in admin review rows.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/sections/create-new-challenge.jsx` — Restore optional Duration (days) input.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/dashboard/sections/edit-challenge-section.jsx` — Restore duration editing, including clearing an optional duration.
  - `resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/` — Remove weekday-specific join, proof-date selection, and progress messaging.
  - `resources/js/app/services/engagement-service.js` and `resources/js/app/redux/engagement-thunk.js` — Remove selected-date proof parameters and preserve clearing duration in multipart updates.
  - `resources/js/app/lib/challenge-schedule.js` and `database/migrations/2026_10_12_210000_add_weekday_schedules_to_reward_challenges.php` — Remove the approved weekday helper and unapplied migration.
  - `tests/Unit/ChallengeSurveyCreationTest.php` and `tests/Frontend/challenge-survey.test.mjs` — Replace weekday-only tests with duration joining, daily proof, and UI checks while retaining survey regressions.
- **Issues Encountered:** The first new daily-proof regression used a start date outside the challenge's duration window, so the API correctly rejected the proof.
- **Resolution:** Adjusted the regression to use the current challenge window and verified successful daily proof submission and duplicate rejection.
- **QA Checklist Result:** ✅ JavaScript remains plain JavaScript. ✅ No new routes, endpoints, requests, policies, resources, migrations, Redux slices, or reusable components were introduced. ✅ Existing Axios/thunk architecture and survey completion behavior remain intact. ✅ Duration-based join, daily submissions, duplicate protection, and survey-gated completion are covered. ✅ Duration form controls have validation and error feedback. ✅ Responsive classes remain in use; keyboard, focus, and responsive behavior are code-level checked and require browser verification. ✅ No persistent database migrations or Git operations were run.
- **Validation:** `php artisan test --filter=ChallengeSurveyCreationTest` — 27 passed, 340 assertions. `node --test tests\Frontend\challenge-survey.test.mjs` — 28 passed. PHP syntax checks passed for both touched controllers, both models, and the backend test. Workspace search found no remaining challenge weekday-scheduling references.
- **Issues/Limitations:** Interactive browser verification was not run. The deleted weekday migration was confirmed in the prior task context to be unapplied to persistent databases.
- **Next Steps:** None for this rollback phase; verify the restored duration form and employee flow in a browser when convenient.
