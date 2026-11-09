# Item Request — List + Detail Module (UI only)

### Phase 1: Item Request list page (header / search / table / create modal) with shared approval helpers

- **Timestamp:** 2026-11-09 21:05 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + 🖥️ Frontend + 🎨 Designer
- **Files Modified/Created:**
  - `resources/js/app/pages/accounts/_administrator/asset_inventory/_lib/approval-helpers.js` — **Created.** Shared approval utilities: `APPROVAL_STATUSES`, `APPROVAL_STATUS_VARIANTS`, `getCurrentStepIndex`, `getApprovalSummary`, `buildApprovals(steps, count, opts)`, `emptyApprovals(steps)`, `toOptions`, `formatDate`.
  - `.../purchase_request/sections/purchase-request-helpers.js` — Now re-exports the generic helpers from `_lib` (removed local duplicates + unused `moment` import). Public API unchanged; verified via bundle.
  - `.../item_request/sections/item-request-helpers.js` — **Created.** `DEPARTMENTS`, `ASSET_CATEGORIES` (mirrors Assets tabs), `PRIORITIES`, `STATUSES` (Pending Approval / Approved / Issued / Rejected), badge variant maps, 3-step `APPROVAL_STEPS` (Department Head → Asset Custodian → Admin/GM).
  - `.../item_request/sections/item-request-mock-data.js` — **Created.** `IR-001…IR-006` covering every status and approval state (0/3, 1/3, 2/3, 3/3 approved, issued with tag, rejected at Asset Custodian). `findItemRequest(id)`.
  - `.../item_request/sections/header-section.jsx` — **Created.** Title, subtitle, "Create Item Request" button.
  - `.../item_request/sections/search-section.jsx` — **Created.** Search + Status / Priority / Category selects, result count.
  - `.../item_request/sections/table-section.jsx` — **Created.** Columns: Request ID + date, Item + category badge, Qty, Purpose (truncated w/ title tooltip), Needed By, Requester / Dept, Priority, Status (+ issued tag), View `<Link>` → `/item_request/{id}`. Empty state (icon + heading + copy + "Clear filters" CTA). Pagination.
  - `.../item_request/sections/create-item-req-section.jsx` — **Created.** `modal.jsx` + `react-hook-form`: item name, asset category, quantity, purpose (`textarea.jsx`, 10+ chars), needed-by date (`type=date`, not in past), priority, requester, department. Inline errors.
  - `.../item_request/page.jsx` — Replaced stub. Local state, filtering, 10-per-page pagination, create handler seeding an all-pending 3-step chain.
- **Issues Encountered:**
  1. `view` of the purchase-request helpers returned a stale snapshot after the edit, briefly suggesting duplicate exports; a fresh full read showed only `formatDate` was duplicated (local + re-export).
  2. `Out-File -Encoding utf8` on Windows PowerShell 5 adds a BOM.
  3. `npx esbuild --write=false` is not a CLI flag.
- **Resolution:**
  1. Removed the local `formatDate` and the orphaned `moment` import.
  2. Stripped the BOM byte-wise after writing.
  3. Bundled to `%TEMP%` instead and deleted the output. Verified: 9 files pass esbuild parse; `item_request/page.jsx`, `purchase_request/page.jsx`, and `purchase_request/id/page.jsx` all **bundle successfully** with the `@` alias — confirms the `_lib` refactor broke nothing.
- **QA Checklist Result:** ✅ All pass (table below). Browser-dependent items are code-level ✅.
- **Next Steps:** Phase 2 — `web.php` route `/item_request/{id}`, `item_request/id/page.jsx`, `id/sections/header-section.jsx`, `id/sections/item-req-flow-section.jsx`, `id/sections/stepper-section.jsx` reusing `_components/stepper.jsx` with the 3-step chain and mock Approve / Reject / Mark as Issued. Awaiting your approval.

#### QA detail

