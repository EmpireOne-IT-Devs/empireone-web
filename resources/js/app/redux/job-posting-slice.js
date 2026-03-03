import { createSlice } from "@reduxjs/toolkit";

export const jobPostingsSlice = createSlice({
    name: "job_postings",
    initialState: {
        job_postings: [],
    },
    reducers: {
        setJobPostings: (state, action) => {
            state.job_postings = action.payload;
        },
    },
});
export const { setJobPostings } = jobPostingsSlice.actions;

export default jobPostingsSlice.reducer;
