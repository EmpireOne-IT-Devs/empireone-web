# 2026-10-05 — Attendance Correction Form: Pre-populate from Attendance Data

**Mode:** Agent
**Request:** Correction modal fields should show the attendance record's actual data (screenshots showed all "No Data" / empty placeholders); the record only needs to be corrected.

## Root Cause

`AttendanceLogs` already fetched every row's full attendance payload via
`get_attendance_logs_service` (clock in/out, break punches, late/undertime/
breaktime minutes, schedule), but only passed `date` into
`AttendanceAction` → `CorrectionSection`. The correction form was a static
mockup: uncontrolled inputs, no data binding, no submit handler. Additionally,
`CorrectionSection` consumed a `setIsOpen` prop that was never passed
(Cancel button would crash).

## Files Modified

| File | Change |
|---|---|
| `resources/js/app/services/attendance-service.js` | Added `create_attendance_correction_service(data)` → `POST /api/timekeeping/attendance_corrections` (route already existed inside `auth:sanctum`). |
| `.../attendance/sections/attendance-logs.jsx` | Pass full `log` row to `AttendanceAction` (no re-fetch — data already loaded, per Hand-Off Rule). |
| `.../attendance/component/attendance-action.jsx` | Accept `log` prop; forward to `CorrectionSection`; pass `setIsOpen={setIsModalOpen}` (fixes Cancel crash). |
| `.../attendance/sections/correction-section.jsx` | Controlled form pre-filled from the attendance log; inline 422 error mapping; submit handler with loading state and global alert. |

## Data Mapping

| Form field | Source on `log` |
|---|---|
| Time In / Time Out | `date` + `schedule_time_in` / `schedule_time_out` (Time Out +1 day for overnight shifts, same "(next day)" rule as the logs table) |
| Clock In / Clock Out | `clock_in_at` / `clock_out_at` |
| Break Start / Break End | `break_start_at` / `break_end_at` |
| Duration in Minutes | `breaktime_minutes` (computed server-side) |
| Late / Undertime / Breaktime Limit / Breaktime | `late_minutes` / `undertime_minutes` / `breaktime_limit` / `breaktime_minutes` |
| Regular Overtime | Left "No Data" — not provided by the API |
| Shift 2 + Manual Break Times 1–3 | Left blank — no source columns exist on the attendance record |

## Behavior

- Left column (current values): read-only/disabled display of the actual record; "No Data" text when the punch is absent (Absent / Day Off rows).
- Right column (Correction fields): pre-filled with the same values, editable — user adjusts only the wrong punches.
- Attendance Date picker is disabled — the modal is opened per log row, so the correction is locked to that row's date (prevents mismatched submissions).
- Submit: requires reason; posts all correction fields (`null` when blank); 422 errors render beneath the offending field; success closes the modal and fires a global success alert.

## Backend

No changes required. `AttendanceCorrectionController@store` already validates
every submitted field (`nullable|date`, `after_or_equal` for break pairs) and
creates a `pending` correction for the authenticated user.

## Documented Deviation

The existing attendance feature (`timekeeping-section.jsx`, `attendance-logs.jsx`)
calls services directly with local state instead of the Slice + Thunk pattern.
This phase followed the established feature-local pattern for consistency.
A Redux migration of the attendance domain would be a separate, larger phase.

## Verification

- `get_errors` on all 4 modified files: **no errors**.
- Manual check: open a log row's action modal → fields show the row's record; edit a correction field; submit with/without reason.

## Next-Step Suggestions

- Phase 2: fetch endorser/granter/decliner names via `GET attendance_corrections?date=` to populate the Approval Information section.
- Consider surfacing the correction's pending status on the log row.