| Area | Item | Result |
|---|---|---|
| JS Purity | Plain JavaScript, no TS syntax | ✅ |
| Backend | `web.php` / `api.php` / Requests / Policies / Resources / migrations | ✅ N/A — no backend changes this phase (existing `/item_request` Inertia route reused) |
| Frontend | Services / thunks / slices | ✅ N/A — mock data, no API calls |
| Frontend | 422 → field errors | ✅ N/A network-wise; RHF inline errors beneath every field |
| Frontend | Internal links use `<Link>` | ✅ table View button |
| Frontend | Persistent layout on authenticated page | ✅ `Layout` + `AssetInventory` |
| Frontend | No `_components/` file touches Redux/API | ✅ none modified |
| Frontend | `_components/` verified before creating UI | ✅ reused table, badge, button, pagination, modal, input, select, textarea |
| Naming | PascalCase components / kebab-case files / `page.jsx` | ✅ |
| Naming | Slice registered in store | ✅ N/A |
| UI/UX | Loading state for network ops | ✅ table `isloading` wired (idle with mock) |
| UI/UX | Destructive action confirmation | ✅ N/A — no destructive actions on the list page |
| UI/UX | Inline validation beneath each field | ✅ |
| UI/UX | Empty state has icon + heading + description + CTA | ✅ |
| UI/UX | Keyboard accessible | Code-level ✅ — requires browser verification |
| UI/UX | Responsive `sm` / `md` / `lg` | Code-level ✅ — requires browser verification |
| UI/UX | Focus trapped in modal | Code-level ✅ (`modal.jsx`) — requires browser verification |
| Security | Sanctum / Resources / PK exposure | ✅ N/A — no API; business IDs `IR-xxx` |
| Security | No guarded terminal commands run | ✅ only `npx esbuild` + temp-dir cleanup |

### Phase 2: Item Request detail page (`/item_request/{id}`) with 3-approver stepper + issuance

- **Timestamp:** 2026-11-09 21:15 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + 🖥️ Frontend + 🎨 Designer
- **Files Modified/Created:**
  - `routes/web.php` — Added `Route::inertia('/item_request/{id}', ...item_request/id/page)` inside the `asset_inventory` group.
  - `.../item_request/id/page.jsx` — **Created.** Reads `id` from `window.location.pathname.split("/")[5]`, `findItemRequest`, local approval state, mock Approve / Reject / Mark-as-Issued handlers, global `setAlert` feedback, not-found empty state.
  - `.../item_request/id/sections/header-section.jsx` — **Created.** Back `<Link>`, title `IR-xxx`, status / priority / category badges.
  - `.../item_request/id/sections/item-req-flow-section.jsx` — **Created.** `lg:grid-cols-3`: Item Details (item, purpose, category, qty), Schedule (request date / needed by / timeline tile with days-remaining or overdue), Requester panel, Issued Asset panel (green, shown only when Issued with tag); sticky stepper column.
  - `.../item_request/id/sections/stepper-section.jsx` — **Created.** Composes `_components/stepper.jsx` with the 3-step chain; Approve / Reject on the current pending step via `confirmation.jsx` + `textarea.jsx` (reason required on reject); when all 3 approved and not yet issued → "Mark as Issued" button with asset-tag `input.jsx` (required, inline error).
- **Issues Encountered:** None.
- **Resolution:** N/A. Verified: 4 files pass esbuild parse; `item_request/id/page.jsx` bundles successfully with the `@` alias; `php -l routes/web.php` passes.
- **QA Checklist Result:** ✅ All pass (table below). Browser-dependent items are code-level ✅.
- **Next Steps:** Phase 3 (optional) — Liability Form module, or API wiring (service/thunk/slice + Laravel backend) for either request module. Awaiting your approval.

#### QA detail

