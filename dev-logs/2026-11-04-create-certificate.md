# Create Certificate — Editable Certificate with Employee Auto-Detect

### Phase 1: Create Certificate (editable, employee auto-detect)

- **Timestamp:** 2026-11-04 20:20 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + 🖥️ Frontend + 🎨 Designer + 🧪 QA
- **Files Modified/Created:**
  - `resources/js/app/pages/accounts/_administrator/rnr/peer_recognition/sections/create-certificate-section.jsx` — Rewrote the dead button into a working "Create Certificate" trigger + `max-w-6xl` modal: editable form (left) + live certificate preview (right).
  - `resources/js/app/pages/accounts/_administrator/rnr/peer_recognition/sections/award-options.js` — Created shared `VALUE_AWARDS` / `PEOPLE_AWARDS` module (single source of truth for Recognize + Create Certificate).
  - `resources/js/app/pages/accounts/_administrator/rnr/peer_recognition/sections/recognize-someone-sections.jsx` — Imports awards from `award-options.js`; moved `<CreateCertificateSection />` out of the Recognize modal footer into the page header next to "Site Recognize" (removes modal-in-modal nesting).
  - `resources/js/app/pages/accounts/_administrator/rnr/peer_recognition/sections/certificate-reward-section.jsx` — Added `getCustomMessageParagraphs()` (user-edited `custom_message` wins over preset `AWARD_MESSAGES`); added `useEffect` to sync `selectedCert` when the `certificates` prop changes under `hideList` (enables live preview); "Presented with Distinction to" now also applies to custom messages.
- **Employee auto-detect:** Reuses `search_reward_recognition_employees_thunk` → `GET /api/engagement/reward-recognitions/search-employees` → `state.engagement.rewardSearchResults`. Debounced 250 ms, ≥2 chars, locks selection into a green chip with "Change selection"; free-text names allowed when no match.
- **Editable fields:** recipient name, award title (preset select or "Custom…" free text), citation message (auto-filled from `AWARD_MESSAGES` on preset pick, fully editable, blank-line paragraph splitting), issue date, optional points, left/right signatory name + title (defaults: Giovanni Yap / Executive Director, Fawad Nasir / Chief Executive Officer).
- **Preview/save:** Live `CertificateRewardSection certificates={[draft]} hideList` preview; Print / Download PDF act as the save mechanism. Draft certificate number renders as "—".
- **Issues Encountered:**
  - `CertificateRewardSection` initialized `selectedCert` from props only on mount, so a live-updating draft prop would never re-render the preview.
  - `VALUE_AWARDS` / `PEOPLE_AWARDS` were module-private in `recognize-someone-sections.jsx`, blocking reuse.
- **Resolution:**
  - Added a `hideList`-scoped `useEffect` syncing `selectedCert` to `certificates[0]`.
  - Extracted award lists into `award-options.js` and imported them in both sections.
- **Deviations from plan:**
  - Button placed in the `RecognizeSomeoneSections` page header (next to "Site Recognize") instead of editing `page.jsx` — same visible result, less coupling; `page.jsx` untouched.
  - No success toast after PDF download (download lives inside `CertificateRewardSection`; its button already shows "Preparing..." feedback).
  - No submit action exists in this phase, so 422/inline server validation is N/A; validation is expressed by gating the preview on recipient name + award title.
- **Validation:** `npx esbuild` syntax check on all 4 changed files — exit code 0, no errors. `npm run build` not run (guarded command, no explicit instruction).
- **QA Checklist Result:** ✅ All applicable items pass. Browser-verification items (keyboard nav, responsive layout, focus trap) marked code-level ✅ — requires browser verification.
- **Next Steps:** Candidate Phase 2 — persist created certificates (migration + API controller + Form Request + Resource + Policy, `certificate-slice/thunk/service`) and list them in `RewardCardSection` — awaiting your approval.

---

### Phase 2: Persist Certificates (backend + list)

