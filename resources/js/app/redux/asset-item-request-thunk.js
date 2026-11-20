import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    create_asset_item_request_service,
    decide_asset_item_request_service,
    get_asset_item_request_lookups_service,
    get_asset_item_request_service,
    list_asset_item_requests_service,
} from "@/app/services/asset-item-request-service";

const toError = (error, fallback) => {
    const status = error.response?.status;
    const data = error.response?.data;
    return {
        status,
        message: status < 500 && typeof data?.message === "string" ? data.message : fallback,
        errors: status === 422 ? data?.errors ?? {} : {},
    };
};

export const list_asset_item_requests_thunk = createAsyncThunk(
    "assetItemRequests/list",
    async (params, { rejectWithValue, signal }) => {
        try {
            return await list_asset_item_requests_service(params, signal);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to load item requests. Please try again."));
        }
    },
);

export const search_asset_item_request_lookups_thunk = createAsyncThunk(
    "assetItemRequests/lookups",
    async (params, { rejectWithValue, signal }) => {
        try {
            return await get_asset_item_request_lookups_service(params, signal);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to load options. Please try again."));
        }
    },
);

export const create_asset_item_request_thunk = createAsyncThunk(
    "assetItemRequests/create",
    async (values, { rejectWithValue }) => {
        try {
            return await create_asset_item_request_service(values);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to create the item request. Please try again."));
        }
    },
);

export const get_asset_item_request_thunk = createAsyncThunk(
    "assetItemRequests/detail",
    async (uuid, { rejectWithValue, signal }) => {
        try {
            return await get_asset_item_request_service(uuid, signal);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to load this item request. Please try again."));
        }
    },
);

export const decide_asset_item_request_thunk = createAsyncThunk(
    "assetItemRequests/decide",
    async (input, { rejectWithValue }) => {
        try {
            return await decide_asset_item_request_service(input);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to save the decision. Please try again."));
        }
    },
);
