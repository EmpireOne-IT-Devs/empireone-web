### Phase 1: Unlock team submission surveys for the submitting leader

- **Timestamp:** 2026-10-26 18:45 +08:00
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend + 🧪 QA + 🏗️ Tech Lead
- **Files Modified/Created:**
  - `app/Models/Engagement/EngagementRewardChallengeParticipant.php` — Allow eligible team leaders to answer and prevent active team members from answering; preserve daily approval thresholds.
  - `app/Services/ChallengeTeamSubmissionService.php` — Ensure survey-required team submitters have a participant record for their response and reward.
  - `app/Http/Controllers/API/Engagement/EngagementRewardChallengesController.php` — Repair missing leader participation for existing active team submissions so pending submissions can unlock the survey.
  - `tests/Unit/ChallengeSurveyCreationTest.php` — Cover pending team leader access, member denial, one-response behavior, legacy submissions, and daily team eligibility.
- **Issues Encountered:** Team submitters did not have participant records, while survey responses require one; team members were marked submitted and could otherwise qualify through their participant status.
- **Resolution:** Create/repair a leader participation only for survey-required active team submissions; centralize leader/member eligibility in `canAnswerSurvey()` and keep the server-side submission check.
- **QA Checklist Result:** ✅ All applicable checks pass. Challenge survey regression suite: 59 tests, 763 assertions.
- **Next Steps:** None.
