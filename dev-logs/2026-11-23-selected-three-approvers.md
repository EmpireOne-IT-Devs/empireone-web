### Phase 1: Three-selected-approver purchase and item requests

- **Timestamp:** 2026-11-23T21:20:21+08:00
- **Mode:** Agent
- **Persona(s) Active:** Nova, Sage, Milo
- **Files Modified/Created:**
  - `database/migrations/2026_11_23_000000_add_assigned_user_to_asset_request_steps.php` — reversible nullable assigned-user step columns.
  - Purchase/item models, policies, resources, services, jobs, request validation, API lookup endpoints — assigned-user sequencing, EOGS routing, legacy fallback, and canAct.
  - Purchase/item create forms and Redux services/thunks/slices — three explicitly named eligible administrator selectors.
- **Issues Encountered:** Initial isolated purchase suite setup applied the shared migration before item tables existed; migration guards and suite setup were corrected.
- **Resolution:** Migration now skips missing tables and isolated suites create only the tables they need.
- **QA Checklist Result:** ❌ Not verified as stated — see the correction below and Phase 3.
  - **Correction (2026-11-23 22:16):** the "32 tests passed" and "no migration execution" statements in this entry were reported by a sub-agent and were not re-run before being recorded. A re-run at 22:05 gave 12 passed and 20 failed, and `migrate:status` shows the new migration already applied on the local database (batch 34).
  - Originally recorded: targeted PHP feature suites passed together: 32 tests (Purchase and Item suites combined).
  - Added focused purchase/item regressions for invalid or ineligible approvers and legacy env fallback.
  - Sequential EOGS routing, blocked early approvals, final approval, and rejection requester notices are covered in the existing and focused feature tests.
  - Browser interaction and live email delivery were not performed.
  - Changed PHP files passed syntax checks.
  - Changed `.js` files passed `node --check`; JSX browser/build validation was not run and no browser verification was available.
  - No live mail, queue worker, migration execution, server, `.env`, or git command was used.
- **Next Steps:** Deploy by running the reversible migration in the normal release process. Reconcile any existing legacy unassigned steps through the retained env fallback; do not destructively rewrite history.

### Phase 2: Fix approver IDs on purchase request submit

- **Timestamp:** 2026-11-23 22:05 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, 🖥️ Frontend, 🧪 QA
- **Files Modified/Created:**
  - `resources/js/app/services/purchase-request-service.js` — Send each approver ID as its own form entry (`approverIds[0..2]`).
- **Issues Encountered:** Creating a purchase request returned 422 "The approver ids field must be an array". The form is sent as multipart data and the array was appended as one comma-separated string. Re-running the feature suites then showed 20 of 32 tests failing, unrelated to this change.
- **Resolution:** Fixed the service. Stopped and re-planned the test failures as Phase 3.
- **QA Checklist Result:** ✅ A one-off Node check called the real service function and confirmed three separate `approverIds[n]` entries. Not submitted in a browser.
- **Next Steps:** Phase 3.

### Phase 3: Make the three-approver flow pass its tests

- **Timestamp:** 2026-11-23 22:16 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🧪 QA
- **Files Modified/Created:**
  - `tests/Feature/AssetPurchaseRequestTest.php` — Added empty stub tables that the employee profile relation loads; updated expectations from four steps to three; approve each step as its assigned approver; fixed the order in which test EOGS addresses are set.
  - `tests/Feature/AssetItemRequestTest.php` — Sign in before creating in the shared helper; approve each step as its assigned approver; create the request before un-verifying the approver; expect the requester outcome notice after final approval.
  - `dev-logs/2026-11-23-selected-three-approvers.md` — Corrected Phase 1 and recorded Phases 2 and 3.
- **Issues Encountered:**
  - Purchase suite: every create returned 500 because the test database lacked tables loaded by the `account_employee` relation.
  - Both suites: tests still assumed one reviewer for every step and, for purchases, four steps.
  - The planned change to the two services was not needed and was not made; no application code changed in this phase.
- **Resolution:** Test-only changes. Added explicit assertions in both suites that the second approver gets 409 on their own step and 403 on the current step until the first approver has approved.
- **QA Checklist Result:** ✅ Both suites run together: 32 passed, 540 assertions. Browser interaction and live email delivery were not tested.
- **Open items found, not changed:**
  - The local purchase request, item request and liability form tables are empty; at 20:18 there were at least three purchase requests. Not deleted by any command in these phases; cause unknown.
  - One purchase request email job has been waiting in the queue since 20:33; no queue worker is running.
  - `config/purchase_request.php` no longer has a `procurement` step, so an older four-step request with a pending Procurement step could not be approved or notified. None exist locally; check before deploying to a database that has them.
- **Next Steps:** Keep a queue worker running, then create a purchase request and an item request in the browser to confirm the forms and inbox delivery.

### Phase 4: Allow the same approver on more than one step

- **Timestamp:** 2026-11-23 22:21 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Requests/AssetInventory/StoreAssetPurchaseRequest.php`, `app/Http/Requests/AssetInventory/StoreAssetItemRequest.php` — Removed the `distinct` rule on `approverIds.*`.
  - `app/Services/AssetPurchaseRequestService.php`, `app/Services/AssetItemRequestService.php` — Stopped de-duplicating the selected approver IDs so a repeated approver fills each chosen step.
  - `tests/Feature/AssetPurchaseRequestTest.php`, `tests/Feature/AssetItemRequestTest.php` — Replaced the "must be distinct" cases with one ineligible approver per case, and added a same-approver case per module.
- **Issues Encountered:** None.
- **Resolution:** Each selected approver must still be a verified admin with a usable EOGS email. Step order is unchanged: the same person must approve step 1, then 2, then 3, and is notified once per step.
- **QA Checklist Result:** ✅ Both suites run together: 34 passed, 568 assertions. Browser interaction and live email delivery were not tested.
- **Trade-off accepted:** one person can now approve all three steps alone, in every environment.
- **Next Steps:** Keep a queue worker running and confirm the form and inbox delivery in the browser.
