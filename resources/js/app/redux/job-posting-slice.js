import { createSlice } from "@reduxjs/toolkit";

export const jobPostingsSlice = createSlice({
    name: "job_postings",
    initialState: {
        job_postings: [],
        job_applications: [],
        job_application: {},
        applicants: [],
        search_applicant_status: {
            screening_status: "",
            interview_status: "",
            final_status: "",
        },
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
        setApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        setSearchApplicantStatus: (state, action) => {
            state.search_applicant_status = action.payload;
        },
    },
});
export const {
    setJobPostings,
    setJobApplications,
    setJobApplication,
    setApplicants,
    setSearchApplicantStatus
} = jobPostingsSlice.actions;

export default jobPostingsSlice.reducer;