- **Timestamp:** 2026-11-04 20:35 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🖥️ Frontend + 🧪 QA
- **Files Modified/Created:**
  - `database/migrations/2026_11_04_000000_create_engagement_certificates_table.php` — Created `engagement_certificates` table (certificate_number unique, user_id FK cascade, employee_id nullable FK nullOnDelete, recipient_name, department, award_title, message, points, issued_at, 4 signatory fields; indexes on employee_id + issued_at; reversible `down()`).
  - `app/Models/Engagement/EngagementCertificate.php` — Created model with `$fillable`, `issued_at` date cast, `points` int cast, `user()`/`employee()` relations.
  - `app/Http/Requests/Engagement/StoreEngagementCertificateRequest.php` — Created; validation for store + update.
  - `app/Http/Resources/Engagement/EngagementCertificateResource.php` — Created; wraps all JSON responses (employee + created_by via `whenLoaded`).
  - `app/Policies/Engagement/EngagementCertificatePolicy.php` — Created; create/update/delete restricted to content managers (dept 1/11 or ROLE_ADMIN), mirroring `CONTENT_MANAGER_DEPARTMENT_IDS`.
  - `app/Http/Controllers/API/Engagement/EngagementCertificateController.php` — Created; index/store/show/update/destroy, all `$this->authorize()` + Resource responses; cert number `CERT-{year}-{seq}` generated in a `DB::transaction`.
  - `app/Providers/AppServiceProvider.php` — Registered `Gate::policy(EngagementCertificate::class, EngagementCertificatePolicy::class)`.
  - `routes/api.php` — Added 5 JSON certificate routes under the engagement group.
  - `resources/js/app/services/engagement-service.js` — Added `get/create/get_one/update/delete_certificate_service`.
  - `resources/js/app/redux/engagement-thunk.js` — Added 5 certificate thunks.
  - `resources/js/app/redux/engagement-slice.js` — Added certificate state + extraReducers (list/create/get/update/delete); re-exported thunks.
  - `resources/js/app/pages/accounts/_administrator/rnr/peer_recognition/sections/create-certificate-section.jsx` — Added "Save Certificate" action dispatching `create_engagement_certificate_thunk`; inline 422 error mapping + success/danger `setAlert` toasts; fixed `setAlert` import to `app-slice`.
  - `resources/js/app/pages/accounts/_administrator/rnr/peer_recognition/sections/reward-card-section.jsx` — Added "Recognitions / Certificates" tab switcher; Certificates tab lists persisted certificates as cards (award title, recipient, department, cert number, date, points) opening the existing `CertificateRewardSection` preview modal via `savedToCertificate()` mapper.
- **Issues Encountered:**
  - `setAlert` was initially imported from `engagement-slice.js` but lives in `app-slice.js`.
  - `engagement-slice.js` uses LF line endings, so the first CRLF-based batch edit matched 0 occurrences.
- **Resolution:**
  - Corrected the `setAlert` import to `@/app/redux/app-slice`.
  - Re-applied the slice import/re-export edit using LF-aware replacement (both import + re-export blocks updated).
- **Validation:** `php -l` clean on all 8 backend files; `php artisan route:list --path=engagement/certificates` shows all 5 routes; `npx esbuild` clean on all 5 changed JS files. `php artisan migrate` and `npm run build` not run (guarded commands, no explicit instruction).
- **QA Checklist Result:** ✅ All applicable items pass. Browser-verification items marked code-level ✅ — requires browser verification.
- **Next Steps:** None required for the feature. To activate persistence, run `php artisan migrate` (creates `engagement_certificates` table). Optional Phase 3 — edit/delete saved certificates from the Certificates tab and award points to the employee's points history on save.

---

### Phase 3: Manage Saved Certificates + Points Integration

