import { createSlice } from "@reduxjs/toolkit";
import {
    approve_final_approval_thunk,
    batch_approve_final_approvals_thunk,
    decline_final_approval_thunk,
    get_final_approvals_thunk,
} from "./final-approval-thunk";

const finalApprovalSlice = createSlice({
    name: "finalApprovals",
    initialState: {
        items: [],
        meta: null,
        isLoading: true,
        isForbidden: false,
        error: null,
        isActing: false,
        actionError: null,
        actionErrors: {},
    },
    reducers: {
        clear_final_approval_action_error: (state) => {
            state.actionError = null;
            state.actionErrors = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_final_approvals_thunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.isForbidden = false;
            })
            .addCase(get_final_approvals_thunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(get_final_approvals_thunk.rejected, (state, action) => {
                state.isLoading = false;
                state.items = [];
                state.meta = null;
                state.isForbidden = action.payload?.status === 403;
                state.error = state.isForbidden
                    ? null
                    : action.payload?.message || "Unable to load approvals.";
            })
            .addCase(approve_final_approval_thunk.pending, (state) => {
                state.isActing = true;
                state.actionError = null;
            })
            .addCase(approve_final_approval_thunk.fulfilled, (state) => {
                state.isActing = false;
            })
            .addCase(approve_final_approval_thunk.rejected, (state, action) => {
                state.isActing = false;
                state.actionError =
                    action.payload?.message || "Unable to approve this request.";
            })
            .addCase(decline_final_approval_thunk.pending, (state) => {
                state.isActing = true;
                state.actionError = null;
                state.actionErrors = {};
            })
            .addCase(decline_final_approval_thunk.fulfilled, (state) => {
                state.isActing = false;
            })
            .addCase(decline_final_approval_thunk.rejected, (state, action) => {
                state.isActing = false;
                state.actionErrors = action.payload?.errors || {};
                state.actionError =
                    action.payload?.message || "Unable to decline this request.";
            })
            .addCase(batch_approve_final_approvals_thunk.pending, (state) => {
                state.isActing = true;
            })
            .addCase(batch_approve_final_approvals_thunk.fulfilled, (state) => {
                state.isActing = false;
            })
            .addCase(batch_approve_final_approvals_thunk.rejected, (state) => {
                state.isActing = false;
            });
    },
});

export const { clear_final_approval_action_error } =
    finalApprovalSlice.actions;

export default finalApprovalSlice.reducer;
