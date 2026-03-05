import { createSlice } from "@reduxjs/toolkit";

export const jobPostingsSlice = createSlice({
    name: "job_postings",
    initialState: {
        job_postings: [],
        job_applications: [],
        job_application: {},
    },
    reducers: {
        setJobPostings: (state, action) => {
            state.job_postings = action.payload;
        },
        setJobApplications: (state, action) => {
            state.job_applications = action.payload;
        },
        setJobApplication: (state, action) => {
            state.job_application = action.payload;
        },
    },
});
export const { setJobPostings, setJobApplications, setJobApplication } =
    jobPostingsSlice.actions;

export default jobPostingsSlice.reducer;
