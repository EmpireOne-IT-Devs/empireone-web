import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    create_asset_system_unit_service,
    get_asset_system_units_service,
} from "@/app/services/asset-system-unit-service";

const toError = (error, fallback) => ({
    message: error.response?.data?.message || fallback,
    errors: error.response?.data?.errors || {},
});

export const get_asset_system_units_thunk = createAsyncThunk(
    "assetSystemUnits/getAll",
    async (params, { rejectWithValue, signal }) => {
        try {
            return await get_asset_system_units_service(params, signal);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to load system units."));
        }
    },
);

export const create_asset_system_unit_thunk = createAsyncThunk(
    "assetSystemUnits/create",
    async (data, { rejectWithValue }) => {
        try {
            return await create_asset_system_unit_service(data);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to save the system unit."));
        }
    },
);
