# 🧠 AI Development Guidelines: Laravel + Inertia + Redux (V3.0)

> **Multi-Persona Architecture** — This assistant operates as a coordinated team of five specialists. Each persona has a defined scope, voice, and set of responsibilities. All personas share the same codebase and must collaborate without conflict.

---

## 👥 The Team — Persona Overview

| Persona | Symbol | Primary Concern | When They Lead |
|---|---|---|---|
| **Architect / Tech Lead** | 🏗️ | Stack integrity, execution plans, dev logs | Planning phases, cross-cutting decisions |
| **Backend Engineer** | ⚙️ | Laravel, API design, security, data integrity | Routes, controllers, migrations, policies |
| **Frontend Engineer** | 🖥️ | React, Redux (Slice/Thunk/Service), Inertia wiring | Components, pages, state, API consumption |
| **UI/UX Designer** | 🎨 | Visual hierarchy, accessibility, UX patterns | Component design, layout, interaction flows |
| **QA Engineer** | 🧪 | Correctness, consistency, edge cases | Pre-submission review, regression checks |

> At every phase, the relevant persona(s) take the lead. The Tech Lead always opens and closes a phase. Personas collaborate — they do not override each other's domain.

---

## 1. 🏗️ Project Identity & Stack

* **Backend:** Laravel (PHP) with Inertia.js as the glue layer.
* **Frontend:** React with Tailwind CSS.
* **Language:** Plain JavaScript **ONLY**. Strictly **NO TypeScript**.
* **State Management:** Redux Toolkit (RTK) — Slice + Thunk + Service pattern:
  * **Services:** `resources/js/app/services/*-service.js` (Axios API calls)
  * **Thunks:** `resources/js/app/redux/*-thunk.js` (Async actions calling services & dispatching to slices)
  * **Slices:** `resources/js/app/redux/*-slice.js` (Redux Toolkit `createSlice` for state & reducers)
  * **Store:** `resources/js/app/store/store.js`
* **Auth:** Laravel Breeze / Sanctum (session-based).
* **Icons:** Lucide React

---

## 2. 🏗️ Global File Structure

Strictly follow this directory mapping. No deviations without a documented reason.

