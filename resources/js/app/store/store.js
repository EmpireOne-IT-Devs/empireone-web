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
import locationEmployeeSlice from "../redux/location-employee-slice";
import accountPendingSlice from "../redux/account-pending-slice";
import teamRequestSlice from "../redux/team-request-slice";
import timeSheetSlice from "../redux/time-sheet-slice";
import assetDevicesSlice from "../redux/asset-device-slice";
import assetImportSlice from "../redux/asset-import-slice";
import assetMonitorsSlice from "../redux/asset-monitor-slice";
import assetPartsSlice from "../redux/asset-part-slice";
import assetOtherAssetsSlice from "../redux/asset-other-asset-slice";
import assetPeripheralsSlice from "../redux/asset-peripheral-slice";

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
        location_employees: locationEmployeeSlice,
        account_pendings: accountPendingSlice,
        team_requests: teamRequestSlice,
        time_sheets: timeSheetSlice,
        asset_devices: assetDevicesSlice,
        asset_import: assetImportSlice,
        asset_monitors: assetMonitorsSlice,
        asset_parts: assetPartsSlice,
        asset_other_assets: assetOtherAssetsSlice,
        asset_peripherals: assetPeripheralsSlice,
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
