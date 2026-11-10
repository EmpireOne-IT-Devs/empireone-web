import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    create_asset_other_assets_service,
    delete_asset_other_assets_service,
    get_asset_other_assets_service,
    update_asset_other_assets_service,
} from "@/app/services/asset-other-asset-service";

const toError = (error, fallback) => ({
    message: error.response?.data?.message || fallback,
    errors: error.response?.data?.errors || {},
});

export const get_asset_other_assets_thunk = createAsyncThunk(
    "assetOtherAssets/getAll",
    async (params, { rejectWithValue }) => {
        try {
            return await get_asset_other_assets_service(params);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to load items."));
        }
    },
);

export const create_asset_other_assets_thunk = createAsyncThunk(
    "assetOtherAssets/create",
    async (data, { rejectWithValue }) => {
        try {
            return await create_asset_other_assets_service(data);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to save."));
        }
    },
);

export const update_asset_other_assets_thunk = createAsyncThunk(
    "assetOtherAssets/update",
    async ({ uuid, data }, { rejectWithValue }) => {
        try {
            return await update_asset_other_assets_service(uuid, data);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to update."));
        }
    },
);

export const delete_asset_other_assets_thunk = createAsyncThunk(
    "assetOtherAssets/delete",
    async (uuid, { rejectWithValue }) => {
        try {
            await delete_asset_other_assets_service(uuid);
            return uuid;
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to delete."));
        }
    },
);