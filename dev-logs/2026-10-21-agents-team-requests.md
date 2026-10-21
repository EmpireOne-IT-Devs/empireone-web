# Agents Tab — Team Requests (Overtime, Schedule, Leave)

### Phase 1: Leader review of subordinate Overtime, Schedule Correction and Leave requests

- **Timestamp:** 2026-10-21
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend + 🖥️ Frontend + 🎨 Designer
- **Files Modified/Created:**
  - `database/migrations/2026_10_21_000001_add_review_columns_to_leave_requests_table.php` — approved/declined tracking and `supervisor_note` on leave requests (reversible `down()`)
  - `app/Models/Timekeeping/LeaveRequest.php` — new fillable/casts and approver/decliner relations
  - `app/Services/TeamRequestService.php` — subordinate lookup (`e_r_leaders` / `e_r_subordinates`), filtered queries, approve/decline transitions
  - `app/Policies/TeamRequestPolicy.php` — `viewAny` (is a leader) and `review` (owner is a subordinate); registered for the three request models in `AppServiceProvider`
  - `app/Http/Requests/Timekeeping/TeamRequestIndexRequest.php`, `TeamRequestDeclineRequest.php` — validation
  - `app/Http/Resources/Timekeeping/TeamRequestResource.php` — one normalised response shape for the three request types
  - `app/Http/Controllers/API/Timekeeping/TeamRequestController.php` — `index`, `approve`, `decline`
  - `routes/api.php` — `GET team_requests`, `POST team_requests/{type}/{id}/approve|decline`
  - `OvertimeRequestController.php`, `AttendanceCorrectionController.php` — leader-stage `endorse`/`decline` now require the owner's leader (admins keep access)
  - `resources/js/app/services/team-request-service.js`, `redux/team-request-thunk.js`, `redux/team-request-slice.js`, `store/store.js` — Redux Service/Thunk/Slice, slice registered as `team_requests`
  - `.../time_keeping/agents/sections/*` — filter bar (type, status, search, dates), table, review modal, batch approve
- **Issues Encountered:**
  - `php artisan migrate` would also run 13 unrelated pending migrations pulled via git.
  - antd `Select` used for the type/status dropdowns because the shared `select.jsx` only shows the selected option once a value is set.
  - The correction/overtime `endorse` endpoints had no ownership check.
- **Resolution:**
  - Ran only the new migration with `--path`.
  - Used antd `Select` (already used by the date pickers in this filter bar).
  - Added the policy check to the existing endpoints, with admin bypass so accounting/HR flows are not locked out.
  - Leave migration only adds the columns actually used (no `endorsed_*`, since leave has a single stage).
- **QA Checklist Result:** ✅ All pass at code level. Browser-dependent items (keyboard access, focus trap, responsive layout) are code-level ✅ — requires browser verification. Smoke test of the service and resource ran against the local DB with no errors (no leader data seeded locally to exercise rows).
- **Next Steps:** Browser verification with a leader that has subordinates and filed requests. Optional follow-up: final-stage (accounting/HR) screens for the `endorsed` status.