| Area | Item | Result |
|---|---|---|
| JS Purity | Plain JavaScript, no TS syntax | ✅ |
| Backend | `web.php` only `Route::inertia` added | ✅ |
| Backend | `api.php` / Requests / Policies / Resources / migrations | ✅ N/A — UI-only |
| Frontend | Services / thunks / slices | ✅ N/A — mock data |
| Frontend | 422 → field errors | ✅ N/A network-wise; inline errors for reject reason + asset tag |
| Frontend | Internal links use `<Link>` | ✅ back link, not-found CTA |
| Frontend | Persistent layout | ✅ `Layout` + `AssetInventory` |
| Frontend | No `_components/` file touches Redux/API | ✅ none modified |
| Frontend | `_components/` verified before creating UI | ✅ reused stepper, badge, button, confirmation, textarea, input |
| Naming | PascalCase components / kebab-case files / `page.jsx` | ✅ |
| UI/UX | Loading state for network ops | ✅ N/A — synchronous mock |
| UI/UX | Destructive action confirmation | ✅ Reject via `confirmation.jsx`, red button + cancel |
| UI/UX | Inline validation beneath field | ✅ reject reason, asset tag |
| UI/UX | Empty state icon + heading + description + CTA | ✅ not-found state |
| UI/UX | Keyboard accessible | Code-level ✅ — requires browser verification |
| UI/UX | Responsive `sm` / `md` / `lg` | Code-level ✅ — requires browser verification |
| UI/UX | Focus trapped in modal | Code-level ✅ (`confirmation.jsx` FocusTrap) — requires browser verification |
| Security | Sanctum / Resources / PK exposure | ✅ N/A — no API; business IDs `IR-xxx`, inherits auth group |
| Security | No guarded terminal commands run | ✅ only `npx esbuild` + `php -l` |

### Phase 3: Rework Item Request to "device assignment" design (from screenshot)

- **Timestamp:** 2026-11-09 21:20 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend + 🎨 Designer
- **Files Modified/Created:**
  - `.../item_request/sections/item-request-helpers.js` — Added `REQUEST_TYPES` (New Assignment / Replacement / Temporary Loan / Return & Reassign) + variant map; `MOCK_EMPLOYEES` (8, with ID/dept/email), `MOCK_DEVICES` (11, with tag/category/availability); `employeeOptions()`, `deviceOptions()`, `findEmployee()`, `findDevice()`.
  - `.../item_request/sections/item-request-mock-data.js` — Reshaped to device-assignment fields: `deviceName`, `assetTag`, `assigneeName`, `assigneeId`, `requestType`, `fromDate`, `untilDate`, `justification`, `purpose` (optional). Same 6 records covering all statuses/approval states.
  - `.../item_request/sections/create-item-req-section.jsx` — Matches the screenshot: Device (searchable select of available devices), Assign To (searchable select of employees by name/ID), Request Type + Priority, From Date (Optional) + Until Date (Optional, validated ≥ from), Justification (required, 10+ chars), Purpose (Optional). Subtitle: "Request a device assignment for yourself or another".
  - `.../item_request/sections/table-section.jsx` — Columns: Request ID + date, Device + asset tag, Assign To (name + ID + dept), Type badge, Priority, Period (from → until), Status (+ issued tag), View link.
  - `.../item_request/sections/search-section.jsx` — Filters: Status / Type / Priority; search covers device, asset tag, assignee, ID, department.
  - `.../item_request/page.jsx` — `handleCreateSubmit` resolves device + employee from the mock directory; filter logic on new fields.
  - `.../item_request/id/sections/item-req-flow-section.jsx` — Panels: Device Details (device, asset tag, request type), Assignment (assignee, employee ID, email, dept), Schedule (request date, from → until, duration tile), Justification & Purpose; Issued Asset panel kept.
  - `.../item_request/id/sections/header-section.jsx` — Badge now shows `requestType` instead of `assetCategory`.
- **Issues Encountered:** None.
- **Resolution:** N/A. Verified: 8 files pass esbuild parse; `item_request/page.jsx` and `item_request/id/page.jsx` bundle successfully with the `@` alias.
- **QA Checklist Result:** ✅ All pass (same table as Phase 2 — no backend, Redux, or `_components` changes; inline validation on all required fields; keyboard/responsive/focus-trap are code-level ✅ pending browser verification).
- **Next Steps:** Phase 4 (optional) — Liability Form module, or API wiring for either request module. Awaiting your approval.
