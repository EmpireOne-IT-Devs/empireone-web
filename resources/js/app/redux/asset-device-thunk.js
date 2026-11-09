import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    create_asset_device_service,
    delete_asset_device_service,
    get_asset_devices_service,
    import_asset_devices_service,
    update_asset_device_service,
} from "@/app/services/asset-device-service";

const toError = (error, fallback) => ({
    message: error.response?.data?.message || fallback,
    errors: error.response?.data?.errors || {},
});

export const get_asset_devices_thunk = createAsyncThunk(
    "assetDevices/getAll",
    async (params, { rejectWithValue }) => {
        try {
            return await get_asset_devices_service(params);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to load devices."));
        }
    },
);

export const create_asset_device_thunk = createAsyncThunk(
    "assetDevices/create",
    async (data, { rejectWithValue }) => {
        try {
            return await create_asset_device_service(data);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to save the device."));
        }
    },
);

export const update_asset_device_thunk = createAsyncThunk(
    "assetDevices/update",
    async ({ uuid, data }, { rejectWithValue }) => {
        try {
            return await update_asset_device_service(uuid, data);
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to update the device."));
        }
    },
);

export const delete_asset_device_thunk = createAsyncThunk(
    "assetDevices/delete",
    async (uuid, { rejectWithValue }) => {
        try {
            await delete_asset_device_service(uuid);
            return uuid;
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to delete the device."));
        }
    },
);

const CHUNK_SIZE = 200;

export const import_asset_devices_thunk = createAsyncThunk(
    "assetDevices/import",
    async (rows, { rejectWithValue }) => {
        const summary = { imported: 0, skipped: [], failed: [] };
        const chunks = [];
        for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
            chunks.push(rows.slice(i, i + CHUNK_SIZE));
        }

        try {
            for (let c = 0; c < chunks.length; c++) {
                const result = await import_asset_devices_service(chunks[c]);
                summary.imported += result.imported ?? 0;
                summary.skipped.push(...(result.skipped ?? []));
            }
            return summary;
        } catch (error) {
            // 422 from the import endpoint carries per-row errors.
            const errors = error.response?.data?.errors || {};
            const failed = Object.entries(errors).map(([key, messages]) => ({
                row: key,
                errors: Array.isArray(messages) ? messages : [String(messages)],
            }));
            return rejectWithValue({
                message: error.response?.data?.message || "Import failed.",
                errors,
                failed,
                partial: summary,
            });
        }
    },
);
