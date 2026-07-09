import { configureStore } from "@reduxjs/toolkit";
import appSlice from "../redux/app-slice";
import jobPostingsSlice from "../redux/job-posting-slice";
import departmentSlice from "../redux/department-slice";
import siteSlice from "../redux/site-slice";
import ticketsSlice from "../redux/tickets-slice";
import jobRequisitionSlice from "../redux/job-requisition-slice";
import applicantSlice from "../redux/applicant-slice";
import employeeRelationSlice from "../redux/employee-relation-slice";
import talentAcquisitionSlice from "../redux/talent-acquisition-slice";
import activitiesSlice from "../redux/activities-slice";
import postEventSurveySlice from "../redux/post-event-survey-slice";
import engagementSlice from "../redux/engagement-slice";

const store = configureStore({
    reducer: {
        app: appSlice,
        tickets: ticketsSlice,
        job_postings: jobPostingsSlice,
        departments: departmentSlice,
        sites: siteSlice,
        job_requisitions: jobRequisitionSlice,
        applicants: applicantSlice,
        human_resources: employeeRelationSlice,
        talent_acquisitions: talentAcquisitionSlice,
        activities: activitiesSlice,
        post_event_surveys: postEventSurveySlice,
        engagement: engagementSlice,
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