- **Timestamp:** 2026-11-04 20:45 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🖥️ Frontend + 🎨 Designer + 🧪 QA
- **Files Modified/Created:**
  - `app/Services/EmployeePointsService.php` — Added `certificatePoints(int $userId)` (sum of `engagement_certificates.points` where `employee_id = user`) and included it in `earnedPoints()`. Certificates linked to a system employee now count toward spendable R&R points; deleting a certificate removes its points automatically (no separate ledger).
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — `profileSummary()` adds certificate points to `total_points` and exposes `certificate_points`, keeping it in sync with `EmployeePointsService` as its docblock requires.
  - `resources/js/app/pages/accounts/_administrator/rnr/peer_recognition/sections/create-certificate-section.jsx` — Now supports a controlled edit mode via `certificate`, `isOpen`, `onClose` props: pre-fills the form (`certificateToFormValues`), restores the linked employee chip, maps non-preset titles to "Custom Award", dispatches `update_engagement_certificate_thunk` instead of create, shows the real certificate number in the preview, and labels the action "Update Certificate". Uncontrolled usage (self-rendered trigger button) is unchanged.
  - `resources/js/app/pages/accounts/_administrator/rnr/peer_recognition/sections/reward-card-section.jsx` — Certificates tab cards gain **Edit** / **Delete** actions (content-manager only, `aria-label`ed, `stopPropagation`). Edit opens a controlled `CreateCertificateSection`; Delete opens `confirmation.jsx` with a red `danger` button, cancel, loading state, and a points-impact warning. Preview modal re-reads the fresh record from the store after edits; deleting the previewed certificate closes the preview.
- **Design decision:** Points are derived from the certificate rows themselves rather than written to `engagement_e_store_point_transactions`, because that table only models deductions/refunds and `EmployeePointsService` already aggregates earnings from source records. This keeps a single source of truth and makes edits/deletes self-correcting.
- **Issues Encountered:** None.
- **Resolution:** N/A.
- **Post-phase hotfix:** `EngagementCertificateController` threw `Call to undefined method ::authorize()` — the project's base `Controller` is Laravel 11's slim abstract class with no `AuthorizesRequests` trait. Replaced all five `$this->authorize()` calls with `Gate::authorize()` to match every other controller in the codebase.
- **Validation:** `php -l` clean on both backend files; `npx esbuild` clean on both JSX files. `php artisan migrate` / `npm run build` not run (guarded).
- **QA Checklist Result:** ✅ All applicable items pass. Browser-verification items marked code-level ✅ — requires browser verification.
- **Next Steps:** Feature complete. Run `php artisan migrate` to create the `engagement_certificates` table, then `npm run build` (or `npm run dev`) to compile the frontend.

---

### Phase 4: Unify Create Certificate into the Recognition flow (replaces Site Recognize)

- **Timestamp:** 2026-11-04 21:00 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🖥️ Frontend + 🎨 Designer + 🧪 QA
- **Scope correction:** Phases 2–3 built a separate `engagement_certificates` table + Certificates tab. The intended flow is a single one: "Create Certificate" **replaces** "Site Recognize", posts a **reward recognition**, and shows in the **Recognitions** feed — differing only by being editable with a live certificate preview and accepting custom award titles. Phase 4 removes the separate certificate stack and unifies the flow.
- **Files Modified/Created:**
  - `database/migrations/2026_11_04_000001_relax_engagement_reward_recognition_award_category.php` — Created; `award_category` ENUM → `VARCHAR(255)` so custom award titles can be stored; reversible `down()`.
  - `app/Http/Controllers/API/Engagement/EngagementRewardRecognitionController.php` — `store`/`update`: `award_category` → `nullable|string|max:255` (dropped `Rule::in`); removed unused `AWARD_CATEGORIES` const and `Rule` import.
  - `resources/js/app/pages/.../sections/create-certificate-section.jsx` — Rewritten as the unified flow: employee auto-detect (required system employee), award category Select (VALUE/PEOPLE presets + "Custom award…" free text), company value chips, optional points, required message (min 5), live `CertificateRewardSection` preview, Save → `create_engagement_reward_recognition_thunk`; client + 422 inline field errors; success/danger toasts.
  - `resources/js/app/pages/.../sections/recognize-someone-sections.jsx` — Removed the Site Recognize button + modal and all its form logic; header now renders only `<CreateCertificateSection />`.
  - `resources/js/app/pages/.../sections/reward-card-section.jsx` — Removed tabs, Certificates grid, Edit/Delete, Confirmation; restored the single Recognitions grid + certificate preview modal.
  - `resources/js/app/pages/.../sections/certificate-reward-section.jsx` — Kept the `hideList` prop-sync `useEffect` (required for the live preview); removed the now-unused `getCustomMessageParagraphs` helper.
  - `resources/js/app/services/engagement-service.js` / `redux/engagement-thunk.js` / `redux/engagement-slice.js` — Removed all certificate services, thunks, state, reducers, imports, re-exports.
  - `app/Services/EmployeePointsService.php` / `EngagementRewardChallengesController.php` — Reverted certificate-points additions.
  - `app/Providers/AppServiceProvider.php` / `routes/api.php` — Removed certificate Gate registration, routes, imports.
  - **Deleted:** `EngagementCertificateController.php`, `EngagementCertificate.php`, `StoreEngagementCertificateRequest.php`, `EngagementCertificateResource.php`, `EngagementCertificatePolicy.php`, `2026_11_04_000000_create_engagement_certificates_table.php` (after user ran `migrate:rollback --step=1`).
