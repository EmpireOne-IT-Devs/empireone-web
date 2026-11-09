# Devices — Excel Import + Backend (Full Stack)

### Phase 1: `asset_devices` table, API, Redux, and reusable Excel importer wired to the Devices page

- **Timestamp:** 2026-11-10 01:20 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🖥️ Frontend + 🎨 Designer
- **Files Modified/Created:**

  **Backend**
  - `database/migrations/2026_11_10_000001_create_asset_devices_table.php` — **Created.** `asset_devices` (uuid unique, asset_tag unique, serial_number nullable unique, device_type/status/availability indexed, condition, nature, price, purchase_date, account, issued_to, received_by, location, site, notes, imported_at, timestamps, softDeletes). Reversible `down()`. **Migrated successfully.**
  - `app/Models/AssetInventory/AssetDevice.php` — **Created.** `$fillable`, casts, auto-uuid on create, `getRouteKeyName() = 'uuid'`, SoftDeletes.
  - `app/Policies/AssetDevicePolicy.php` — **Created.** All abilities → `ROLE_ADMIN`. Registered in `AppServiceProvider`.
  - `app/Http/Requests/AssetInventory/StoreAssetDeviceRequest.php` — **Created.** Single create/update rules (unique asset_tag/serial_number with ignore-on-update).
  - `app/Http/Requests/AssetInventory/ImportAssetDevicesRequest.php` — **Created.** `rows` array max 500, per-row rules.
  - `app/Http/Resources/AssetInventory/AssetDeviceResource.php` — **Created.** camelCase fields matching the UI.
  - `app/Services/AssetDeviceImportService.php` — **Created.** Duplicate detection by asset_tag/serial_number (incl. soft-deleted + in-file), chunked insert in a transaction, returns `{ imported, skipped[] }`.
  - `app/Http/Controllers/API/AssetInventory/AssetDeviceController.php` — **Created.** snake_case methods: `get_all` (paginated + search/status/device_type/availability/condition filters + stats), `create_device`, `get_device`, `update_device`, `delete_device`, `import_devices`.
  - `routes/api.php` — Added `asset_inventory/devices` routes (import + 5 REST) under `auth:sanctum`.
  - `app/Providers/AppServiceProvider.php` — Registered `Gate::policy(AssetDevice::class, AssetDevicePolicy::class)`.

  **Frontend**
  - `package.json` — Added `xlsx@0.18.5` (SheetJS). `npm install` run.
  - `resources/js/app/services/asset-device-service.js` — **Created.** Axios: list/create/update/delete/import.
  - `resources/js/app/redux/asset-device-thunk.js` — **Created.** `createAsyncThunk` wrappers; import chunks rows at 200 and accumulates the summary; 422 → `rejectWithValue({ message, errors })`.
  - `resources/js/app/redux/asset-device-slice.js` — **Created.** `items, meta, stats, loading, saving, importing, importResult, errors`.
  - `resources/js/app/store/store.js` — Registered `asset_devices`.
  - `.../asset_inventory/_lib/excel-utils.js` — **Created.** SheetJS helpers: `readWorkbook`, `normalizeHeader`, `autoMapHeader`, `scoreSheet`, `excelDateToISO`, `cleanCell` (strips LRM/NBSP).
  - `.../asset_inventory/_components/excel-import-modal.jsx` — **Created.** Reusable 4-step importer (Upload → Map columns → Preview → Import) using `_components/stepper.jsx` (horizontal), drag-and-drop, sheet auto-pick by header match, per-row badges (ready / duplicate in file / invalid / → other module), issues CSV download, chunked import with progress, summary panel.
  - `.../devices/sections/device-import-config.js` — **Created.** Field schema + synonyms (End Points sheet), value maps (Good→Working, Damage→Defective; PC→Desktop, Cellphone→Mobile; Brandnew/Second Hand; Dedicated/Shared), `routeDeviceRow` (Monitor→Monitors, UPS→Other Assets), `transformDeviceRow` (validation + normalization; Remarks `Stock`→Available else Assigned+issuedTo).
  - `.../devices/sections/header-section.jsx` — Added "Import Excel" button.
  - `.../devices/sections/stats-section.jsx` — Reads from API `stats` block.
  - `.../devices/sections/table-section.jsx` — Serial Number now shows asset tag below; added Condition column; Price shows purchase date; null-safe receivedBy/model.
  - `.../devices/sections/create-device-section.jsx` — Added asset tag, condition, nature, purchase date, account, issued to, location, site; maps Laravel 422 errors to inputs.
  - `.../devices/page.jsx` — Replaced mock state with Redux: debounced server-side fetch on filter/page change, create via thunk, importer wired, refetch after create/import.
  - `.../devices/sections/device-mock-data.js` — Left in place, now unused (per Rule 6).

- **Issues Encountered:**
  1. `app/Models/AssetInventory`, `app/Http/Requests/AssetInventory`, `app/Http/Resources/AssetInventory`, `app/Http/Controllers/API/AssetInventory` directories didn't exist — `create` failed on 4 files.
  2. `php artisan tinker` pre-loads an `AssetDevice` alias — `use` statement collided.
  3. `devices/page.jsx` import of the shared modal used `../../_components/` — from `devices/` it's `../_components/`.
- **Resolution:**
  1. Created the directories, re-wrote the files.
  2. Used fully-qualified class names in the tinker script.
  3. Fixed the import path; bundle resolves.
  - Verified: all 10 PHP files pass `php -l`; migration ran (`asset_devices` created); 6 API routes registered (`route:list`); 12 JS files pass esbuild parse; `devices/page.jsx` bundles with the `@` alias; **tinker smoke test: 2 imported, 1 duplicate skipped, uuid route key confirmed, cleanup done.**
