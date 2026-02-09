import { createSlice } from "@reduxjs/toolkit";
import { get_job_requisitions_thunk } from "./job-requisition-thunk";

const initialState = {
    jobRequisitions: [],
    selectedJobRequisition: null,
    loading: false,
    error: null,
};

const jobRequisitionSlice = createSlice({
    name: "job_requisitions",
    initialState,
    reducers: {
        set_selected_job_requisition: (state, action) => {
            state.selectedJobRequisition = action.payload;
        },
        clear_selected_job_requisition: (state) => {
            state.selectedJobRequisition = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_job_requisitions_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_job_requisitions_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.jobRequisitions = action.payload;
            })
            .addCase(get_job_requisitions_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { set_selected_job_requisition, clear_selected_job_requisition } = jobRequisitionSlice.actions;

export default jobRequisitionSlice.reducer;