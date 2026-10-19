import { createSlice } from "@reduxjs/toolkit";
import {
    approve_account_pending_thunk,
    decline_account_pending_thunk,
    submit_account_pending_thunk,
} from "./account-pending-thunk";

const accountPendingSlice = createSlice({
    name: "accountPendings",
    initialState: {
        isSubmitting: false,
        isSubmitted: false,
        approvingUuid: null,
        approvalError: null,
        approvalErrorUuid: null,
        decliningUuid: null,
        declineError: null,
        declineErrorUuid: null,
    },
    reducers: {
        reset_account_pending_submission: (state) => {
            state.isSubmitted = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submit_account_pending_thunk.pending, (state) => {
                state.isSubmitting = true;
                state.isSubmitted = false;
            })
            .addCase(submit_account_pending_thunk.fulfilled, (state) => {
                state.isSubmitting = false;
                state.isSubmitted = true;
            })
            .addCase(submit_account_pending_thunk.rejected, (state) => {
                state.isSubmitting = false;
            })
            .addCase(approve_account_pending_thunk.pending, (state, action) => {
                state.approvingUuid = action.meta.arg;
                state.approvalError = null;
                state.approvalErrorUuid = null;
            })
            .addCase(approve_account_pending_thunk.fulfilled, (state) => {
                state.approvingUuid = null;
                state.approvalError = null;
                state.approvalErrorUuid = null;
            })
            .addCase(approve_account_pending_thunk.rejected, (state, action) => {
                state.approvingUuid = null;
                state.approvalError =
                    action.payload?.message ||
                    "Unable to approve this account. Please try again.";
                state.approvalErrorUuid = action.meta.arg;
            })
            .addCase(decline_account_pending_thunk.pending, (state, action) => {
                state.decliningUuid = action.meta.arg;
                state.declineError = null;
                state.declineErrorUuid = null;
            })
            .addCase(decline_account_pending_thunk.fulfilled, (state) => {
                state.decliningUuid = null;
                state.declineError = null;
                state.declineErrorUuid = null;
            })
            .addCase(decline_account_pending_thunk.rejected, (state, action) => {
                state.decliningUuid = null;
                state.declineError =
                    action.payload?.message ||
                    "Unable to decline this registration. Please try again.";
                state.declineErrorUuid = action.meta.arg;
            });
    },
});

export const { reset_account_pending_submission } = accountPendingSlice.actions;

export default accountPendingSlice.reducer;
