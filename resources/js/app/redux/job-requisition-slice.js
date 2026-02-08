import { createSlice } from "@reduxjs/toolkit";
import {
    get_job_requisitions_thunk,
    create_job_requisition_thunk,
    update_job_requisition_thunk,
    delete_job_requisition_thunk,
} from "./job-requisition-thunk";

const initialState = {
    jobRequisitions: [],
    loading: false,
    error: null,
};

const jobRequisitionSlice = createSlice({
    name: "job_requisition",
    initialState,
    reducers: {
        resetJobRequisitionState: (state) => {
            state.jobRequisitions = [];
            state.loading = false;
            state.error = null;
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
                state.error = action.payload;
            })

            .addCase(create_job_requisition_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(create_job_requisition_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.jobRequisitions.unshift(action.payload);
            })
            .addCase(create_job_requisition_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

         
            .addCase(update_job_requisition_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(update_job_requisition_thunk.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.jobRequisitions.findIndex(
                    (req) => req.id === action.payload.id
                );
                if (index !== -1) {
                    state.jobRequisitions[index] = action.payload;
                }
            })
            .addCase(update_job_requisition_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

      
            .addCase(delete_job_requisition_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(delete_job_requisition_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.jobRequisitions = state.jobRequisitions.filter(
                    (req) => req.id !== action.payload
                );
            })
            .addCase(delete_job_requisition_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetJobRequisitionState } = jobRequisitionSlice.actions;
export default jobRequisitionSlice.reducer;