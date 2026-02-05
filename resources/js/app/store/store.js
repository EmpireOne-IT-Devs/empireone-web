import { configureStore } from "@reduxjs/toolkit";
import appSlice from "../redux/app-slice";
import jobPostingSlice from "../redux/job-posting-slice";
import departmentSlice from "../redux/department-slice";
import siteSlice from "../redux/site-slice";
import  ticketsSlice  from "../redux/tickets-slice";

const store = configureStore({
    reducer: {
        app: appSlice,
        tickets:ticketsSlice,
        job_postings: jobPostingSlice,
        departments: departmentSlice,
        sites: siteSlice,
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