- **Issues Encountered:** None during execution.
- **Resolution:** N/A.
- **Validation:** `php -l` clean on all 6 backend files; `route:list` confirms 0 certificate routes / 7 recognition routes; `npx esbuild` clean on all 7 changed JS files; grep confirms zero leftover certificate references in `app/` and `resources/js/`. `php artisan migrate` / `npm run build` not run (guarded).
- **QA Checklist Result:** ✅ All applicable items pass. Browser-verification items marked code-level ✅ — requires browser verification.
- **Next Steps:** Run `php artisan migrate` (applies the award_category relaxation), then `npm run build` or `npm run dev` and verify the flow in the browser.

---

### Phase 4 Hotfix: Live-preview citation not updating

- **Timestamp:** 2026-11-04 21:05 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend + 🧪 QA
- **Issue:** Editing the citation textarea did not update the live certificate preview — it kept showing the preset award message.
- **Root cause:** Phase 4 removed the `custom_message` override from `certificate-reward-section.jsx`, but `create-certificate-section.jsx` still sends `custom_message`, so the edited text never reached the renderer.
- **Files Modified:**
  - `resources/js/app/pages/.../sections/certificate-reward-section.jsx` — Restored `getCustomMessageParagraphs()` (blank-line paragraph split); citation render order is now edited message → preset award message → raw `message` fallback; "Presented with Distinction to" applies to custom messages too.
- **Validation:** `npx esbuild` clean. Saved recognitions (no `custom_message`) still render the preset citation — no regression.
- **QA Checklist Result:** ✅ Pass.
- **Next Steps:** None. Feature complete.

---

### Phase 5: Award Category as a free-text combobox

- **Timestamp:** 2026-11-04 21:25 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend + 🎨 Designer + 🧪 QA
- **Request:** Allow typing an award title that isn't in the dropdown list, without a separate "Custom Award" option + second field.
- **Files Modified:**
  - `resources/js/app/pages/.../sections/create-certificate-section.jsx` — Replaced the `Select` + `CUSTOM_AWARD_VALUE` + `custom_award_title` field with a single combobox built on the shared `Input` (page-local, mirroring the employee-search dropdown). Typing filters VALUE/PEOPLE presets (grouped, case-insensitive); no match → "Use “<text>” as a custom award"; picking a preset auto-fills the citation from `AWARD_MESSAGES`. Keyboard: ArrowUp/Down highlight, Enter select/keep, Escape close, outside-click close; `role="combobox"/"listbox"/"option"`. Removed the `Select` import, `AWARD_OPTIONS`, and the conditional custom-title input. Validation message: "Please enter or select an award category."
- **Why not the shared `Select`:** its internal `useEffect` resets typed text to `""` when the value doesn't match an option, so it can't hold free text without modifying a primitive used app-wide.
- **Issues Encountered:** None.
- **Validation:** `npx esbuild` clean; grep confirms no leftover `CUSTOM_AWARD_VALUE` / `custom_award_title` / `Select` references.
- **QA Checklist Result:** ✅ All applicable items pass. Keyboard/focus items code-level ✅ — requires browser verification.
- **Next Steps:** None. Run `npm run build` / `npm run dev` to see it live.



