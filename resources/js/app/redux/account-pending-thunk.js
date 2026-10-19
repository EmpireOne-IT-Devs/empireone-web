import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    approve_account_pending_service,
    decline_account_pending_service,
    submit_account_pending_service,
} from "@/app/services/account-pending-service";

export const submit_account_pending_thunk = createAsyncThunk(
    "accountPendings/submit",
    async (data, { rejectWithValue }) => {
        try {
            return await submit_account_pending_service(data);
        } catch (error) {
            return rejectWithValue({
                message:
                    error.response?.data?.message ||
                    "Unable to submit your registration. Please try again.",
                errors: error.response?.data?.errors || {},
            });
        }
    },
);

export const approve_account_pending_thunk = createAsyncThunk(
    "accountPendings/approve",
    async (uuid, { rejectWithValue }) => {
        try {
            return await approve_account_pending_service(uuid);
        } catch (error) {
            return rejectWithValue({
                message:
                    error.response?.data?.message ||
                    "Unable to approve this account. Please try again.",
            });
        }
    },
);

export const decline_account_pending_thunk = createAsyncThunk(
    "accountPendings/decline",
    async (uuid, { rejectWithValue }) => {
        try {
            return await decline_account_pending_service(uuid);
        } catch (error) {
            return rejectWithValue({
                message:
                    error.response?.data?.message ||
                    "Unable to decline this registration. Please try again.",
            });
        }
    },
);
