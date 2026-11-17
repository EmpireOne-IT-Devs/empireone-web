### Phase 1: Download button for proof videos in the review modal

- **Timestamp:** 2026-11-16 23:58 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🖥️ Frontend, 🎨 UI/UX, 🧪 QA
- **Files Modified/Created:**
  - `routes/api.php` — New `GET engagement/reward-challenge-submissions/{id}/media/{index}/download` route.
  - `app/Http/Controllers/API/Engagement/EngagementChallengeSubmissionsController.php` — New `downloadMedia` action: reviewer check, video lookup for individual / `daily-` / `team-` ids, file name, 5-minute signed S3 link.
  - `app/Http/Resources/Engagement/ChallengeProofDownloadResource.php` — New. Exposes `url`, `filename`, `expires_at`.
  - `resources/js/app/services/engagement-service.js` — New `get_reward_challenge_submission_media_download_service`.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/submission-video-player.jsx` — Download button with preparing / failed states.
  - `resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/proof-section.jsx` — Pass the submission id and media index to the player.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — One test: file names for individual and team videos, 404 for a non-video or missing item, 403 for a non-reviewer.
  - `tests/Frontend/challenge-proof-video.test.mjs` — Assert the Download button renders.
- **Issues Encountered:** The videos are served from S3 on another origin, so a plain link with the `download` attribute would open the video instead of saving it. While tracing authorization, found that the submissions API routes (list, export, stats, and approve/decline for individual and daily proofs) are only behind `auth:sanctum`; the reviewer rule is enforced on the web pages (`challenge.management`) and on team submissions (policy), not on those API routes.
- **Resolution:** The button asks Laravel for a signed S3 link created at click time (valid 5 minutes) with a `Content-Disposition: attachment` override, so the file goes from S3 straight to the browser and Laravel never streams it. The file name is the submitter's name plus the submission date (`Name_YYYY-MM-DD.ext`; team proofs use `Team-<leader name>`), reduced to letters, digits and hyphens. The new route is restricted to reviewers through the existing `viewAny` rule of `EngagementRewardChallengeTeamSubmissionPolicy`. The button calls the service directly with local state, following the existing submissions Export button, so no thunk or slice was added. The pre-existing API authorization gap was not changed in this phase.
- **QA Checklist Result:** ✅ New backend test passed (1 test, 9 assertions); ✅ `challenge-proof-video.test.mjs` passed (4/4); ✅ a real signed link returned HTTP 206 with `Content-Disposition: attachment; filename="…"` and `Content-Type: video/mp4` on a one-byte range request. ✅ Plain JavaScript; API call isolated in the service file; response wrapped in a Resource; no migration; `web.php` untouched; no AWS keys exposed; no guarded commands run. Only these two targeted test runs were made; the rest of `ChallengeSurveyCreationTest` (including the survey-points tests added earlier today) has not been run. Clicking the button in a browser, keyboard access, and layout: code-level ✅ — requires browser verification.
- **Next Steps:** Click Download in the browser for an individual, a daily and a team proof and confirm the saved file name. Recommended follow-up phase: add the reviewer check to the submissions API routes.
