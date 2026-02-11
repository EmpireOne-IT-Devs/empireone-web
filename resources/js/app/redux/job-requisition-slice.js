import { createSlice } from "@reduxjs/toolkit";

export const jobRequisitionSlice = createSlice({
    name: "jobRequisition",
    initialState: {
        job_requisitions: [],
    },
    reducers: {
        setJobRequisitions: (state, action) => {
            state.job_requisitions = action.payload;
        },
    },
});
export const { setJobRequisitions } = jobRequisitionSlice.actions;

export default jobRequisitionSlice.reducer;
