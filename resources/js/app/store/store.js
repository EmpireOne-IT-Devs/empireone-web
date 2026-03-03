import { configureStore } from "@reduxjs/toolkit";
import appSlice from "../redux/app-slice";
import jobPostingsSlice from "../redux/job-posting-slice";
import departmentSlice from "../redux/department-slice";
import siteSlice from "../redux/site-slice";
import  ticketsSlice  from "../redux/tickets-slice";
import jobRequisitionSlice  from "../redux/job-requisition-slice";

const store = configureStore({
    reducer: {
        app: appSlice,
        tickets:ticketsSlice,
        job_postings: jobPostingsSlice,
        departments: departmentSlice,
        sites: siteSlice,
        job_requisitions: jobRequisitionSlice,
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
