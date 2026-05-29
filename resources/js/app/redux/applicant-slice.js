import { createSlice } from "@reduxjs/toolkit";
import { setJobPostings } from "./job-posting-slice";

export const applicantSlice = createSlice({
    name: "app",
    initialState: {
        job_offers: [],
        job_offer: {},
        documents: [],
        documents_stats: {},
        applications: [],
        search_documents: "",
    },
    reducers: {
        setJobOffers: (state, action) => {
            state.job_offers = action.payload;
        },
        setJobOffer: (state, action) => {
            state.job_offer = action.payload;
        },
        setDocuments: (state, action) => {
            state.documents = action.payload;
        },
        setDocumentStats: (state, action) => {
            state.documents_stats = action.payload;
        },
        setApplications: (state, action) => {
            state.applications = action.payload;
        },
        setSearchDocuments: (state, action) => {
            state.search_documents = action.payload;
        },
    },
});
export const { setJobOffers, setDocuments, setDocumentStats, setApplications, setJobOffer, setSearchDocuments } =
    applicantSlice.actions;

export default applicantSlice.reducer;
