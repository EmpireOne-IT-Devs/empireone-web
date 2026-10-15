### Phase 1: Remove duplicate questions from challenge surveys

- **Timestamp:** 2026-10-14 15:48 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🧪 QA
- **Files Modified/Created:**
  - `app/Services/ChallengeSurveyService.php` — Deduplicates normalized repeated questions for challenge-linked surveys and moves answer/option links to the retained question.
  - `app/Http/Controllers/API/Engagement/ChallengeSurveyController.php` — Repairs duplicate question rows before returning the authorized challenge survey.
  - `database/migrations/2026_10_14_000001_deduplicate_reward_challenge_survey_questions.php` — Removes existing duplicate rows from challenge surveys without affecting event surveys.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Covers seven-question API output, answer preservation, and migration scope.
  - `dev-logs/2026-10-14-challenge-survey-question-deduplication.md` — Records implementation and QA.
- **Issues Encountered:** Challenge survey responses use stored question rows directly. Existing repeated rows were not being fixed because challenge survey initialization only creates default questions when a survey does not yet exist.
- **Resolution:** Added a shared normalized-question deduplicator for challenge surveys, invoked it on authorized survey reads and during challenge survey initialization, and added a data migration to clean all existing challenge-linked surveys. Saved answers and question options are relinked to the retained row; event surveys are excluded.
- **QA Checklist Result:** ✅ Frontend survey suite passed (32 tests). ✅ Challenge survey/submission suite passed (39 tests, 453 assertions). ✅ PHP syntax checks passed for all changed PHP files. ✅ Diagnostics report no problems. ✅ Existing survey validation, response uniqueness, points, eligibility, and Post Event Survey regression tests pass. ✅ No routes, API response shape, Redux store, or UI primitives changed. 🧪 Browser verification remains outstanding.
- **Next Steps:** Apply migration `2026_10_14_000001_deduplicate_reward_challenge_survey_questions` during deployment. Opening a challenge survey also deduplicates its stored questions through the API.
