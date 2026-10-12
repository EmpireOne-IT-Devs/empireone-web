import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    export_location_employees_service,
    get_location_employee_counts_service,
} from "@/app/services/location-employee-service";

function getErrorMessage(error) {
    return error.response?.data?.message || error.message || "Something went wrong.";
}

export const get_location_employee_counts_thunk = createAsyncThunk(
    "locationEmployees/getCounts",
    async (_, { rejectWithValue }) => {
        try {
            return await get_location_employee_counts_service();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

export const export_location_employees_thunk = createAsyncThunk(
    "locationEmployees/exportEmployees",
    async (locationId, { rejectWithValue }) => {
        try {
            const { blob, contentDisposition } =
                await export_location_employees_service(locationId);
            const filename = contentDisposition.match(/filename="?([^";]+)"?/i)?.[1];

            return {
                blob,
                filename: filename || `location-${locationId}-employees.csv`,
            };
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);
