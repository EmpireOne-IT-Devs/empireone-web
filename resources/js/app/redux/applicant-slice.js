import { createSlice } from "@reduxjs/toolkit";
import { setJobPostings } from "./job-posting-slice";

export const applicantSlice = createSlice({
    name: "app",
    initialState: {
        job_offers: [],
        documents: [],
        documents_stats: {},
    },
    reducers: {
        setJobOffers: (state, action) => {
            state.job_offers = action.payload;
        },
        setDocuments: (state, action) => {
            state.documents = action.payload;
        },
        setDocumentStats: (state, action) => {
            state.documents_stats = action.payload;
        },
    },
});
export const { setJobOffers, setDocuments, setDocumentStats } =
    applicantSlice.actions;

export default applicantSlice.reducer;
