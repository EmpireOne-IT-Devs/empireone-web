import { createSlice } from "@reduxjs/toolkit";

export const jobRequisitionSlice = createSlice({
    name: "jobRequisition",
    initialState: {
        job_requisitions: [],
        job_requisition: {},
    },
    reducers: {
        setJobRequisitions: (state, action) => {
            state.job_requisitions = action.payload;
        },
        setJobRequisition: (state, action) => {
            state.job_requisition = action.payload;
        },
    },
});
export const { setJobRequisitions, setJobRequisition } =
    jobRequisitionSlice.actions;

export default jobRequisitionSlice.reducer;