- **QA Checklist Result:** ✅ All pass (table below). Browser-dependent items are code-level ✅.
- **Next Steps:** Phase 2 — Monitors table/API/Redux + wire Monitors page + importer routes Monitor rows. Phase 3 — Other Assets (UPS). Phase 4 — System Units / Peripherals from `Updated Inventory .xlsx` + Jabra headset batches. Awaiting your approval.

#### QA detail

| Area | Item | Result |
|---|---|---|
| JS Purity | Plain JavaScript, no TS syntax | ✅ |
| Backend | `web.php` only Inertia renders | ✅ unchanged |
| Backend | `api.php` only JSON routes | ✅ |
| Backend | Form Request for every POST/PUT | ✅ `StoreAssetDeviceRequest`, `ImportAssetDevicesRequest` |
| Backend | Policy protecting the resource | ✅ `AssetDevicePolicy` (all abilities → ROLE_ADMIN), registered |
| Backend | Eloquent Resource wrapping JSON | ✅ `AssetDeviceResource`; collection via `paginate()` with `meta`/`links` |
| Backend | Migration has `down()` | ✅ |
| Backend | Service class for non-trivial logic | ✅ `AssetDeviceImportService` |
| Frontend | API calls isolated in services | ✅ `asset-device-service.js` |
| Frontend | Thunks dispatch to slices | ✅ `asset-device-thunk.js` → `asset-device-slice.js` |
| Frontend | 422 → field errors | ✅ `create-device-section.jsx` maps `errors` to inputs |
| Frontend | Internal links use `<Link>` | ✅ N/A — no new navigation |
| Frontend | Persistent layout | ✅ `Layout` + `AssetInventory` |
| Frontend | No `_components/` file touches Redux/API | ✅ `excel-import-modal.jsx` lives in page-level `_components/`, receives `onImport` via props |
| Frontend | `_components/` verified before creating UI | ✅ reused modal, button, select, badge, stepper, progressbar |
| Naming | PascalCase components / kebab-case files / `page.jsx` | ✅ |
| Naming | Slice registered in store | ✅ `asset_devices` |
| Naming | Controller methods snake_case | ✅ `get_all`, `create_device`, `get_device`, `update_device`, `delete_device`, `import_devices` |
| UI/UX | Loading state for network ops | ✅ table `isloading` from Redux; import progress state |
| UI/UX | Destructive action confirmation | ✅ N/A — delete not exposed in UI yet |
| UI/UX | Inline validation beneath each field | ✅ |
| UI/UX | Empty state icon + heading + description + CTA | ✅ |
| UI/UX | Keyboard accessible | Code-level ✅ — requires browser verification |
| UI/UX | Responsive `sm` / `md` / `lg` | Code-level ✅ — requires browser verification |
| UI/UX | Focus trapped in modal | Code-level ✅ (`modal.jsx` FocusTrap) — requires browser verification |
| Security | Sanctum on API calls | ✅ routes under `auth:sanctum`; Axios session cookie |
| Security | No raw arrays from API | ✅ Resource |
| Security | No PKs in routes | ✅ `uuid` route key |
| Security | Guarded commands | ✅ `npm install xlsx` + `php artisan migrate` were pre-approved in the plan; no fresh/seed/build |

### Phase 1b: Fix `purchase_date` validation failure on import

- **Timestamp:** 2026-11-10 01:25 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend
- **Files Modified/Created:**
  - `.../asset_inventory/_lib/excel-utils.js` — `excelDateToISO` now accepts numeric strings (e.g. `"46137"`) in addition to numbers, since `cleanCell()` stringifies every cell before the transform runs.
- **Issues Encountered:**
  1. Import failed with `rows.N.purchase_date field must be a valid date` — the Excel serial date was stringified by `cleanCell`, so `excelDateToISO` took the string branch and `new Date("46137")` returned `Invalid Date` → `null` was never reached; the raw string was sent to the API.
- **Resolution:**
  1. `excelDateToISO` now coerces numeric strings and only treats values in the 20000–80000 range as Excel serials. Verified: `"46137"` → `2026-04-25`, `46137` → `2026-04-25`, `""`/`"N/A"` → `null`, `"2025-01-15"` → unchanged.
- **QA Checklist Result:** ✅ All pass — single-file fix, no API/Redux/route changes.
- **Next Steps:** Re-run the import — the 40 date errors should be gone. Awaiting your approval for Phase 2 (Monitors).

### Phase 1c: Fix `authorize()` undefined method on import

- **Timestamp:** 2026-11-10 01:30 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend
- **Files Modified/Created:**
  - `app/Http/Controllers/API/AssetInventory/AssetDeviceController.php` — Replaced `$this->authorize(...)` with `Gate::authorize(...)` (added `use Illuminate\Support\Facades\Gate;`).
- **Issues Encountered:**
  1. `Call to undefined method AssetDeviceController::authorize()` — the base `App\Http\Controllers\Controller` does not use the `AuthorizesRequests` trait, so `$this->authorize()` is unavailable.
- **Resolution:**
  1. Switched to `Gate::authorize(...)`, matching the existing codebase convention (Engagement, Timekeeping controllers all use `Gate::authorize`). Verified: `php -l` passes; import service smoke test still passes (1 imported, cleaned up).
- **QA Checklist Result:** ✅ All pass — single-file fix, no route/Redux changes.
- **Next Steps:** Re-run the import — authorization now resolves via the registered `AssetDevicePolicy`. Awaiting your approval for Phase 2 (Monitors).
