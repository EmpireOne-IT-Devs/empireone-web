import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    create_asset_peripherals_service,
    delete_asset_peripherals_service,
    get_asset_peripherals_service,
    update_asset_peripherals_service,
} from "@/app/services/asset-peripheral-service";

const toError = (error, fallback) => ({
    message: error.response?.data?.message || fallback,
    errors: error.response?.data?.errors || {},
});

export const get_asset_peripherals_thunk = createAsyncThunk(
    "assetPeripherals/getAll",
    async (params, { rejectWithValue }) => {
        try {
            return await get_asset_peripherals_service(params);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to load items."));
        }
    },
);

export const create_asset_peripherals_thunk = createAsyncThunk(
    "assetPeripherals/create",
    async (data, { rejectWithValue }) => {
        try {
            return await create_asset_peripherals_service(data);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to save."));
        }
    },
);

export const update_asset_peripherals_thunk = createAsyncThunk(
    "assetPeripherals/update",
    async ({ uuid, data }, { rejectWithValue }) => {
        try {
            return await update_asset_peripherals_service(uuid, data);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to update."));
        }
    },
);

export const delete_asset_peripherals_thunk = createAsyncThunk(
    "assetPeripherals/delete",
    async (uuid, { rejectWithValue }) => {
        try {
            await delete_asset_peripherals_service(uuid);
            return uuid;
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to delete."));
        }
    },
);