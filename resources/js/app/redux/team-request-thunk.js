import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    approve_team_request_service,
    decline_team_request_service,
    get_team_requests_service,
} from "@/app/services/team-request-service";

const toRejection = (error, fallback) => ({
    status: error.response?.status,
    message: error.response?.data?.message || fallback,
    errors: error.response?.data?.errors || {},
});

export const get_team_requests_thunk = createAsyncThunk(
    "teamRequests/get",
    async (params, { rejectWithValue }) => {
        try {
            return await get_team_requests_service(params);
        } catch (error) {
            return rejectWithValue(
                toRejection(error, "Unable to load team requests."),
            );
        }
    },
);

export const approve_team_request_thunk = createAsyncThunk(
    "teamRequests/approve",
    async ({ type, id }, { rejectWithValue }) => {
        try {
            return await approve_team_request_service(type, id);
        } catch (error) {
            return rejectWithValue(
                toRejection(error, "Unable to approve this request."),
            );
        }
    },
);

export const decline_team_request_thunk = createAsyncThunk(
    "teamRequests/decline",
    async ({ type, id, note }, { rejectWithValue }) => {
        try {
            return await decline_team_request_service(type, id, note);
        } catch (error) {
            return rejectWithValue(
                toRejection(error, "Unable to decline this request."),
            );
        }
    },
);

// Approves rows one by one so a single failure doesn't abort the rest.
export const batch_approve_team_requests_thunk = createAsyncThunk(
    "teamRequests/batchApprove",
    async ({ type, ids }) => {
        const results = await Promise.allSettled(
            ids.map((id) => approve_team_request_service(type, id)),
        );
        const approved = results.filter((r) => r.status === "fulfilled").length;
        return { approved, failed: ids.length - approved };
    },
);
