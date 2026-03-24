import { createSlice } from "@reduxjs/toolkit";
import { setJobPostings } from "./job-posting-slice";

export const applicantSlice = createSlice({
    name: "app",
    initialState: {
        job_offers: [],
    },
    reducers: {
        setJobOffers: (state, action) => {
            state.job_offers = action.payload;
        },
    },
});
export const { setJobOffers } = applicantSlice.actions;

export default applicantSlice.reducer;
