import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    approve_final_approval_service,
    decline_final_approval_service,
    get_final_approvals_service,
} from "@/app/services/final-approval-service";

const toRejection = (error, fallback) => ({
    status: error.response?.status,
    message: error.response?.data?.message || fallback,
    errors: error.response?.data?.errors || {},
});

export const get_final_approvals_thunk = createAsyncThunk(
    "finalApprovals/get",
    async (params, { rejectWithValue }) => {
        try {
            return await get_final_approvals_service(params);
        } catch (error) {
            return rejectWithValue(
                toRejection(error, "Unable to load approvals."),
            );
        }
    },
);

export const approve_final_approval_thunk = createAsyncThunk(
    "finalApprovals/approve",
    async ({ type, id }, { rejectWithValue }) => {
        try {
            return await approve_final_approval_service(type, id);
        } catch (error) {
            return rejectWithValue(
                toRejection(error, "Unable to approve this request."),
            );
        }
    },
);

// Approves one at a time so a single failure doesn't abort the rest.
export const batch_approve_final_approvals_thunk = createAsyncThunk(
    "finalApprovals/batchApprove",
    async ({ type, ids }) => {
        let approved = 0;

        for (const id of ids) {
            try {
                await approve_final_approval_service(type, id);
                approved += 1;
            } catch {
                // counted as failed below
            }
        }

        return { approved, failed: ids.length - approved };
    },
);

export const decline_final_approval_thunk = createAsyncThunk(
    "finalApprovals/decline",
    async ({ type, id, note }, { rejectWithValue }) => {
        try {
            return await decline_final_approval_service(type, id, note);
        } catch (error) {
            return rejectWithValue(
                toRejection(error, "Unable to decline this request."),
            );
        }
    },
);
