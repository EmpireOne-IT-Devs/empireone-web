import { configureStore } from "@reduxjs/toolkit";
import appSlice from "../redux/app-slice";
import jobPostingSlice from "../redux/job-posting-slice";
import departmentSlice from "../redux/department-slice";

const store = configureStore({
    reducer: {
        app: appSlice,
        job_postings: jobPostingSlice,
        departments: departmentSlice,
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
