# Devices + System Units — List Pages (UI only)

### Phase 1: Devices and System Units list pages with stats, currency strip, search/filters, table, and create modals

- **Timestamp:** 2026-11-09 23:10 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + 🖥️ Frontend + 🎨 Designer
- **Files Modified/Created:**

  **Devices** (`.../asset_inventory/devices/`)
  - `sections/device-helpers.js` — **Created.** `DEVICE_TYPES`, `DEVICE_STATUSES` (New/Working/Defective/For Repair), `AVAILABILITY` (Available/Assigned/Unavailable), variant maps, `CURRENCIES`, `formatMoney` (null-safe), `formatDate`, re-exports `toOptions` from `_lib`.
  - `sections/device-mock-data.js` — **Created.** 8 devices: serialNumber, deviceType, brand, model, status, availability, price (nullable), issuedTo, receivedBy. `findDevice(id)`.
  - `sections/header-section.jsx` — **Created.** Title "Devices", subtitle, "Add Device" (green).
  - `sections/stats-section.jsx` — **Created.** 6 tinted cards: Total / Working / Needs Attention / Laptops / Desktops / Mobile Devices.
  - `sections/currency-strip.jsx` — **Created.** Teal info banner + currency select.
  - `sections/search-section.jsx` — **Created.** Search (serial/type/brand/model) + Status / Type / Availability selects.
  - `sections/table-section.jsx` — **Created.** Columns: Serial Number, Device Type, Brand, Model, Status, Availability, Price, Issued To, Received By, Actions (view icon). Empty state + pagination.
  - `sections/create-device-section.jsx` — **Created.** Modal: serial, type, brand, model, status, availability, price (optional), received by. Inline validation.
  - `page.jsx` — Replaced stub. State, filtering, pagination, create + view handlers (`setAlert`).

  **System Units** (`.../asset_inventory/system_unit/`)
  - `sections/system-unit-helpers.js` — **Created.** `SYSTEM_TYPES` (Desktop/Workstation/Server), `SYSTEM_STATUSES` (Available/Assigned/Maintenance/Retired), `LOCATIONS`, variant maps, `CURRENCIES`, `formatDate`, re-exports `toOptions`.
  - `sections/system-unit-mock-data.js` — **Created.** 6 units: name, type, cpu, ram, storage, os, status, location, station, customBuilt. `findSystemUnit(id)`.
  - `sections/header-section.jsx` — **Created.** Title "System Units", subtitle, "Add System Unit" (green).
  - `sections/stats-section.jsx` — **Created.** 4 tinted cards: Total / Available / Assigned / Custom Built.
  - `sections/currency-strip.jsx` — **Created.** Same teal banner + currency select.
  - `sections/search-section.jsx` — **Created.** Search (name/serial/brand) + Type / Status / Location selects.
  - `sections/table-section.jsx` — **Created.** Columns: System Info (name + ID), Type, CPU, RAM, Storage, OS, Status, Location, Station, Actions (view icon). Empty state + pagination.
  - `sections/create-system-unit-section.jsx` — **Created.** Modal matching screenshot 3: System information (name*, type*, CPU*, RAM*, storage*, OS*) + Assignment (status, location, station). Inline validation.
  - `page.jsx` — Replaced stub. State, filtering, pagination, create + view handlers (`setAlert`).

- **Issues Encountered:** None.
- **Resolution:** N/A. Verified: 18 files pass esbuild parse; `devices/page.jsx` and `system_unit/page.jsx` bundle successfully with the `@` alias.
- **QA Checklist Result:** ✅ All pass (table below). Browser-dependent items are code-level ✅.
- **Next Steps:** Optional — detail pages for Devices / System Units, or API wiring for any module. Awaiting your approval.

#### QA detail

| Area | Item | Result |
|---|---|---|
| JS Purity | Plain JavaScript, no TS syntax | ✅ |
| Backend | `web.php` / `api.php` / Requests / Policies / Resources / migrations | ✅ N/A — no backend changes (existing `/devices` and `/system_unit` Inertia routes reused) |
| Frontend | Services / thunks / slices | ✅ N/A — mock data |
| Frontend | 422 → field errors | ✅ N/A network-wise; RHF inline errors on required fields |
| Frontend | Internal links use `<Link>` | ✅ N/A — no internal navigation on these list pages (view uses `setAlert`) |
| Frontend | Persistent layout | ✅ `Layout` + `AssetInventory` |
| Frontend | No `_components/` file touches Redux/API | ✅ none modified |
| Frontend | `_components/` verified before creating UI | ✅ reused table, badge, button, pagination, modal, input, select |
| Naming | PascalCase components / kebab-case files / `page.jsx` | ✅ |
| UI/UX | Loading state for network ops | ✅ table `isloading` wired (idle with mock) |
| UI/UX | Destructive action confirmation | ✅ N/A — no destructive actions |
| UI/UX | Inline validation beneath each field | ✅ |
| UI/UX | Empty state icon + heading + description + CTA | ✅ |
| UI/UX | Keyboard accessible | Code-level ✅ — requires browser verification |
| UI/UX | Responsive `sm` / `md` / `lg` | Code-level ✅ — requires browser verification |
| UI/UX | Focus trapped in modal | Code-level ✅ (`modal.jsx` FocusTrap) — requires browser verification |
| Security | Sanctum / Resources / PK exposure | ✅ N/A — no API; serial/ID used as display keys |
| Security | No guarded terminal commands run | ✅ only `npx esbuild` + temp-dir cleanup |
