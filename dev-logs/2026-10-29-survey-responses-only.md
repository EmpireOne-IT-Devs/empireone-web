### Phase 1: Show only survey respondents

- **Timestamp:** 2026-10-29 23:59 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🖥️ Frontend + 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Controllers/API/Engagement/EngagementPostEventSurveyController.php` — Paginate submitted responses rather than all employees/participants; retain the employee denominator and site filtering for participation statistics.
  - `resources/js/app/pages/accounts/_administrator/activities/post_event_survey/id/sections/responses-section.jsx` — Show a response-specific empty state.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Cover respondent-only results for event and challenge survey response trackers.
  - `dev-logs/2026-10-29-survey-responses-only.md` — Record this phase and its QA results.
- **Issues Encountered:** The default Feature test bootstrap redeclared the existing `route_page()` helper in `routes/web.php`; the neighboring survey regression suite avoids loading web routes and provides an established API-only test bootstrap.
- **Resolution:** Added and ran regression checks in that existing suite. No routing workaround or migration was added.
- **QA Checklist Result:**
  - ✅ Plain JavaScript/JSX only; PHP syntax checks pass.
  - ✅ PHP formatting passes with Pint.
  - ✅ Focused event and challenge response tracker coverage passes; full related suite passes (68 tests, 923 assertions).
  - ✅ JSX syntax validated with the installed esbuild transformer.
  - ✅ Nonrespondents are excluded from tracker rows and response pagination; employee/participant totals and participation denominators remain intact.
  - ✅ Existing API route, auth middleware, Redux/service flow, loading UI, table components, and page layout are unchanged.
  - ✅ No new routes, POST/PUT endpoints, policies, resources, migrations, slices, or services were needed.
  - ✅ The empty state reflects the response-only table.
  - 🧪 Browser keyboard, responsive, and focus behavior were not changed; browser verification was not run.
  - ✅ No guarded build, destructive, or git command was run.
- **Next Steps:** None.

### Phase 2: Show Event survey responses from non-employee respondents

- **Timestamp:** 2026-10-30 00:25 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Controllers/API/Engagement/EngagementPostEventSurveyController.php` — Event-survey response queries no longer restrict respondents to employee-role users; any authenticated user's submitted response appears. Site filtering is applied directly to the response query for event surveys, challenge surveys remain scoped to their participants, and the employee count still denominates the participation rate.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Added regression coverage for an Event survey answered by a non-employee (admin) account; Pint style fixes.
  - `dev-logs/2026-10-29-survey-responses-only.md` — Record this phase and its QA results.
- **Issues Encountered:** After Phase 1, an Event survey answered by a non-employee account showed sentiment for 1 response but 0 in the tracker, because the tracker query reused the employee-role user list as the respondent scope.
- **Resolution:** The respondent scope (`whereIn user_id`) now applies only to challenge surveys (participant list). Event surveys paginate all submitted responses, with the site filter applied via the respondent's location when set.
- **QA Checklist Result:**
  - ✅ PHP syntax checks pass; Pint formatting passes.
  - ✅ New non-employee respondent regression test passes; full related suite passes (69 tests, 931 assertions).
  - ✅ Employee totals and participation-rate denominator unchanged; challenge surveys still scoped to participants.
  - ✅ Existing API route, auth middleware, response shape, Redux/service flow, and UI are unchanged.
  - ✅ No new routes, endpoints, policies, resources, migrations, slices, or services were needed.
  - 🧪 Browser verification not run; no UI behavior changed in this phase.
  - ✅ No guarded build, destructive, or git command was run.
- **Next Steps:** None.
