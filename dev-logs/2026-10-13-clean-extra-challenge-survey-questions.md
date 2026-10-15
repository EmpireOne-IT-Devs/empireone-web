### Phase 1: Remove unsupported extra questions from the challenge survey

- **Timestamp:** 2026-10-13 21:25 (+08:00)
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead, ⚙️ Backend, 🧪 QA
- **Files Modified/Created:**
  - `dev-logs/2026-10-13-clean-extra-challenge-survey-questions.md` — Records the targeted survey data cleanup and verification.
- **Issues Encountered:** The target challenge survey included two placeholder questions with unsupported types (`short_answer` and `multiple_choice`), which caused survey submission validation to fail.
- **Resolution:** Confirmed both extra questions had zero saved answers, then removed exactly `New Q1` and `New Q2` from the survey linked to challenge ID `1` (The EXTRAMILE Steps Challenge). Retained the seven standard challenge survey questions.
- **QA Checklist Result:** ✅ Target survey now has exactly the seven expected questions, all with supported `rating` or `paragraph` types. ✅ No `New Q1`/`New Q2` questions remain in the target survey. ✅ The 36-test `ChallengeSurveyCreationTest` suite passed. ✅ PHP syntax checks passed for the challenge survey request, service, and resource. ✅ No routes, frontend, or authorization behavior changed.
- **Next Steps:** Reload the challenge survey and submit again; the unsupported-question-type error should no longer occur.
