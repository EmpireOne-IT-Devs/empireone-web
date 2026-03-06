import { createSlice } from "@reduxjs/toolkit";

export const jobRequisitionSlice = createSlice({
    name: "jobRequisition",
    initialState: {
        job_requisitions: [],
        job_requisition: {},
        stats: {
            total: 0,
            pending: 0,
            approved: 0,
            in_progress: 0,
            declined: 0,
        },
        search_job_requisition: [],
    },
    reducers: {
        setJobRequisitions: (state, action) => {
            state.job_requisitions = action.payload;
        },
        setJobRequisition: (state, action) => {
            state.job_requisition = action.payload;
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        setSearchJobRequisition: (state, action) => {
            state.search_job_requisition = action.payload;
        },
    },
});
export const {
    setJobRequisitions,
    setJobRequisition,
    setStats,
    setSearchJobRequisition,
} = jobRequisitionSlice.actions;

export default jobRequisitionSlice.reducer;
