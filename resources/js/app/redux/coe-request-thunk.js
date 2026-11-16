import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    create_coe_request_service,
    get_coe_requests_service,
    get_coe_status_service,
} from "@/app/services/coe-request-service";

const toError = (error, fallback) => ({
    status: error.response?.status,
    message: error.response?.data?.message || fallback,
    errors: error.response?.data?.errors || {},
    next_available_at: error.response?.data?.next_available_at ?? null,
});

export const get_coe_requests_thunk = createAsyncThunk(
    "coeRequests/getAll",
    async (params, { rejectWithValue }) => {
        try {
            return await get_coe_requests_service(params);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to load COE requests."));
        }
    },
);

export const get_coe_status_thunk = createAsyncThunk(
    "coeRequests/getStatus",
    async (_, { rejectWithValue }) => {
        try {
            return await get_coe_status_service();
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to check COE availability."));
        }
    },
);

export const create_coe_request_thunk = createAsyncThunk(
    "coeRequests/create",
    async (data, { rejectWithValue }) => {
        try {
            return await create_coe_request_service(data);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to record COE request."));
        }
    },
);
