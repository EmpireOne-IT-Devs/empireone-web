import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    export_time_sheets_service,
    get_time_sheets_service,
} from "@/app/services/time-sheet-service";

// Blob responses hide the JSON error body until it is read as text.
async function readErrorBody(error) {
    const data = error.response?.data;

    if (data instanceof Blob) {
        try {
            return JSON.parse(await data.text());
        } catch {
            return {};
        }
    }

    return data || {};
}

export const get_time_sheets_thunk = createAsyncThunk(
    "timeSheets/get",
    async (params, { rejectWithValue }) => {
        try {
            return await get_time_sheets_service(params);
        } catch (error) {
            return rejectWithValue({
                status: error.response?.status,
                message:
                    error.response?.data?.message ||
                    "Unable to load time sheets.",
                errors: error.response?.data?.errors || {},
            });
        }
    },
);

export const export_time_sheets_thunk = createAsyncThunk(
    "timeSheets/export",
    async (params, { rejectWithValue }) => {
        try {
            const { blob, contentDisposition } =
                await export_time_sheets_service(params);
            const filename = contentDisposition.match(
                /filename="?([^";]+)"?/i,
            )?.[1];

            return { blob, filename: filename || "time-sheets.csv" };
        } catch (error) {
            const body = await readErrorBody(error);

            return rejectWithValue({
                status: error.response?.status,
                message: body.message || "Unable to export time sheets.",
                errors: body.errors || {},
            });
        }
    },
);
