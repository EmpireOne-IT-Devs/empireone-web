import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    create_asset_monitors_service,
    delete_asset_monitors_service,
    get_asset_monitors_service,
    update_asset_monitors_service,
} from "@/app/services/asset-monitor-service";

const toError = (error, fallback) => ({
    message: error.response?.data?.message || fallback,
    errors: error.response?.data?.errors || {},
});

export const get_asset_monitors_thunk = createAsyncThunk(
    "assetMonitors/getAll",
    async (params, { rejectWithValue }) => {
        try {
            return await get_asset_monitors_service(params);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to load items."));
        }
    },
);

export const create_asset_monitors_thunk = createAsyncThunk(
    "assetMonitors/create",
    async (data, { rejectWithValue }) => {
        try {
            return await create_asset_monitors_service(data);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to save."));
        }
    },
);

export const update_asset_monitors_thunk = createAsyncThunk(
    "assetMonitors/update",
    async ({ uuid, data }, { rejectWithValue }) => {
        try {
            return await update_asset_monitors_service(uuid, data);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to update."));
        }
    },
);

export const delete_asset_monitors_thunk = createAsyncThunk(
    "assetMonitors/delete",
    async (uuid, { rejectWithValue }) => {
        try {
            await delete_asset_monitors_service(uuid);
            return uuid;
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to delete."));
        }
    },
);