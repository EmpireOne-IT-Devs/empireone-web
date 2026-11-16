### Phase 1: Always show the landing page at the site root

- **Timestamp:** 2026-11-16 23:14 +08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🧪 QA
- **Files Modified/Created:**
  - `routes/web.php` — The `/` route no longer redirects logged-in users to their dashboard; it always renders `landing_page/page`.
- **Issues Encountered:** None. The other requested behaviours already existed: `/auth/login` sends a logged-in user to their role dashboard, and `POST /logout` invalidates the session and redirects to `/auth/login`.
- **Resolution:** Removed only the logged-in check from the `/` route. Login, logout, dashboard routes, role middleware, and post-login redirects (which target the `dashboard` route or the role dashboards, not `/`) are unchanged.
- **QA Checklist Result:** ✅ `php -l routes/web.php` reports no syntax errors; the `/` route now contains only an `Inertia::render()` call; no migration, controller, Form Request, Resource, Redux, or UI changes; dashboard routes remain behind `auth`; no guarded commands run. No automated tests were run. Behaviour in the browser (landing page while logged in, Login button to dashboard, login form after logout) is not yet verified.
- **Side effects:** For logged-in users, links that point to `/` (the "Home" link and logo on the error page, and the link on the privacy policy page) now open the landing page instead of redirecting to the dashboard.
- **Next Steps:** Verify the three browser flows. If production uses `php artisan route:cache`, the route cache must be rebuilt on deploy for this change to take effect.