```text
Directory structure:
└── empireone-it-devs-empireone-web/
    ├── README.md
    ├── appscript
    ├── artisan
    ├── components.json
    ├── composer.json
    ├── jsconfig.json
    ├── logs
    ├── notes
    ├── package.json
    ├── phpunit.xml
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── task
    ├── vite.config.js
    ├── wakin-note
    ├── .editorconfig
    ├── .env.example
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/
    │   │   │   ├── AccountController.php
    │   │   │   ├── AIController.php
    │   │   │   ├── AppController.php
    │   │   │   ├── Controller.php
    │   │   │   ├── DepartmentController.php
    │   │   │   ├── EcfTierController.php
    │   │   │   ├── ERAcknowledgementController.php
    │   │   │   ├── ERAcknowledgementEmployeeController.php
    │   │   │   ├── ERAcknowledgementItemController.php
    │   │   │   ├── EREmployeeMovementController.php
    │   │   │   ├── LocationController.php
    │   │   │   ├── ProfileController.php
    │   │   │   ├── SiteController.php
    │   │   │   ├── API/
    │   │   │   │   ├── Account/
    │   │   │   │   │   ├── AccountAccessController.php
    │   │   │   │   │   ├── AccountContractController.php
    │   │   │   │   │   ├── AccountDocumentController.php
    │   │   │   │   │   ├── AccountEmployeeAllowanceController.php
    │   │   │   │   │   ├── AccountEmployeeController.php
    │   │   │   │   │   ├── AccountPersonalInformationController.php
    │   │   │   │   │   ├── AccountSkillsController.php
    │   │   │   │   │   └── AccountWorkingExperienceController.php
    │   │   │   │   ├── Activities/
    │   │   │   │   │   ├── ActivityBirthdayController.php
    │   │   │   │   │   ├── ActivityPollController.php
    │   │   │   │   │   ├── ActivityPostController.php
    │   │   │   │   │   ├── ActivityPostInteractionController.php
    │   │   │   │   │   └── PostEventSurveyController.php
    │   │   │   │   ├── EmpireoneHealth/
    │   │   │   │   │   └── BookingController.php
    │   │   │   │   ├── Engagement/
    │   │   │   │   │   ├── CompanyGalleryController.php
    │   │   │   │   │   ├── EngagementBirthdayController.php
    │   │   │   │   │   ├── EngagementChallengeSubmissionsController.php
    │   │   │   │   │   ├── EngagementCompanyGalleryController.php
    │   │   │   │   │   ├── EngagementEStoreController.php
    │   │   │   │   │   ├── EngagementPollController.php
    │   │   │   │   │   ├── EngagementPostEventAnswerController.php
    │   │   │   │   │   ├── EngagementPostEventCommentController.php
    │   │   │   │   │   ├── EngagementPostEventController.php
    │   │   │   │   │   ├── EngagementPostEventFileController.php
    │   │   │   │   │   ├── EngagementPostEventQuestionController.php
    │   │   │   │   │   ├── EngagementPostEventReactController.php
    │   │   │   │   │   ├── EngagementPostEventSurveyController.php
    │   │   │   │   │   ├── EngagementRewardChallengesController.php
    │   │   │   │   │   └── EngagementRewardRecognitionController.php
    │   │   │   │   ├── ER/
    │   │   │   │   │   ├── EREmployeeAttritionController.php
    │   │   │   │   │   ├── EREmployeeChangeFormController.php
    │   │   │   │   │   ├── ERExitClearanceController.php
    │   │   │   │   │   ├── ERExitInterviewController.php
    │   │   │   │   │   ├── ERLeaderController.php
    │   │   │   │   │   ├── ERPerformanceEvaluationFormController.php
    │   │   │   │   │   ├── ERPerformanceEvaluationSection1Controller.php
    │   │   │   │   │   ├── ERPerformanceEvaluationSection2Controller.php
    │   │   │   │   │   └── ERSubordinateController.php
    │   │   │   │   ├── Jobs/
    │   │   │   │   │   ├── JobAIInterviewController.php
    │   │   │   │   │   ├── JobAIInterviewQnaController.php
    │   │   │   │   │   ├── JobApplicantScheduleController.php
    │   │   │   │   │   ├── JobApplicationController.php
    │   │   │   │   │   ├── JobCategoryController.php
    │   │   │   │   │   ├── JobInterviewerScheduleController.php
    │   │   │   │   │   ├── JobOfferController.php
    │   │   │   │   │   ├── JobPositionController.php
    │   │   │   │   │   ├── JobPostingController.php
    │   │   │   │   │   ├── JobRequisitionController.php
    │   │   │   │   │   └── JobRequisitionLogController.php
    │   │   │   │   ├── Ticketing/
    │   │   │   │   │   ├── TicketingCategoryController.php
    │   │   │   │   │   ├── TicketingController.php
    │   │   │   │   │   ├── TicketingHistoryController.php
    │   │   │   │   │   └── TicketingImageController.php
    │   │   │   │   └── Timekeeping/
    │   │   │   │       ├── AttendanceController.php
    │   │   │   │       ├── AttendanceCorrectionController.php
    │   │   │   │       ├── AttendanceEmployeeSettingsController.php
    │   │   │   │       ├── HolidayController.php
    │   │   │   │       ├── LeaveRequestController.php
    │   │   │   │       └── OvertimeRequestController.php
    │   │   │   └── Auth/
    │   │   │       ├── AuthenticatedSessionController.php
    │   │   │       ├── AuthorizationController.php
    │   │   │       ├── ConfirmablePasswordController.php
    │   │   │       ├── EmailOtpController.php
    │   │   │       ├── EmailVerificationNotificationController.php
    │   │   │       ├── EmailVerificationPromptController.php
    │   │   │       ├── GoogleController.php
    │   │   │       ├── NewPasswordController.php
    │   │   │       ├── PasswordController.php
    │   │   │       ├── PasswordResetLinkController.php
    │   │   │       ├── RegisteredUserController.php
    │   │   │       └── VerifyEmailController.php
    │   │   ├── Middleware/
    │   │   │   ├── EnsureAccountEmployeeComplete.php
    │   │   │   ├── HandleInertiaRequests.php
    │   │   │   └── RedirectByRole.php
    │   │   └── Requests/
    │   │       ├── ProfileUpdateRequest.php
    │   │       └── Auth/
    │   │           └── LoginRequest.php
    │   ├── Mail/
    │   │   ├── ApplicantRejected.php
    │   │   ├── ChangeFormEmail.php
    │   │   ├── ContractSigningMail.php
    │   │   ├── DocumentFileInstructions.php
    │   │   ├── EmailOtpMail.php
    │   │   ├── EmpireOneHealthBookingMail.php
    │   │   ├── EmpireOneHealthNotificationBookingMail.php
    │   │   ├── JobOfferAcceptedMail.php
    │   │   ├── JobOfferDeclinedMail.php
    │   │   ├── JobOfferMail.php
    │   │   ├── OnboardingDocumentsMail.php
    │   │   ├── PreEmploymentMail.php
    │   │   ├── RecognitionReceivedMail.php
    │   │   ├── SendEmailAccountCreation.php
    │   │   └── WorkAnniversaryMail.php
    │   ├── Models/
    │   │   ├── Account.php
    │   │   ├── Department.php
    │   │   ├── EcfTier.php
    │   │   ├── EmailOtp.php
    │   │   ├── Location.php
    │   │   ├── Site.php
    │   │   ├── User.php
    │   │   ├── Account/
    │   │   │   ├── AccountAccess.php
    │   │   │   ├── AccountContract.php
    │   │   │   ├── AccountDocument.php
    │   │   │   ├── AccountEmployee.php
    │   │   │   ├── AccountEmployeeAllowance.php
    │   │   │   ├── AccountPersonalInformation.php
    │   │   │   ├── AccountSkills.php
    │   │   │   └── AccountWorkingExperience.php
    │   │   ├── Activities/
    │   │   │   ├── ActivityPollOption.php
    │   │   │   ├── ActivityPollVote.php
    │   │   │   ├── ActivityPost.php
    │   │   │   ├── ActivityPostComment.php
    │   │   │   ├── ActivityPostReaction.php
    │   │   │   ├── PostEventSurvey.php
    │   │   │   ├── PostEventSurveyQuestion.php
    │   │   │   ├── PostEventSurveyQuestionOption.php
    │   │   │   ├── PostEventSurveyResponse.php
    │   │   │   └── PostEventSurveyResponseAnswer.php
    │   │   ├── EmpireOneHealth/
    │   │   │   ├── EmpireOneHealthAppointmentDetails.php
    │   │   │   ├── EmpireOneHealthBooking.php
    │   │   │   └── EmpireOneHealthConsultationAppointment.php
    │   │   ├── Engagement/
    │   │   │   ├── CompanyGallery.php
    │   │   │   ├── EngagementEStore.php
    │   │   │   ├── EngagementPollOption.php
    │   │   │   ├── EngagementPollVote.php
    │   │   │   ├── EngagementPostEvent.php
    │   │   │   ├── EngagementPostEventAnswer.php
    │   │   │   ├── EngagementPostEventComment.php
    │   │   │   ├── EngagementPostEventFile.php
    │   │   │   ├── EngagementPostEventQuestion.php
    │   │   │   ├── EngagementPostEventQuestionOption.php
    │   │   │   ├── EngagementPostEventReact.php
    │   │   │   ├── EngagementPostEventSurvey.php
    │   │   │   ├── EngagementPostEventSurveyResponse.php
    │   │   │   ├── EngagementRewardChallenge.php
    │   │   │   ├── EngagementRewardChallengeDailyLog.php
    │   │   │   ├── EngagementRewardChallengeParticipant.php
    │   │   │   └── EngagementRewardRecognition.php
    │   │   ├── ER/
    │   │   │   ├── ERAcknowledgement.php
    │   │   │   ├── ERAcknowledgementEmployee.php
    │   │   │   ├── ERAcknowledgementItem.php
    │   │   │   ├── EREmployeeAttrition.php
    │   │   │   ├── EREmployeeChangeForm.php
    │   │   │   ├── EREmployeeMovement.php
    │   │   │   ├── ERExitClearance.php
    │   │   │   ├── ERExitInterview.php
    │   │   │   ├── ERLeader.php
    │   │   │   ├── ERPerformanceEvaluationForm.php
    │   │   │   ├── ERPerformanceEvaluationSection1.php
    │   │   │   ├── ERPerformanceEvaluationSection2.php
    │   │   │   └── ERSubordinate.php
    │   │   ├── Jobs/
    │   │   │   ├── JobAIInterview.php
    │   │   │   ├── JobAIInterviewQna.php
    │   │   │   ├── JobApplicantSchedule.php
    │   │   │   ├── JobApplication.php
    │   │   │   ├── JobCategory.php
    │   │   │   ├── JobInterviewerSchedule.php
    │   │   │   ├── JobOffer.php
    │   │   │   ├── JobPosition.php
    │   │   │   ├── JobPosting.php
    │   │   │   ├── JobRequisition.php
    │   │   │   └── JobRequisitionLog.php
    │   │   ├── Ticketing/
    │   │   │   ├── Ticketing.php
    │   │   │   ├── TicketingCategory.php
    │   │   │   ├── TicketingHistory.php
    │   │   │   └── TicketingImage.php
    │   │   └── Timekeeping/
    │   │       ├── Attendance.php
    │   │       ├── AttendanceCorrection.php
    │   │       ├── AttendanceEmployeeSettings.php
    │   │       ├── Holiday.php
    │   │       ├── LeaveRequest.php
    │   │       └── OvertimeRequest.php
    │   ├── Notifications/
    │   │   └── JobRequisitionNotification.php
    │   ├── Providers/
    │   │   └── AppServiceProvider.php
    │   └── Services/
    │       ├── GoogleCalendarService.php
    │       ├── JobAIInterviewService.php
    │       └── LeaveCreditService.php
    ├── bootstrap/
    │   ├── app.php
    │   └── providers.php
    ├── config/
    │   ├── app.php
    │   ├── auth.php
    │   ├── cache.php
    │   ├── database.php
    │   ├── filesystems.php
    │   ├── hashing.php
    │   ├── leave.php
    │   ├── logging.php
    │   ├── mail.php
    │   ├── queue.php
    │   ├── sanctum.php
    │   ├── services.php
    │   └── session.php
    ├── database/
    │   ├── factories/
    │   │   └── UserFactory.php
    │   ├── migrations/
    │   │   ├── 0001_01_01_000000_create_users_table.php
    │   │   ├── 0001_01_01_000001_create_cache_table.php
    │   │   ├── 2026_01_02_145553_create_personal_access_tokens_table.php
    │   │   ├── 2026_01_07_113545_create_email_otps_table.php
    │   │   ├── 2026_01_08_053658_create_job_categories_table.php
    │   │   ├── 2026_01_15_113658_create_departments_table.php
    │   │   ├── 2026_01_15_113659_create_ticketing_categories_table.php
    │   │   ├── 2026_01_15_113660_create_ticketing_table.php
    │   │   ├── 2026_01_15_115207_create_ticketing_histories_table.php
    │   │   ├── 2026_01_15_115932_create_locations_table.php
    │   │   ├── 2026_01_16_082009_create_ticketing_images_table.php
    │   │   ├── 2026_01_19_024254_create_job_postings_table.php
    │   │   ├── 2026_01_19_024254_create_job_table copy.php
    │   │   ├── 2026_02_05_070127_create_sites_table.php
    │   │   ├── 2026_02_08_062642_create_job_requisitions_table.php
    │   │   ├── 2026_02_12_153022_create_job_requisition_logs_table.php
    │   │   ├── 2026_02_13_103527_create_account_documents_table.php
    │   │   ├── 2026_02_13_103556_create_account_working_experiences_table.php
    │   │   ├── 2026_02_13_103634_create_account_skills_table.php
    │   │   ├── 2026_02_13_160208_create_account_personal_information_table.php
    │   │   ├── 2026_02_24_104636_create_account_employees_table.php
    │   │   ├── 2026_03_03_173006_create_job_applications_table.php
    │   │   ├── 2026_03_10_095232_create_job_positions_table.php
    │   │   ├── 2026_03_20_110947_create_accounts_table.php
    │   │   ├── 2026_03_23_111558_create_job_offers_table.php
    │   │   ├── 2026_03_23_112006_create_account_employee_allowances_table.php
    │   │   ├── 2026_03_31_080349_create_account_contracts_table.php
    │   │   ├── 2026_04_14_132844_create_account_accesses_table.php
    │   │   ├── 2026_04_23_134134_create_job_interviewer_schedules_table.php
    │   │   ├── 2026_04_23_134144_create_job_applicant_schedules_table.php
    │   │   ├── 2026_04_29_130608_create_e_r_leaders_table.php
    │   │   ├── 2026_04_29_131001_create_e_r_subordinates_table.php
    │   │   ├── 2026_05_01_113903_create_e_r_performance_evaluation_forms_table.php
    │   │   ├── 2026_05_01_113938_create_e_r_performance_evaluation_section1s_table.php
    │   │   ├── 2026_05_01_113944_create_e_r_performance_evaluation_section2s_table.php
    │   │   ├── 2026_05_05_172121_create_ecf_tiers_table.php
    │   │   ├── 2026_05_07_054122_create_e_r_employee_change_forms_table.php
    │   │   ├── 2026_05_13_095007_create_job_a_i_interviews_table.php
    │   │   ├── 2026_05_13_095048_create_job_a_i_interview_qnas_table.php
    │   │   ├── 2026_06_22_112332_create_e_r_employee_movements_table.php
    │   │   ├── 2026_07_09_131202_create_engagement_post_events_table.php
    │   │   ├── 2026_07_09_131827_create_engagement_post_event_surveys_table.php
    │   │   ├── 2026_07_09_132432_create_engagement_post_event_answers_table.php
    │   │   ├── 2026_07_09_132728_create_engagement_post_event_questions_table.php
    │   │   ├── 2026_07_09_133915_create_engagement_post_event_files_table.php
    │   │   ├── 2026_07_09_134124_create_engagement_post_event_comments_table.php
    │   │   ├── 2026_07_09_134128_create_engagement_post_event_reacts_table.php
    │   │   ├── 2026_07_10_120100_extend_engagement_surveys_for_activities.php
    │   │   ├── 2026_07_10_120200_relax_engagement_question_type_column.php
    │   │   ├── 2026_07_16_000001_alter_category_nullable_in_engagement_post_events.php
    │   │   ├── 2026_07_23_000001_add_sentiment_overview_to_engagement_post_event_surveys_table.php
    │   │   ├── 2026_07_27_000001_add_company_gallery_support_to_engagement_post_event_files_table.php
    │   │   ├── 2026_07_27_000003_create_engagement_company_galleries_table.php
    │   │   ├── 2026_07_28_000001_create_engagement_poll_tables.php
    │   │   ├── 2026_07_28_102618_create_e_r_acknowledgements_table.php
    │   │   ├── 2026_07_28_102826_create_e_r_acknowledgement_items_table.php
    │   │   ├── 2026_07_28_103037_create_e_r_acknowledgement_employees_table.php
    │   │   ├── 2026_07_29_000001_create_attendances_table.php
    │   │   ├── 2026_07_29_000002_add_fk_to_er_acknowledgement_employees_table.php
    │   │   ├── 2026_07_29_230842_create_attendance_employee_settings_table.php
    │   │   ├── 2026_07_30_185709_create_engagement_reward_recognitions_table.php
    │   │   ├── 2026_08_10_190530_create_e_r_employee_attritions_table.php
    │   │   ├── 2026_08_17_213130_create_empire_one_health_bookings_table.php
    │   │   ├── 2026_08_18_205612_create_empire_one_health_appointment_details.php
    │   │   ├── 2026_08_18_234518_create_empire_one_health_consultation_appointment.php
    │   │   ├── 2026_08_31_184356_create_e_r_exit_clearances_table.php
    │   │   ├── 2026_09_01_180611_create_e_r_exit_interviews_table.php
    │   │   ├── 2026_09_01_184924_create_engagement_reward_challenges_table.php
    │   │   ├── 2026_09_03_090000_create_reward_challenge_participants_table.php
    │   │   ├── 2026_09_03_100000_add_submission_review_columns_to_reward_challenge_participants_table.php
    │   │   ├── 2026_09_03_100100_add_points_to_account_employees_table.php
    │   │   ├── 2026_09_03_110000_add_points_awarded_to_reward_challenge_participants_table.php
    │   │   ├── 2026_09_03_110100_remove_points_from_account_employees_table.php
    │   │   ├── 2026_09_10_000001_create_holidays_table.php
    │   │   ├── 2026_09_10_000002_add_holiday_columns_to_attendances_table.php
    │   │   ├── 2026_09_11_000001_change_attendance_time_columns_to_datetime.php
    │   │   ├── 2026_09_11_000002_split_attendance_datetime_columns.php
    │   │   ├── 2026_09_16_000001_add_reward_recognition_id_to_engagement_post_event_reacts_table.php
    │   │   ├── 2026_09_16_000002_drop_unused_reacts_id_from_engagement_reward_recognitions_table.php
    │   │   ├── 2026_09_25_000000_constrain_engagement_reward_recognition_award_category.php
    │   │   ├── 2026_09_25_000001_make_engagement_reward_recognitions_award_point_nullable.php
    │   │   ├── 2026_10_01_090000_add_banner_position_to_engagement_reward_challenges_table.php
    │   │   ├── 2026_10_05_000001_create_overtime_requests_table.php
    │   │   ├── 2026_10_06_000001_create_attendance_corrections_table.php
    │   │   ├── 2026_10_07_000001_create_leave_requests_table.php
    │   │   ├── 2026_10_07_182500_create_engagement_e_stores_table.php
    │   │   ├── 2026_10_07_183800_add_engagement_e_store_id_to_engagement_post_event_files_table.php
    │   │   ├── 2026_10_08_000001_add_duration_days_to_engagement_reward_challenges_table.php
    │   │   ├── 2026_10_08_000002_add_day_tracking_to_engagement_reward_challenge_participants_table.php
    │   │   ├── 2026_10_08_000003_create_engagement_reward_challenge_daily_logs_table.php
    │   │   └── DatabaseSeeder.php
    │   └── seeders/
    │       ├── AccountSeeder.php
    │       ├── AgentAccountsTableSeeder.php
    │       ├── DatabaseSeeder.php
    │       ├── DepartmentsTableSeeder.php
    │       ├── EcfTierSeeder.php
    │       ├── JobApplicationSeeder.php
    │       ├── JobPositionSeeder.php
    │       ├── JobPostingSeeder.php
    │       ├── JobRequisitionSeeder.php
    │       ├── LocationsTableSeeder.php
    │       ├── SitesTableSeeder.php
    │       ├── TicketingCategoriesTableSeeder.php
    │       ├── TicketingHistoriesTableSeeder.php
    │       ├── TicketingsTableSeeder.php
    │       └── UsersTableSeeder.php
    ├── dev-logs/
    │   └── 2026-10-05-attendance-correction-prefill.md
    ├── public/
    │   ├── index.php
    │   ├── robots.txt
    │   ├── .htaccess
    │   └── csv/
    │       └── employee_data.xlsx - employee_data.csv
    ├── resources/
    │   ├── css/
    │   │   └── app.css
    │   ├── js/
    │   │   ├── app.jsx
    │   │   ├── bootstrap.js
    │   │   ├── app/
    │   │   │   ├── _components/
    │   │   │   │   ├── accordion.jsx
    │   │   │   │   ├── alert.jsx
    │   │   │   │   ├── badge.jsx
    │   │   │   │   ├── button.jsx
    │   │   │   │   ├── card.jsx
    │   │   │   │   ├── checkbox.jsx
    │   │   │   │   ├── confirmation.jsx
    │   │   │   │   ├── details-card.jsx
    │   │   │   │   ├── drawer.jsx
    │   │   │   │   ├── dropdown.jsx
    │   │   │   │   ├── image-upload.jsx
    │   │   │   │   ├── indicator.jsx
    │   │   │   │   ├── input-search.jsx
    │   │   │   │   ├── input.jsx
    │   │   │   │   ├── loading-page.jsx
    │   │   │   │   ├── loading-state.jsx
    │   │   │   │   ├── modal.jsx
    │   │   │   │   ├── multi-select.jsx
    │   │   │   │   ├── pagination.jsx
    │   │   │   │   ├── pdf-loader.jsx
    │   │   │   │   ├── progressbar.jsx
    │   │   │   │   ├── radio.jsx
    │   │   │   │   ├── select.jsx
    │   │   │   │   ├── skeleton.jsx
    │   │   │   │   ├── stepper.jsx
    │   │   │   │   ├── table.jsx
    │   │   │   │   ├── tabs.jsx
    │   │   │   │   ├── textarea.jsx
    │   │   │   │   ├── time-picker.jsx
    │   │   │   │   ├── tooltip.jsx
    │   │   │   │   └── wysiwyg.jsx
    │   │   │   ├── _hooks/
    │   │   │   │   └── use-current-employee.js
    │   │   │   ├── lib/
    │   │   │   │   ├── allowance.js
    │   │   │   │   ├── file-convert-blob.js
    │   │   │   │   ├── onboarding-documents.js
    │   │   │   │   ├── peso-format.js
    │   │   │   │   └── rich-text.js
    │   │   │   ├── pages/
    │   │   │   │   ├── dashboard.jsx
    │   │   │   │   ├── accounts/
    │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   ├── __sections/
    │   │   │   │   │   │   ├── ask-ai-section.jsx
    │   │   │   │   │   │   ├── sidebar-section.jsx
    │   │   │   │   │   │   ├── sub-sidebar-section.jsx
    │   │   │   │   │   │   └── topbar-section.jsx
    │   │   │   │   │   ├── _administrator/
    │   │   │   │   │   │   ├── activities/
    │   │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   │   ├── _components/
    │   │   │   │   │   │   │   │   ├── activity-poll-card.jsx
    │   │   │   │   │   │   │   │   └── post-interaction-panel.jsx
    │   │   │   │   │   │   │   ├── _section/
    │   │   │   │   │   │   │   │   ├── header-section.jsx
    │   │   │   │   │   │   │   │   └── tabs-section.jsx
    │   │   │   │   │   │   │   ├── company_gallery/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── card-uploaded-image-section.jsx
    │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       ├── search-section.jsx
    │   │   │   │   │   │   │   │       └── upload-image-section.jsx
    │   │   │   │   │   │   │   ├── company_newsfeed/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── announcements-section.jsx
    │   │   │   │   │   │   │   │       ├── company-features-section.jsx
    │   │   │   │   │   │   │   │       ├── news-section-card.jsx
    │   │   │   │   │   │   │   │       ├── recent-activity-section.jsx
    │   │   │   │   │   │   │   │       └── view-news-section.jsx
    │   │   │   │   │   │   │   ├── department_showcase/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── birthday-edit-message-tab.jsx
    │   │   │   │   │   │   │   │       ├── birthday-publish-tab.jsx
    │   │   │   │   │   │   │   │       ├── create-birthday-post.jsx
    │   │   │   │   │   │   │   │       ├── create-floor-activities-section.jsx
    │   │   │   │   │   │   │   │       ├── filter-work-anniversary-section.jsx
    │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       ├── send-anniversary-email-section.jsx
    │   │   │   │   │   │   │   │       ├── upcoming-birthday-section.jsx
    │   │   │   │   │   │   │   │       ├── view-birthday-section.jsx
    │   │   │   │   │   │   │   │       └── work-anniversary-section.jsx
    │   │   │   │   │   │   │   ├── events_calendar/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── event-card-section.jsx
    │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       └── year-timeline-section.jsx
    │   │   │   │   │   │   │   ├── home/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── create-post-card-section.jsx
    │   │   │   │   │   │   │   │       ├── delete-post-section.jsx
    │   │   │   │   │   │   │   │       ├── edit-post-modal.jsx
    │   │   │   │   │   │   │   │       ├── post-action-menu.jsx
    │   │   │   │   │   │   │   │       ├── post-card-modal-section.jsx
    │   │   │   │   │   │   │   │       ├── post-card-section.jsx
    │   │   │   │   │   │   │   │       ├── post-view-modal.jsx
    │   │   │   │   │   │   │   │       └── upcoming-event-section.jsx
    │   │   │   │   │   │   │   ├── poll_analytics/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   ├── id/
    │   │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   │   ├── poll-info-section.jsx
    │   │   │   │   │   │   │   │   │   ├── poll-results-section.jsx
    │   │   │   │   │   │   │   │   │   ├── vote-records-section.jsx
    │   │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │   │       └── header-section.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       ├── poll-stats-card.jsx
    │   │   │   │   │   │   │   │       ├── poll-table-section.jsx
    │   │   │   │   │   │   │   │       ├── pool-card-section.jsx
    │   │   │   │   │   │   │   │       └── search-section.jsx
    │   │   │   │   │   │   │   └── post_event_survey/
    │   │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │   │       ├── id/
    │   │   │   │   │   │   │       │   ├── page.jsx
    │   │   │   │   │   │   │       │   └── sections/
    │   │   │   │   │   │   │       │       ├── employee-answer-viewer.jsx
    │   │   │   │   │   │   │       │       ├── header-section.jsx
    │   │   │   │   │   │   │       │       ├── pagination-section.jsx
    │   │   │   │   │   │   │       │       ├── progress-bar-section.jsx
    │   │   │   │   │   │   │       │       ├── questions-section.jsx
    │   │   │   │   │   │   │       │       ├── responses-section.jsx
    │   │   │   │   │   │   │       │       ├── sentiment-overview-section.jsx
    │   │   │   │   │   │   │       │       ├── summary-card-section.jsx
    │   │   │   │   │   │   │       │       ├── survey-form-section.jsx
    │   │   │   │   │   │   │       │       └── survey-info-section.jsx
    │   │   │   │   │   │   │       └── sections/
    │   │   │   │   │   │   │           ├── card-section.jsx
    │   │   │   │   │   │   │           ├── create-survey-section.jsx
    │   │   │   │   │   │   │           ├── delete-survey-section.jsx
    │   │   │   │   │   │   │           ├── duplicate-survey-section.jsx
    │   │   │   │   │   │   │           ├── edit-survey-section.jsx
    │   │   │   │   │   │   │           ├── header-section.jsx
    │   │   │   │   │   │   │           ├── open-survey-section.jsx
    │   │   │   │   │   │   │           ├── search-section.jsx
    │   │   │   │   │   │   │           ├── survey-actions-section.jsx
    │   │   │   │   │   │   │           └── table-section.jsx
    │   │   │   │   │   │   ├── asset_inventory/
    │   │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   │   ├── _sections/
    │   │   │   │   │   │   │   │   └── header-section.jsx
    │   │   │   │   │   │   │   ├── assets/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── dashboard/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── card-section.jsx
    │   │   │   │   │   │   │   │       └── header-section.jsx
    │   │   │   │   │   │   │   ├── device_return/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── devices/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── item_request/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── liability_form/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── monitors/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── other_assets/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── parts_and_accessories/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── peripherals/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── purchase_request/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── report/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── request_asset/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   └── system_unit/
    │   │   │   │   │   │   │       └── page.jsx
    │   │   │   │   │   │   ├── e_store/
    │   │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   │   ├── _sections/
    │   │   │   │   │   │   │   │   ├── header-section.jsx
    │   │   │   │   │   │   │   │   └── statistic-card-section.jsx
    │   │   │   │   │   │   │   ├── analytics/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── item-type-card-section.jsx
    │   │   │   │   │   │   │   │       └── redeemed-item-sections.jsx
    │   │   │   │   │   │   │   ├── redemption_history/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       └── redemption-table-section.jsx
    │   │   │   │   │   │   │   ├── rewards_item/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── add-reward-section.jsx
    │   │   │   │   │   │   │   │       ├── delete-reward-section.jsx
    │   │   │   │   │   │   │   │       ├── edit-reward-section.jsx
    │   │   │   │   │   │   │   │       ├── reward-card-section.jsx
    │   │   │   │   │   │   │   │       ├── search-section.jsx
    │   │   │   │   │   │   │   │       └── view-reward-modal-section.jsx
    │   │   │   │   │   │   │   └── stock/
    │   │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │   │       └── sections/
    │   │   │   │   │   │   │           ├── card-section.jsx
    │   │   │   │   │   │   │           ├── header-section.jsx
    │   │   │   │   │   │   │           ├── pagination-section.jsx
    │   │   │   │   │   │   │           └── stock-table-section.jsx
    │   │   │   │   │   │   ├── finance/
    │   │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   │   ├── dashboard/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── expenses/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── reports/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   └── revenue/
    │   │   │   │   │   │   │       └── page.jsx
    │   │   │   │   │   │   ├── human_resources/
    │   │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   │   ├── 201Files/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── drawer-section.jsx
    │   │   │   │   │   │   │   │       ├── files-table-section.jsx
    │   │   │   │   │   │   │   │       ├── pagination-section.jsx
    │   │   │   │   │   │   │   │       ├── search-section.jsx
    │   │   │   │   │   │   │   │       └── table-section.jsx
    │   │   │   │   │   │   │   ├── _section/
    │   │   │   │   │   │   │   │   ├── header-section.jsx
    │   │   │   │   │   │   │   │   └── tabs-section.jsx
    │   │   │   │   │   │   │   ├── acknowledgements/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── add-acknowledgement-section.jsx
    │   │   │   │   │   │   │   │       ├── add-sub-acknowledgement-section.jsx
    │   │   │   │   │   │   │   │       ├── card-acknowledgement-section.jsx
    │   │   │   │   │   │   │   │       ├── sidebar-tabs-section.jsx
    │   │   │   │   │   │   │   │       └── sidetabs.jsx
    │   │   │   │   │   │   │   ├── disciplinary_records/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── employee_movements/
    │   │   │   │   │   │   │   │   ├── _sections/
    │   │   │   │   │   │   │   │   │   └── tabs-section.jsx
    │   │   │   │   │   │   │   │   ├── change_form/
    │   │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │   │       ├── change-form-details-section.jsx
    │   │   │   │   │   │   │   │   │       ├── change-form-table-section.jsx
    │   │   │   │   │   │   │   │   │       ├── create-ecf-section.jsx
    │   │   │   │   │   │   │   │   │       └── pagination-section.jsx
    │   │   │   │   │   │   │   │   ├── evaluation/
    │   │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   │   └── promotions/
    │   │   │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │   │   │       └── _sections/
    │   │   │   │   │   │   │   │           ├── applicant-table-section.jsx
    │   │   │   │   │   │   │   │           └── pagination-section.jsx
    │   │   │   │   │   │   │   ├── employees/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   ├── _sections/
    │   │   │   │   │   │   │   │   │   ├── acknowledgements-list-section.jsx
    │   │   │   │   │   │   │   │   │   ├── add-attrition-section.jsx
    │   │   │   │   │   │   │   │   │   ├── add-employee-section.jsx
    │   │   │   │   │   │   │   │   │   ├── attrition.jsx
    │   │   │   │   │   │   │   │   │   ├── card-acknowledgement-section.jsx
    │   │   │   │   │   │   │   │   │   ├── employee-action-section.jsx
    │   │   │   │   │   │   │   │   │   ├── employee-information-form.jsx
    │   │   │   │   │   │   │   │   │   ├── employees-table-section.jsx
    │   │   │   │   │   │   │   │   │   ├── pagination-section.jsx
    │   │   │   │   │   │   │   │   │   ├── personal-information-form.jsx
    │   │   │   │   │   │   │   │   │   ├── search-section.jsx
    │   │   │   │   │   │   │   │   │   ├── show-employee-details-section.jsx
    │   │   │   │   │   │   │   │   │   └── update-employee.jsx
    │   │   │   │   │   │   │   │   └── id/
    │   │   │   │   │   │   │   │       ├── layout.jsx
    │   │   │   │   │   │   │   │       ├── 201_files/
    │   │   │   │   │   │   │   │       │   ├── page.jsx
    │   │   │   │   │   │   │   │       │   └── _sections/
    │   │   │   │   │   │   │   │       │       ├── add-document-section.jsx
    │   │   │   │   │   │   │   │       │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       │       ├── input-file.jsx
    │   │   │   │   │   │   │   │       │       ├── re-upload-document-section.jsx
    │   │   │   │   │   │   │   │       │       ├── stats-section.jsx
    │   │   │   │   │   │   │   │       │       └── table-section.jsx
    │   │   │   │   │   │   │   │       ├── _sections/
    │   │   │   │   │   │   │   │       │   ├── header-section.jsx
    │   │   │   │   │   │   │   │       │   ├── tabs-section.jsx
    │   │   │   │   │   │   │   │       │   └── verify-section.jsx
    │   │   │   │   │   │   │   │       ├── contract/
    │   │   │   │   │   │   │   │       │   ├── page.jsx
    │   │   │   │   │   │   │   │       │   └── _sections/
    │   │   │   │   │   │   │   │       │       ├── agree-section.jsx
    │   │   │   │   │   │   │   │       │       ├── full-time-probationary-contract-section.jsx
    │   │   │   │   │   │   │   │       │       ├── part-time-probationary-contract-section.jsx
    │   │   │   │   │   │   │   │       │       └── send-contract-section.jsx
    │   │   │   │   │   │   │   │       ├── evaluations/
    │   │   │   │   │   │   │   │       │   ├── page.jsx
    │   │   │   │   │   │   │   │       │   ├── _sections/
    │   │   │   │   │   │   │   │       │   │   └── table-section.jsx
    │   │   │   │   │   │   │   │       │   └── id/
    │   │   │   │   │   │   │   │       │       ├── page.jsx
    │   │   │   │   │   │   │   │       │       └── _sections/
    │   │   │   │   │   │   │   │       │           ├── evaluation-form-section.jsx
    │   │   │   │   │   │   │   │       │           └── result-form-section.jsx
    │   │   │   │   │   │   │   │       ├── onboarding/
    │   │   │   │   │   │   │   │       │   ├── page.jsx
    │   │   │   │   │   │   │   │       │   └── _sections/
    │   │   │   │   │   │   │   │       │       ├── acknowledgment-of-code-of-conduct-and-discipline-section.jsx
    │   │   │   │   │   │   │   │       │       ├── attendance-policy-section.jsx
    │   │   │   │   │   │   │   │       │       ├── certification-of-use-and-service-of-electronic-data-and-electronic-data-signature-section.jsx
    │   │   │   │   │   │   │   │       │       ├── code-of-conduct-and-discipline-section.jsx
    │   │   │   │   │   │   │   │       │       ├── confidentiality-and-non-competition-agreement-section.jsx
    │   │   │   │   │   │   │   │       │       ├── house-rules-and-regulations-general-rules-section.jsx
    │   │   │   │   │   │   │   │       │       ├── job-description-form-section.jsx
    │   │   │   │   │   │   │   │       │       ├── locker-policy-and-agreement-section.jsx
    │   │   │   │   │   │   │   │       │       ├── mobile-phone-and-dress-code-policy-section.jsx
    │   │   │   │   │   │   │   │       │       ├── onboarding-checklist-section.jsx
    │   │   │   │   │   │   │   │       │       ├── pre-employment-check-list-section.jsx
    │   │   │   │   │   │   │   │       │       ├── stepper-section.jsx
    │   │   │   │   │   │   │   │       │       └── training-agreement-section.jsx
    │   │   │   │   │   │   │   │       └── personal_information/
    │   │   │   │   │   │   │   │           └── page.jsx
    │   │   │   │   │   │   │   ├── leads/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   ├── _sections/
    │   │   │   │   │   │   │   │   │   ├── create-lead-section.jsx
    │   │   │   │   │   │   │   │   │   ├── edit-lead-section.jsx
    │   │   │   │   │   │   │   │   │   └── table-section.jsx
    │   │   │   │   │   │   │   │   └── id/
    │   │   │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │   │   │       └── _sections/
    │   │   │   │   │   │   │   │           ├── add-member-section.jsx
    │   │   │   │   │   │   │   │           ├── back-section.jsx
    │   │   │   │   │   │   │   │           ├── header-section.jsx
    │   │   │   │   │   │   │   │           └── table-section.jsx
    │   │   │   │   │   │   │   ├── pooling/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── pagination-section.jsx
    │   │   │   │   │   │   │   │       ├── pooling-table-section.jsx
    │   │   │   │   │   │   │   │       ├── search-pooling-section.jsx
    │   │   │   │   │   │   │   │       └── send-job-offer-section.jsx
    │   │   │   │   │   │   │   ├── separation/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── card-separation-section.jsx
    │   │   │   │   │   │   │   │       └── documents-list-section.jsx
    │   │   │   │   │   │   │   └── sourcing/
    │   │   │   │   │   │   │       ├── accounts/
    │   │   │   │   │   │   │       │   ├── page.jsx
    │   │   │   │   │   │   │       │   └── _sections/
    │   │   │   │   │   │   │       │       ├── add-account-section.jsx
    │   │   │   │   │   │   │       │       ├── edit-account-section.jsx
    │   │   │   │   │   │   │       │       └── table-section.jsx
    │   │   │   │   │   │   │       └── departments/
    │   │   │   │   │   │   │           ├── page.jsx
    │   │   │   │   │   │   │           └── _sections/
    │   │   │   │   │   │   │               ├── add-department-section.jsx
    │   │   │   │   │   │   │               ├── edit-department-section.jsx
    │   │   │   │   │   │   │               └── table-section.jsx
    │   │   │   │   │   │   ├── rnr/
    │   │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   │   ├── challenges_events/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   ├── dashboard/
    │   │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │   │       ├── all-challenges-section.jsx
    │   │   │   │   │   │   │   │   │       ├── archive-section.jsx
    │   │   │   │   │   │   │   │   │       ├── challenges-grid-section.jsx
    │   │   │   │   │   │   │   │   │       ├── delete-challenge-section.jsx
    │   │   │   │   │   │   │   │   │       ├── edit-challenge-section.jsx
    │   │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │   │       └── share-challenge-section.jsx
    │   │   │   │   │   │   │   │   ├── leaderboard/
    │   │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │   │       ├── filter-challenge-leaderboard-section.jsx
    │   │   │   │   │   │   │   │   │       ├── participant-table-section.jsx
    │   │   │   │   │   │   │   │   │       └── top-participant-section.jsx
    │   │   │   │   │   │   │   │   ├── manage/
    │   │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   │   ├── participants/
    │   │   │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │   │       ├── challenge-table-section.jsx
    │   │   │   │   │   │   │   │   │       └── participants-table-section.jsx
    │   │   │   │   │   │   │   │   ├── report/
    │   │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │   │       ├── export-challenge-section.jsx
    │   │   │   │   │   │   │   │   │       └── historical-trend-section.jsx
    │   │   │   │   │   │   │   │   ├── sections/
    │   │   │   │   │   │   │   │   │   ├── create-new-challenge.jsx
    │   │   │   │   │   │   │   │   │   └── tabs-section.jsx
    │   │   │   │   │   │   │   │   └── submissions/
    │   │   │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │   │   │       └── sections/
    │   │   │   │   │   │   │   │           ├── card-section.jsx
    │   │   │   │   │   │   │   │           ├── decline-section.jsx
    │   │   │   │   │   │   │   │           ├── proof-section.jsx
    │   │   │   │   │   │   │   │           ├── search-section.jsx
    │   │   │   │   │   │   │   │           └── table-section.jsx
    │   │   │   │   │   │   │   ├── employee_profiles/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── card-secrtion.jsx
    │   │   │   │   │   │   │   │       ├── search-section.jsx
    │   │   │   │   │   │   │   │       └── table-section.jsx
    │   │   │   │   │   │   │   ├── my_profile/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── peer_recognition/
    │   │   │   │   │   │   │   │   ├── award-category-section.jsx
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── certificate-reward-section.jsx
    │   │   │   │   │   │   │   │       ├── recognize-someone-sections.jsx
    │   │   │   │   │   │   │   │       └── reward-card-section.jsx
    │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │       └── header-section.jsx
    │   │   │   │   │   │   ├── talent_acquisition/
    │   │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   │   ├── _sections/
    │   │   │   │   │   │   │   │   ├── header-section.jsx
    │   │   │   │   │   │   │   │   └── tabs-section.jsx
    │   │   │   │   │   │   │   ├── ai_interviews/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       └── table-section.jsx
    │   │   │   │   │   │   │   ├── applicants/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── action-list-section.jsx
    │   │   │   │   │   │   │   │       ├── applicant-table-section.jsx
    │   │   │   │   │   │   │   │       ├── card-applicant-section.jsx
    │   │   │   │   │   │   │   │       ├── card-section.jsx
    │   │   │   │   │   │   │   │       ├── delete-applicant-section.jsx
    │   │   │   │   │   │   │   │       ├── edit-status-section.jsx
    │   │   │   │   │   │   │   │       ├── export-applicant-section.jsx
    │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       ├── pagination-section.jsx
    │   │   │   │   │   │   │   │       ├── resend-job-offer-section.jsx
    │   │   │   │   │   │   │   │       ├── search-section.jsx
    │   │   │   │   │   │   │   │       ├── search-status-section.jsx
    │   │   │   │   │   │   │   │       ├── send-documents-section.jsx
    │   │   │   │   │   │   │   │       ├── send-job-offer-section.jsx
    │   │   │   │   │   │   │   │       ├── show-applicant-details-section.jsx
    │   │   │   │   │   │   │   │       ├── statuses-card-section.jsx
    │   │   │   │   │   │   │   │       └── transfer-applicant.jsx
    │   │   │   │   │   │   │   ├── calendar/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── add-interviewer-section.jsx
    │   │   │   │   │   │   │   │       ├── calendar-section.jsx
    │   │   │   │   │   │   │   │       ├── edit-interview-section.jsx
    │   │   │   │   │   │   │   │       ├── interviewer-section.jsx
    │   │   │   │   │   │   │   │       └── selected-date-section.jsx
    │   │   │   │   │   │   │   ├── dashboard/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── card-section.jsx
    │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       ├── quick-actions-section.jsx
    │   │   │   │   │   │   │   │       ├── recent-activity-section.jsx
    │   │   │   │   │   │   │   │       └── top-perfoming-job-section.jsx
    │   │   │   │   │   │   │   ├── erp/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── erp-table-section.jsx
    │   │   │   │   │   │   │   │       ├── export-erp-section.jsx
    │   │   │   │   │   │   │   │       ├── pagination-section.jsx
    │   │   │   │   │   │   │   │       └── search-section.jsx
    │   │   │   │   │   │   │   ├── interviews/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── calendar-section.jsx
    │   │   │   │   │   │   │   │       ├── cancel-interview-section.jsx
    │   │   │   │   │   │   │   │       ├── card-section.jsx
    │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       ├── list-applicant-section.jsx
    │   │   │   │   │   │   │   │       ├── mark-complete-section.jsx
    │   │   │   │   │   │   │   │       ├── reschedule-section.jsx
    │   │   │   │   │   │   │   │       ├── search-section.jsx
    │   │   │   │   │   │   │   │       └── view-details-section.jsx
    │   │   │   │   │   │   │   ├── job_offers/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── pagination-section.jsx
    │   │   │   │   │   │   │   │       ├── resend-job-offer-section.jsx
    │   │   │   │   │   │   │   │       ├── search-section.jsx
    │   │   │   │   │   │   │   │       ├── send-documents-section.jsx
    │   │   │   │   │   │   │   │       ├── show-details-section.jsx
    │   │   │   │   │   │   │   │       └── table-section.jsx
    │   │   │   │   │   │   │   ├── job_posting/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   ├── _sections/
    │   │   │   │   │   │   │   │   │   ├── delete-job-section.jsx
    │   │   │   │   │   │   │   │   │   ├── export-job-posting.jsx
    │   │   │   │   │   │   │   │   │   ├── header-section.jsx
    │   │   │   │   │   │   │   │   │   ├── job-posting-card-section.jsx
    │   │   │   │   │   │   │   │   │   ├── share-job-section.jsx
    │   │   │   │   │   │   │   │   │   ├── table-section.jsx
    │   │   │   │   │   │   │   │   │   └── view-job-posting-details-section.jsx
    │   │   │   │   │   │   │   │   └── id/
    │   │   │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │   │   │       └── _sections/
    │   │   │   │   │   │   │   │           ├── back-section.jsx
    │   │   │   │   │   │   │   │           ├── edit-status-section.jsx
    │   │   │   │   │   │   │   │           ├── header-section.jsx
    │   │   │   │   │   │   │   │           ├── resend-job-offer-section.jsx
    │   │   │   │   │   │   │   │           ├── search-section.jsx
    │   │   │   │   │   │   │   │           ├── send-documents-section.jsx
    │   │   │   │   │   │   │   │           ├── send-job-offer-section.jsx
    │   │   │   │   │   │   │   │           ├── show-applicant-details-section.jsx
    │   │   │   │   │   │   │   │           ├── table-section.jsx
    │   │   │   │   │   │   │   │           └── transfer-applicant.jsx
    │   │   │   │   │   │   │   └── job_requisition/
    │   │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │   │       └── _sections/
    │   │   │   │   │   │   │           ├── approve-job-requisition-section.jsx
    │   │   │   │   │   │   │           ├── card-section.jsx
    │   │   │   │   │   │   │           ├── declined-job-requisition-section.jsx
    │   │   │   │   │   │   │           ├── header-section.jsx
    │   │   │   │   │   │   │           ├── job-requisition-card-section.jsx
    │   │   │   │   │   │   │           ├── job-requisition-logs-section.jsx
    │   │   │   │   │   │   │           ├── job-requisition-section.jsx
    │   │   │   │   │   │   │           ├── search-section.jsx
    │   │   │   │   │   │   │           └── view-job-requisition-section.jsx
    │   │   │   │   │   │   ├── ticketing/
    │   │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   │   ├── _sections/
    │   │   │   │   │   │   │   │   └── create-ticket-section.jsx
    │   │   │   │   │   │   │   ├── categories/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── accordions-section.jsx
    │   │   │   │   │   │   │   │       ├── create-category-section.jsx
    │   │   │   │   │   │   │   │       ├── delete-category-section.jsx
    │   │   │   │   │   │   │   │       ├── edit-category-section.jsx
    │   │   │   │   │   │   │   │       └── header-section.jsx
    │   │   │   │   │   │   │   ├── dashboard/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── card-section.jsx
    │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       ├── issues-by-category-section.jsx
    │   │   │   │   │   │   │   │       ├── most-common-issue-section.jsx
    │   │   │   │   │   │   │   │       ├── recents-tickets-section.jsx
    │   │   │   │   │   │   │   │       └── recurring-issue-section.jsx
    │   │   │   │   │   │   │   ├── my_tickets/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── cards-section.jsx
    │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       ├── search-section.jsx
    │   │   │   │   │   │   │   │       └── ticket-cards-section.jsx
    │   │   │   │   │   │   │   ├── reports/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │   │       ├── bar-graph-section.jsx
    │   │   │   │   │   │   │   │       ├── card-section.jsx
    │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       ├── line-graph-section.jsx
    │   │   │   │   │   │   │   │       ├── pie-graph-section.jsx
    │   │   │   │   │   │   │   │       ├── priority-breakdown-section.jsx
    │   │   │   │   │   │   │   │       ├── search-section.jsx
    │   │   │   │   │   │   │   │       └── table-section.jsx
    │   │   │   │   │   │   │   └── tickets/
    │   │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │   │       └── _sections/
    │   │   │   │   │   │   │           ├── cards-section.jsx
    │   │   │   │   │   │   │           ├── header-section.jsx
    │   │   │   │   │   │   │           ├── search-section.jsx
    │   │   │   │   │   │   │           └── ticket-table-section.jsx
    │   │   │   │   │   │   ├── time_keeping/
    │   │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   │   ├── attendance/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   ├── component/
    │   │   │   │   │   │   │   │   │   ├── attendance-action.jsx
    │   │   │   │   │   │   │   │   │   └── table-columns-component.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── attendance-logs.jsx
    │   │   │   │   │   │   │   │       ├── correction-section.jsx
    │   │   │   │   │   │   │   │       ├── filter-log-date.jsx
    │   │   │   │   │   │   │   │       ├── leave-section.jsx
    │   │   │   │   │   │   │   │       ├── overtime-section.jsx
    │   │   │   │   │   │   │   │       └── timekeeping-section.jsx
    │   │   │   │   │   │   │   ├── attendance_settings/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   ├── components/
    │   │   │   │   │   │   │   │   │   └── day-attendance-components.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       └── set-attendance-section.jsx
    │   │   │   │   │   │   │   ├── calendar_settings/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections.jsx/
    │   │   │   │   │   │   │   │       ├── calendar-section.jsx
    │   │   │   │   │   │   │   │       └── selected-date-section.jsx
    │   │   │   │   │   │   │   ├── dashboard/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       └── employee-details-section.jsx
    │   │   │   │   │   │   │   ├── employee_calendar/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       └── employee-calendar-section.jsx
    │   │   │   │   │   │   │   ├── reports/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   └── time_sheets/
    │   │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │   │       └── sections/
    │   │   │   │   │   │   │           └── time-sheet-section.jsx
    │   │   │   │   │   │   └── users/
    │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │       └── sections/
    │   │   │   │   │   │           ├── add-department-section.jsx
    │   │   │   │   │   │           ├── add-site-section.jsx
    │   │   │   │   │   │           ├── add-user-section.jsx
    │   │   │   │   │   │           ├── applicants-table-section.jsx
    │   │   │   │   │   │           ├── department-table-section.jsx
    │   │   │   │   │   │           ├── departments-section.jsx
    │   │   │   │   │   │           ├── roles-section.jsx
    │   │   │   │   │   │           ├── sites-section.jsx
    │   │   │   │   │   │           ├── user-management-section.jsx
    │   │   │   │   │   │           ├── users-section.jsx
    │   │   │   │   │   │           └── view-applicant-section.jsx
    │   │   │   │   │   ├── _applicant/
    │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │       ├── sidebar-section.jsx
    │   │   │   │   │   │       └── topbar-section.jsx
    │   │   │   │   │   ├── _employee/
    │   │   │   │   │   │   ├── hr_services/
    │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   ├── loan/
    │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   ├── payroll/
    │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   ├── rewards_store/
    │   │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   ├── redemption_history/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── rewards_items/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │       └── header-section.jsx
    │   │   │   │   │   │   ├── rnr/
    │   │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   ├── challenge_event/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── challenge-card-section.jsx
    │   │   │   │   │   │   │   │       ├── challenge-event-section.jsx
    │   │   │   │   │   │   │   │       ├── challenge-flow-approved-section.jsx
    │   │   │   │   │   │   │   │       ├── challenge-flow-details-section.jsx
    │   │   │   │   │   │   │   │       ├── challenge-flow-next-steps-section.jsx
    │   │   │   │   │   │   │   │       ├── challenge-flow-progress-section.jsx
    │   │   │   │   │   │   │   │       ├── challenge-flow-rules-section.jsx
    │   │   │   │   │   │   │   │       ├── challenge-flow-section.jsx
    │   │   │   │   │   │   │   │       ├── challenge-flow-submit-section.jsx
    │   │   │   │   │   │   │   │       ├── challenge-flow-submitted-section.jsx
    │   │   │   │   │   │   │   │       ├── challenge-guide-section.jsx
    │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       └── manager-view-section.jsx
    │   │   │   │   │   │   │   ├── employee_profiles/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   ├── my_profile/
    │   │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │   │   │       └── points-summary-section.jsx
    │   │   │   │   │   │   │   ├── peer_recognition/
    │   │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │   │       └── header-section.jsx
    │   │   │   │   │   │   └── timekeeping/
    │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │       ├── component/
    │   │   │   │   │   │       │   └── table-columns-component.jsx
    │   │   │   │   │   │       └── sections/
    │   │   │   │   │   │           ├── attendance-logs.jsx
    │   │   │   │   │   │           ├── filter-log-date.jsx
    │   │   │   │   │   │           ├── overtime-section.jsx
    │   │   │   │   │   │           └── timekeeping-section.jsx
    │   │   │   │   │   ├── ai_interview/
    │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │       ├── avatar-interface.jsx
    │   │   │   │   │   │       ├── avatar-model.jsx
    │   │   │   │   │   │       ├── camera-preview.jsx
    │   │   │   │   │   │       ├── get-started.jsx
    │   │   │   │   │   │       └── useInterviewLogic.js
    │   │   │   │   │   ├── dashboard/
    │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │       ├── anncouncement-card-section.jsx
    │   │   │   │   │   │       ├── card-section.jsx
    │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │       ├── import-csv.jsx
    │   │   │   │   │   │       ├── quick-action-section.jsx
    │   │   │   │   │   │       ├── recent-activity-card-section.jsx
    │   │   │   │   │   │       ├── top-news-card-section.jsx
    │   │   │   │   │   │       └── upcoming-card-section.jsx
    │   │   │   │   │   ├── job_offers/
    │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   ├── id/
    │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   ├── _sections/
    │   │   │   │   │   │   │   │   ├── accept-job-offer-section.jsx
    │   │   │   │   │   │   │   │   └── verify-section.jsx
    │   │   │   │   │   │   │   └── jo_documents/
    │   │   │   │   │   │   │       ├── agent-document.jsx
    │   │   │   │   │   │   │       └── approved-jo-section.jsx
    │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │       ├── search-section.jsx
    │   │   │   │   │   │       └── table-section.jsx
    │   │   │   │   │   ├── job_openings/
    │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │       ├── job-posting-card-section.jsx
    │   │   │   │   │   │       ├── search-section.jsx
    │   │   │   │   │   │       ├── share-job-section.jsx
    │   │   │   │   │   │       └── view-job-posting-section.jsx
    │   │   │   │   │   ├── messages/
    │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │       └── message-section.jsx
    │   │   │   │   │   ├── my_applications/
    │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │       ├── add-interview-schedule.jsx
    │   │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │   │       ├── show-applicant-details-section.jsx
    │   │   │   │   │   │       └── table-section.jsx
    │   │   │   │   │   ├── my_documents/
    │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   ├── _sections/
    │   │   │   │   │   │   │   ├── add-document-section.jsx
    │   │   │   │   │   │   │   ├── header-section.jsx
    │   │   │   │   │   │   │   ├── input-file.jsx
    │   │   │   │   │   │   │   ├── re-upload-document-section.jsx
    │   │   │   │   │   │   │   ├── sample.jsx
    │   │   │   │   │   │   │   ├── search-section.jsx
    │   │   │   │   │   │   │   ├── stats-section.jsx
    │   │   │   │   │   │   │   └── table-section.jsx
    │   │   │   │   │   │   ├── acknowledgements/
    │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │       ├── accept-acknowledgement-section.jsx
    │   │   │   │   │   │   │       ├── add-acknowledgement-section.jsx
    │   │   │   │   │   │   │       ├── sidebar-tabs-section.jsx
    │   │   │   │   │   │   │       └── sidetabs.jsx
    │   │   │   │   │   │   └── employee_change_form/
    │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │       └── _sections/
    │   │   │   │   │   │           ├── accept-change-form.jsx
    │   │   │   │   │   │           └── change-form-section.jsx
    │   │   │   │   │   ├── my_profile/
    │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   ├── sections/
    │   │   │   │   │   │   │   ├── address-information-section.jsx
    │   │   │   │   │   │   │   ├── document-section.jsx
    │   │   │   │   │   │   │   ├── emergency-contact-section.jsx
    │   │   │   │   │   │   │   ├── employee-information-section.jsx
    │   │   │   │   │   │   │   ├── header-section.jsx
    │   │   │   │   │   │   │   ├── info-tabs-section.jsx
    │   │   │   │   │   │   │   ├── no-signature-notification.jsx
    │   │   │   │   │   │   │   ├── personal-info-section.jsx
    │   │   │   │   │   │   │   ├── professional-section.jsx
    │   │   │   │   │   │   │   ├── skills-section.jsx
    │   │   │   │   │   │   │   ├── upload-profile-section.jsx
    │   │   │   │   │   │   │   └── working-experience-section.jsx
    │   │   │   │   │   │   └── signature/
    │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │       └── _sections/
    │   │   │   │   │   │           └── signature-pad.jsx
    │   │   │   │   │   ├── my_requisition/
    │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │       └── header-section.jsx
    │   │   │   │   │   ├── my_team/
    │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   ├── _sections/
    │   │   │   │   │   │   │   ├── add-member-section.jsx
    │   │   │   │   │   │   │   ├── header-section.jsx
    │   │   │   │   │   │   │   ├── sidebar-section.jsx
    │   │   │   │   │   │   │   └── tabs-section.jsx
    │   │   │   │   │   │   ├── assessment_process/
    │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   ├── dashboard/
    │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │       ├── card-evaluation-section.jsx
    │   │   │   │   │   │   │       ├── card-section.jsx
    │   │   │   │   │   │   │       └── pending-evaluation-section.jsx
    │   │   │   │   │   │   ├── employee_status_changes/
    │   │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │   │       └── employee-change-form-section.jsx
    │   │   │   │   │   │   └── team/
    │   │   │   │   │   │       ├── page.jsx
    │   │   │   │   │   │       └── _sections/
    │   │   │   │   │   │           ├── card-team-section.jsx
    │   │   │   │   │   │           ├── table-section.jsx
    │   │   │   │   │   │           └── team-list-section.jsx
    │   │   │   │   │   ├── off_boarding_documents/
    │   │   │   │   │   │   ├── exit-clearance-page.jsx
    │   │   │   │   │   │   ├── exit-survey-page.jsx
    │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │       ├── exit-clearance-form.jsx
    │   │   │   │   │   │       └── exit-survey-form.jsx
    │   │   │   │   │   ├── performance_evaluation/
    │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   └── _sections/
    │   │   │   │   │   │       └── create-pef-section.jsx
    │   │   │   │   │   ├── performance_management/
    │   │   │   │   │   │   ├── layout.jsx
    │   │   │   │   │   │   ├── _sections/
    │   │   │   │   │   │   │   └── sidebar-section.jsx
    │   │   │   │   │   │   ├── corrective_action/
    │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   ├── dashboard/
    │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   └── reach/
    │   │   │   │   │   │       └── page.jsx
    │   │   │   │   │   ├── privacy_policy/
    │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   ├── settings/
    │   │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   │   ├── Partials/
    │   │   │   │   │   │   │   ├── DeleteUserForm.jsx
    │   │   │   │   │   │   │   ├── UpdatePasswordForm.jsx
    │   │   │   │   │   │   │   └── UpdateProfileInformationForm.jsx
    │   │   │   │   │   │   └── sections/
    │   │   │   │   │   │       ├── change-password-section.jsx
    │   │   │   │   │   │       └── header-section.jsx
    │   │   │   │   │   └── setup/
    │   │   │   │   │       ├── _sections/
    │   │   │   │   │       │   ├── form-section.jsx
    │   │   │   │   │       │   └── header-section.jsx
    │   │   │   │   │       ├── setup1/
    │   │   │   │   │       │   ├── page.jsx
    │   │   │   │   │       │   └── _sections/
    │   │   │   │   │       │       └── form-section.jsx
    │   │   │   │   │       └── setup2/
    │   │   │   │   │           ├── page.jsx
    │   │   │   │   │           └── _sections/
    │   │   │   │   │               └── form-section.jsx
    │   │   │   │   ├── auth/
    │   │   │   │   │   ├── forgot_password/
    │   │   │   │   │   │   ├── reset/
    │   │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   │   └── verify/
    │   │   │   │   │   │       └── page.jsx
    │   │   │   │   │   ├── login/
    │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   ├── register/
    │   │   │   │   │   │   └── page.jsx
    │   │   │   │   │   └── verify/
    │   │   │   │   │       └── page.jsx
    │   │   │   │   ├── error/
    │   │   │   │   │   └── page.jsx
    │   │   │   │   ├── landing_page/
    │   │   │   │   │   ├── page.jsx
    │   │   │   │   │   └── sections/
    │   │   │   │   │       ├── about-section.jsx
    │   │   │   │   │       ├── career-section.jsx
    │   │   │   │   │       ├── contact-section.jsx
    │   │   │   │   │       ├── developer-section.jsx
    │   │   │   │   │       ├── divider-section.jsx
    │   │   │   │   │       ├── footer-section.jsx
    │   │   │   │   │       ├── header-section.jsx
    │   │   │   │   │       ├── hero-section.jsx
    │   │   │   │   │       ├── nav-footer-section.jsx
    │   │   │   │   │       ├── progress-scroll-section.jsx
    │   │   │   │   │       ├── services-section.jsx
    │   │   │   │   │       └── testimonial-section.jsx
    │   │   │   │   └── talent/
    │   │   │   │       ├── layout.jsx
    │   │   │   │       ├── location.jsx
    │   │   │   │       ├── notification.jsx
    │   │   │   │       ├── page.jsx
    │   │   │   │       └── _sections/
    │   │   │   │           ├── address-information-section.jsx
    │   │   │   │           ├── application-footer-section.jsx
    │   │   │   │           ├── final-review-section.jsx
    │   │   │   │           ├── job-posting-section.jsx
    │   │   │   │           ├── personal-information-section.jsx
    │   │   │   │           ├── set-schedule-section.jsx
    │   │   │   │           ├── talent-application-form.jsx
    │   │   │   │           └── upload-cv-section.jsx
    │   │   │   ├── redux/
    │   │   │   │   ├── activities-slice.js
    │   │   │   │   ├── activities-thunk.js
    │   │   │   │   ├── app-slice.js
    │   │   │   │   ├── app-thunk.js
    │   │   │   │   ├── applicant-slice.js
    │   │   │   │   ├── applicant-thunk.js
    │   │   │   │   ├── department-slice.js
    │   │   │   │   ├── department-thunk.js
    │   │   │   │   ├── employee-relation-slice.js
    │   │   │   │   ├── employee-relation-thunk.js
    │   │   │   │   ├── engagement-gallery-slice.js
    │   │   │   │   ├── engagement-slice.js
    │   │   │   │   ├── engagement-thunk.js
    │   │   │   │   ├── job-posting-slice.js
    │   │   │   │   ├── job-posting-thunk.js
    │   │   │   │   ├── job-requisition-slice.js
    │   │   │   │   ├── job-requisition-thunk.js
    │   │   │   │   ├── post-event-survey-slice.js
    │   │   │   │   ├── site-slice.js
    │   │   │   │   ├── talent-acquisition-slice.js
    │   │   │   │   ├── talent-acquisition-thunk.js
    │   │   │   │   ├── tickets-slice.js
    │   │   │   │   └── tickets-thunk.js
    │   │   │   ├── services/
    │   │   │   │   ├── account-contract-service.js
    │   │   │   │   ├── account-service.js
    │   │   │   │   ├── activities-service.js
    │   │   │   │   ├── ai-service.js
    │   │   │   │   ├── app-service.js
    │   │   │   │   ├── applicants-service.js
    │   │   │   │   ├── attendance-employee-settings-service.js
    │   │   │   │   ├── attendance-service.js
    │   │   │   │   ├── department-service.js
    │   │   │   │   ├── documents-services.js
    │   │   │   │   ├── employee-change-form-service.js
    │   │   │   │   ├── employee-relation-service.js
    │   │   │   │   ├── engagement-gallery-service.js
    │   │   │   │   ├── engagement-service.js
    │   │   │   │   ├── er-leaders-service.js
    │   │   │   │   ├── holiday-service.js
    │   │   │   │   ├── human-resources-service.js
    │   │   │   │   ├── job-applicant-schedule-service.js
    │   │   │   │   ├── job-application-service.js
    │   │   │   │   ├── job-interviewer-schedule-service.js
    │   │   │   │   ├── job-offer-service.js
    │   │   │   │   ├── job-posting-service.js
    │   │   │   │   ├── job-requisition-logs.js
    │   │   │   │   ├── job-requisition-service.js
    │   │   │   │   ├── leave-service.js
    │   │   │   │   ├── overtime-service.js
    │   │   │   │   ├── performance-evaluation-service.js
    │   │   │   │   ├── post-event-survey-service.js
    │   │   │   │   ├── site-service.js
    │   │   │   │   ├── tickets-service.js
    │   │   │   │   └── user-service.js
    │   │   │   └── store/
    │   │   │       └── store.js
    │   │   ├── Components/
    │   │   │   ├── ApplicationLogo.jsx
    │   │   │   ├── Checkbox.jsx
    │   │   │   ├── DangerButton.jsx
    │   │   │   ├── DarkVeil.jsx
    │   │   │   ├── Dropdown.jsx
    │   │   │   ├── InputError.jsx
    │   │   │   ├── InputLabel.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   ├── NavLink.jsx
    │   │   │   ├── PrimaryButton.jsx
    │   │   │   ├── ResponsiveNavLink.jsx
    │   │   │   ├── SecondaryButton.jsx
    │   │   │   └── TextInput.jsx
    │   │   ├── Layouts/
    │   │   │   ├── AuthenticatedLayout.jsx
    │   │   │   └── GuestLayout.jsx
    │   │   ├── lib/
    │   │   │   └── utils.js
    │   │   └── Pages/
    │   │       ├── Dashboard.jsx
    │   │       ├── Welcome.jsx
    │   │       ├── Auth/
    │   │       │   ├── ConfirmPassword.jsx
    │   │       │   ├── ForgotPassword.jsx
    │   │       │   ├── Login.jsx
    │   │       │   ├── Register.jsx
    │   │       │   ├── ResetPassword.jsx
    │   │       │   └── VerifyEmail.jsx
    │   │       └── Profile/
    │   │           ├── Edit.jsx
    │   │           └── Partials/
    │   │               ├── DeleteUserForm.jsx
    │   │               ├── UpdatePasswordForm.jsx
    │   │               └── UpdateProfileInformationForm.jsx
    │   └── views/
    │       ├── app.blade.php
    │       └── emails/
    │           ├── account/
    │           │   └── account_created.blade.php
    │           ├── auth/
    │           │   └── otp.blade.php
    │           ├── empireonehealth/
    │           │   ├── booking-confirmation.blade.php
    │           │   ├── booking-notification.blade.php
    │           │   ├── consultation-confirmation.blade.php
    │           │   └── consultation-notification.blade.php
    │           ├── engagement/
    │           │   ├── recognition-received.blade.php
    │           │   └── work-anniversary.blade.php
    │           ├── human_resources/
    │           │   ├── exit-clearance-interview.blade.php
    │           │   └── exit-survey.blade.php
    │           └── job_requisition/
    │               ├── contract-signing.blade.php
    │               ├── employee-change-form.blade.php
    │               ├── job-offer-accepted.blade.php
    │               ├── job-offer-applicant-rejected.blade.php
    │               ├── job-offer-declined.blade.php
    │               ├── job-offer.blade.php
    │               ├── on-boarding-documents.blade.php
    │               ├── pre-employment.blade.php
    │               └── upload-instructions.blade.php
    ├── routes/
    │   ├── api.php
    │   ├── auth.php
    │   ├── console.php
    │   └── web.php
    └── tests/
        ├── Pest.php
        ├── TestCase.php
        ├── Feature/
        │   ├── ExampleTest.php
        │   ├── ProfileTest.php
        │   └── Auth/
        │       ├── AuthenticationTest.php
        │       ├── EmailVerificationTest.php
        │       ├── PasswordConfirmationTest.php
        │       ├── PasswordResetTest.php
        │       ├── PasswordUpdateTest.php
        │       └── RegistrationTest.php
        └── Unit/
            └── ExampleTest.php


---
## 3. ⚙️ Backend Engineer — Laravel Rules

### Routing
* `web.php` — **Inertia renders only** (`Inertia::render()`). No JSON responses here.
* `api.php` — **JSON API endpoints only**. Consumed by Axios services (`resources/js/app/services/*-service.js`). Must return `response()->json()`.

### Controllers & Validation
* Always generate Form Requests: `php artisan make:request`.
* Controllers must be thin — delegate business logic to Service classes when complexity warrants it.
* Return consistent HTTP status codes: `200`, `201`, `204`, `422`, `403`, `404`.

### Response Formatting
* All JSON responses **must** use Eloquent API Resources.
* Wrap collections in a resource collection; never return raw `->get()` arrays.
* Paginated responses must include `meta` and `links` keys via `->paginate()`.

### Security
* Protect all routes with the appropriate **Laravel Policy** or **Middleware**.
* Every new resource route must have a corresponding Policy method (`viewAny`, `view`, `create`, `update`, `delete`).
* Sanctum: Axios handles credentials and CSRF via session cookies with `X-Requested-With: XMLHttpRequest` (configured in `resources/js/bootstrap.js`).
* Never expose model primary keys in URLs where a UUID or slug can be used instead.

### Database
* Migrations must be reversible — always implement the `down()` method.
* Index foreign keys and any column used in `WHERE` clauses.
* Use `$fillable` (not `$guarded`) on all models for explicit mass-assignment protection.

---

## 4. 🖥️ Frontend Engineer — React / Redux Rules

### Component Architecture
* **Pages** (`resources/js/app/pages/`) are route entry points resolved dynamically in `app.jsx` (`./app/pages/${name}.jsx`). They orchestrate data fetching (dispatching thunks) and pass props down.
* **Sections** (`_sections/` or `sections/`) handle layout and sub-feature logic for a specific page.
* **Reusable UI Components** (`resources/js/app/_components/`) are stateless, reusable presentation primitives. They must **never** connect to Redux or trigger API calls directly.
  > ⚠️ **MANDATORY:** Always reuse existing components from `resources/js/app/_components/`. Do NOT recreate:
  > `accordion.jsx`, `alert.jsx`, `badge.jsx`, `button.jsx`, `card.jsx`, `checkbox.jsx`, `confirmation.jsx`, `details-card.jsx`, `drawer.jsx`, `dropdown.jsx`, `image-upload.jsx`, `indicator.jsx`, `input-search.jsx`, `input.jsx`, `loading-page.jsx`, `loading-state.jsx`, `modal.jsx`, `multi-select.jsx`, `pagination.jsx`, `pdf-loader.jsx`, `progressbar.jsx`, `radio.jsx`, `select.jsx`, `skeleton.jsx`, `stepper.jsx`, `table.jsx`, `tabs.jsx`, `textarea.jsx`, `time-picker.jsx`, `tooltip.jsx`, `wysiwyg.jsx`.

### State Management (Slice + Thunk + Service Architecture)
* **1. Services Layer** (`resources/js/app/services/*-service.js`):
  * Pure async functions that execute HTTP requests using `axios`.
  * Return response data directly (`return (await axios.get(...)).data;`).
  * Never dispatch Redux actions or hold state in services.
* **2. Async Thunks** (`resources/js/app/redux/*-thunk.js`):
  * Async action creators receiving `(dispatch, getState)`.
  * Call the respective service function, handle async errors, and dispatch slice actions on success:
    ```javascript
    export function get_items_thunk() {
        return async function (dispatch, getState) {
            const result = await get_items_service();
            dispatch(itemsSlice.actions.setItems(result.data));
        };
    }
    ```
* **3. Slices** (`resources/js/app/redux/*-slice.js`):
  * Defined with Redux Toolkit `createSlice({ name, initialState, reducers })`.
  * Export synchronous action creators for the thunks and components to use.
* **4. Root Store** (`resources/js/app/store/store.js`):
  * All slice reducers must be registered in the central `configureStore` inside `store.js`.

### Navigation & Layouts
* All internal links must use `<Link href="...">` from `@inertiajs/react`. Never use raw `<a>` tags.
* All authenticated pages must use the layout wrapper pattern (`accounts/layout.jsx` or similar).

### Forms & Validation
* Form state can use local React state (`useState`) or `react-hook-form`.
* Full-page Inertia transitions (login, register) use `useForm` from `@inertiajs/react`.
* On `422` validation responses, extract field errors from `error.response?.data?.errors` and pass them to inline inputs.

---

## 5. 🎨 UI/UX Designer — Design System Rules

### Core Principles
1. **Clarity over cleverness** — UI should communicate intent instantly without relying on tooltips.
2. **Consistency** — Reuse before you create. **Always verify and reuse from `resources/js/app/_components/` before creating any new UI element.**
3. **Accessibility (a11y)** — All interactive elements must be keyboard-navigable and have appropriate ARIA labels.
4. **Feedback** — Every user action must produce visible feedback (loading state, alert modal, or toast).

### Visual Hierarchy
* Use Tailwind's spacing scale (`space-y-4`, `gap-6`) — avoid arbitrary pixel values.
* Limit font weights to 3 maximum per page: regular (400), medium (500), bold (700).
* Primary actions → filled button (`button.jsx`). Secondary → outlined/ghost. Destructive → red variant (`confirmation.jsx`).
* Page sections must have clear headings with supporting labels (`text-sm text-gray-500`).

### Interaction & Feedback
* Loading states are **mandatory** on operations with network latency. Use `skeleton.jsx` or `loading-state.jsx`.
* Modals (`modal.jsx` / Ant Design) must trap focus, be dismissible via `Escape`, and not stack more than 2 deep.
* Confirmation modals (`confirmation.jsx`) are mandatory for destructive actions (delete, revoke, terminate).
* Form validation errors must appear **inline** beneath the field (supported by `input.jsx`, `select.jsx`, `textarea.jsx`).
* Empty states must include an icon (`lucide-react`), heading, brief description, and a CTA.

## 6. 🧪 QA Engineer — Quality Assurance Protocol

The QA persona reviews all code **before** it is marked complete. Run through every checklist item. A failing check blocks submission.

### JavaScript Purity
- [ ] Is all code plain JavaScript? Reject if any TypeScript syntax (`: type`, `interface`, `<Generic>`) is found.

### Backend Integrity
- [ ] Does `web.php` contain **only** `Inertia::render()` calls?
- [ ] Does `api.php` contain **only** JSON API routes?
- [ ] Is there a Form Request for every POST/PUT endpoint?
- [ ] Is there a Policy protecting every new resource?
- [ ] Is there an Eloquent Resource wrapping every JSON response?
- [ ] Does every migration have a valid `down()` method?

### Frontend & Redux Integrity
- [ ] Are API calls isolated in `resources/js/app/services/*-service.js` using Axios?
- [ ] Do async thunks in `resources/js/app/redux/*-thunk.js` handle API execution and dispatch actions to slices?
- [ ] Are Laravel 422 validation errors extracted from `error.response?.data?.errors` and mapped to field-level UI inputs?
- [ ] Are all internal links using `<Link>` from `@inertiajs/react` (never `<a>` tags)?
- [ ] Is the Persistent Layout pattern applied on authenticated pages?
- [ ] Does **no** component in `resources/js/app/_components/` connect to Redux or trigger API calls?
- [ ] Did you check and reuse existing components in `resources/js/app/_components/` instead of duplicating them?

### Naming & Structure
- [ ] React components are PascalCase (e.g., `UserModal.jsx`)?
- [ ] Redux slices and thunks follow kebab-case (e.g., `applicant-slice.js`, `applicant-thunk.js`)?
- [ ] Axios services follow kebab-case (e.g., `applicants-service.js`)?
- [ ] Directories are kebab-case or underscore-prefixed per project pattern (e.g., `_components/`, `_sections/`)?
- [ ] New slice is registered in `resources/js/app/store/store.js`?

### UI/UX Quality
- [ ] Does every network operation have a visible loading state (`loading-state.jsx` or `skeleton.jsx`)?
- [ ] Does every destructive action have a confirmation modal (`confirmation.jsx`)?
- [ ] Are inline validation errors shown beneath each field on 422 responses?
- [ ] Does every empty list/table state have an informative message and a CTA?
- [ ] Are all interactive elements keyboard-accessible (Tab, Enter, Escape)?

### Security
- [ ] Is Sanctum authentication respected on API calls via Axios headers?
- [ ] Are no raw Eloquent arrays returned from the API (must use Resources)?
- [ ] Are primary keys avoided in routes where UUIDs or slugs can be used instead?

---

## 7. 🏗️ Execution Plan Requirement (Tech Lead)

**Before writing any code**, produce an Execution Plan and wait for approval. It must cover:

### Blueprint
List every file to be **created** or **modified** with its exact path and a one-line reason.

### Backend (⚙️ Backend Persona Leads)
* Migration: columns, indexes, foreign keys.
* Controller: method names, logic summary.
* Routes: which file (`web.php` or `api.php`), HTTP verb, URI, route name.
* Form Request: validation rules summary.
* Eloquent Resource: fields exposed.

### Security (⚙️ Backend Persona Leads)
* Which Policy or Middleware guards the new routes.
* Any auth guard (`sanctum`, `auth`, `guest`) applied.

### Redux Architecture (🖥️ Frontend Persona Leads)
* Service file in `resources/js/app/services/` (Axios API calls defined).
* Thunk file in `resources/js/app/redux/` (async orchestration and dispatch).
* Slice file in `resources/js/app/redux/` (initial state and reducers).
* Confirmation of slice registration in `resources/js/app/store/store.js`.

### UI Blueprint (🎨 Designer Persona Leads)
* Page structure and its `_sections/` breakdown in `resources/js/app/pages/`.
* Reusable components used from `resources/js/app/_components/` (e.g. `table.jsx`, `modal.jsx`, `button.jsx`, `input.jsx`).
* Ant Design or Lucide React icons used.
* Loading, empty, and error states defined.

---

## 8. 🏗️ Phase Logging — Dev Log Protocol (Mandatory)

At the end of **every phase**, create or append to a log file in `dev-logs/`. Do not ask — just write it and notify in chat.

**File naming:** `dev-logs/YYYY-MM-DD-[feature-name].md`

```markdown
### Phase [X]: [Brief summary]

- **Timestamp:** [Completion time]
- **Persona(s) Active:** [e.g., ⚙️ Backend + 🖥️ Frontend]
- **Files Modified/Created:**
  - `path/to/file.js` — Reason
- **Issues Encountered:** [Errors, logic gaps, missing imports — or "None."]
- **Resolution:** [How each issue was fixed]
- **QA Checklist Result:** [Pass / Fail — list any failing items]
- **Next Steps:** [What the next phase covers — awaiting approval]

> **Version Control:** Do NOT run `git add`, `git commit`, or any VCS commands. All commits are handled manually.

---

## 9. 🏗️ Naming Conventions (Strict)

| Type | File / Path Convention | Identifier / Function Convention | Actual Project Example |
|---|---|---|---|
| **Reusable UI Components** | `kebab-case.jsx` in `resources/js/app/_components/` | PascalCase component export | `button.jsx` (`Button`), `details-card.jsx` (`DetailsCard`) |
| **Page Route Files** | Always `page.jsx` in `resources/js/app/pages/.../` | PascalCase component export | `resources/js/app/pages/accounts/dashboard/page.jsx` |
| **Page Layout Files** | Always `layout.jsx` in `resources/js/app/pages/.../` | PascalCase component export | `resources/js/app/pages/accounts/layout.jsx` |
| **Page Sections** | `kebab-case.jsx` in `sections/` or `_sections/` | PascalCase component export | `event-card-section.jsx`, `personal-information-form.jsx` |
| **Page Route Folders** | `snake_case` (often role-prefixed) | URL segments | `_administrator/human_resources/`, `time_keeping/`, `post_event_survey/` |
| **Redux Slices** | `kebab-case-slice.js` in `resources/js/app/redux/` | `camelCaseSlice` | `job-posting-slice.js` (`jobPostingsSlice`), `applicant-slice.js` |
| **Redux Thunks** | `kebab-case-thunk.js` in `resources/js/app/redux/` | `snake_case_thunk` | `job-posting-thunk.js` (`get_job_postings_thunk`) |
| **API Services** | `kebab-case-service.js` in `resources/js/app/services/` | `snake_case_service` | `job-posting-service.js` (`create_job_posting_service`) |
| **Redux Root Store** | Fixed: `resources/js/app/store/store.js` | Default export `store` | `import store from "./app/store/store";` |
| **Laravel API Controllers** | `PascalCaseController.php` in `app/Http/Controllers/API/{Domain}/` | Method names: `camelCase` or `snake_case` | `API/Jobs/JobPostingController.php`, `API/Timekeeping/AttendanceController.php` |
| **Laravel Web Controllers** | `PascalCaseController.php` in `app/Http/Controllers/` | Method names: `camelCase` or `snake_case` | `DepartmentController.php`, `LocationController.php` |
| **Laravel Models** | PascalCase in `app/Models/` or `app/Models/{Domain}/` | Class name matches filename | `app/Models/Department.php`, `app/Models/Activities/ActivityPost.php` |
| **Database Migrations** | `YYYY_MM_DD_HHMMSS_action_table.php` | Anonymous migration class | `2026_01_19_024254_create_job_postings_table.php` |
---

## 10. 🏗️ Persona Activation Reference

Use this as a quick reference for which persona leads each task type.

| Task | Lead Persona | Supporting Persona |
|---|---|---|
| Database migration | ⚙️ Backend | 🏗️ Tech Lead |
| API route + controller | ⚙️ Backend | 🏗️ Tech Lead |
| Axios service (`services/*-service.js`) | 🖥️ Frontend | ⚙️ Backend |
| Async thunk (`redux/*-thunk.js`) | 🖥️ Frontend | ⚙️ Backend |
| Redux slice (`redux/*-slice.js`) | 🖥️ Frontend | — |
| Inertia page + layout (`pages/`) | 🖥️ Frontend | 🎨 Designer |
| Reusable UI component (`_components/`) | 🎨 Designer | 🖥️ Frontend |
| Form design + validation UX | 🎨 Designer | 🖥️ Frontend |
| Empty / loading / error states | 🎨 Designer | 🖥️ Frontend |
| Pre-submission review | 🧪 QA | All |
| Execution plan | 🏗️ Tech Lead | All |
| Dev log entry | 🏗️ Tech Lead | All |