### Phase 1: Route PC rows to System Units and fix "None" handling

- **Timestamp:** 2026-11-24 18:35 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🧪 QA
- **Files Modified/Created:**
  - `database/migrations/2026_11_24_000000_add_import_fields_to_asset_system_units.php` — Adds `serial_number` (unique), `condition`, `nature`, `purchase_date`, `account`, `imported_at`; makes `cpu`, `ram`, `storage`, `os`, `location` nullable. Reversible.
  - `app/Models/AssetInventory/AssetSystemUnit.php` — New fillable fields and casts; generated tags skip any existing tag.
  - `app/Http/Resources/AssetInventory/AssetSystemUnitResource.php` — Returns `serialNumber`, `condition`, `nature`, `purchaseDate`, `account`.
  - `app/Http/Controllers/API/AssetInventory/AssetSystemUnitController.php` — Search also covers serial number and account.
  - `app/Services/AssetImportClassifier.php` — PC and Desktop rows route to `system_units`; "None" and "N/A" count as empty for tag and serial; dates read from "Date Purchased" and converted from Excel serial numbers.
  - `app/Http/Controllers/API/AssetInventory/AssetImportController.php`, `app/Services/AssetImportAiAdvisor.php` — `system_units` registered as an import module.
  - `tests/Feature/AssetSystemUnitTest.php` — Routing, "None" handling, generated tags, dates, duplicate skip, both migrations' rollback.
- **Cause found:** The shared import sent Unit = PC to Devices. 240 of 428 rows were skipped because the sheet's "None" placeholders were treated as duplicate tags and serials. Purchase dates were dropped for every module because the import read `purchase_date` while the sheet column is "Date Purchased".
- **Deviation from the plan:** A "None" model is treated as empty only for System Units (name falls back to "PC"). Other modules keep their previous brand handling, so their rows are not newly rejected.
- **Database actions taken (local database, each approved by the user):**
  - Ran the one new migration (batch 36).
  - Permanently deleted the 188 Desktop rows imported into Devices at 18:15:17, after confirming nothing referenced them. A JSON copy was saved outside the repository first.
- **Issues Encountered:** A trial import of the 428 rows, intended to be rolled back, was not rolled back. `asset_system_units` uses the MyISAM engine, which ignores transactions, so the 428 rows are now saved in System Units. The local MySQL server defaults to MyISAM and 95 of 102 tables use it, including every `asset_*` table.
- **Resolution:** Left the 428 rows in place and reported it to the user; they match the sheet under the new rules (45 generated tags, 231 serials, 41 purchase dates; 369 Assigned, 34 Available, 25 Maintenance). Re-importing that sheet would add the 45 untagged rows again.
- **QA Checklist Result:** ✅ `AssetSystemUnitTest`: 7 passed. With the purchase and item request suites: 41 passed, 687 assertions. A dry run of the real sheet through the classifier accepted all 428 rows.
- **Known limits:**
  - Rows with neither tag nor serial cannot be recognised on a second import.
  - On MyISAM tables, "all rows of a batch or none" and row locking do not hold.
- **Next Steps:** Phase 2 — Import Excel button on the System Units page, a proper "System Units" label in the import preview, and table display for rows without CPU, RAM, storage, OS or location. Awaiting approval.

### Phase 2: Add System Units import UI

- **Timestamp:** 2026-11-24 18:40 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, 🖥️ Frontend, 🎨 UI/UX, 🧪 QA
- **Files Modified/Created:**
  - `resources/js/app/pages/accounts/_administrator/asset_inventory/system_unit/sections/header-section.jsx` — Added the shared Import Excel action beside Add System Unit.
  - `resources/js/app/pages/accounts/_administrator/asset_inventory/system_unit/page.jsx` — Connected the shared import analyze/commit thunks, refreshes the System Units list after import, and shows completion feedback.
  - `resources/js/app/pages/accounts/_administrator/asset_inventory/_components/smart-import-modal.jsx` — Added the System Units preview/result label and included it in the module description.
  - `resources/js/app/pages/accounts/_administrator/asset_inventory/system_unit/sections/table-section.jsx` — Displays serial number and account; renders em dashes for missing imported specifications and location.
- **Issues Encountered:** The first JSX-check invocation omitted esbuild's required output directory for multiple entry files; this was a validation-command issue, not a source error.
- **Resolution:** Corrected the in-memory esbuild invocation and compiled all four updated JSX components successfully.
- **QA Checklist Result:** ✅ Plain JavaScript; ✅ existing API/service/thunk architecture reused without backend or Redux changes; ✅ existing reusable Button, Table, Badge, Pagination, and SmartImportModal reused; ✅ import completion triggers a list refresh and user feedback; ✅ missing table values and empty specification alerts are handled; ✅ existing pagination, empty state, loading, and error states preserved; ✅ no destructive or guarded commands run. Keyboard, responsive layout, and modal focus behavior are code-level ✅ — requires browser verification. Backend-only checklist items were not changed by this phase.
- **Next Steps:** Verify the import flow in the browser when the app is running. The 428 rows already present in the local System Units table were left untouched; avoid importing the same sheet again until deciding whether to keep or clear them.
