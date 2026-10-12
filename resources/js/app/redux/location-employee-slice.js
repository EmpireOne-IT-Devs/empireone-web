import { createSlice } from "@reduxjs/toolkit";
import {
    export_location_employees_thunk,
    get_location_employee_counts_thunk,
} from "./location-employee-thunk";

const initialState = {
    locations: [],
    loading: false,
    error: null,
    exporting: false,
    exportError: null,
};

const locationEmployeeSlice = createSlice({
    name: "locationEmployees",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(get_location_employee_counts_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_location_employee_counts_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.locations = action.payload;
            })
            .addCase(get_location_employee_counts_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unable to load location employee counts.";
            })
            .addCase(export_location_employees_thunk.pending, (state) => {
                state.exporting = true;
                state.exportError = null;
            })
            .addCase(export_location_employees_thunk.fulfilled, (state) => {
                state.exporting = false;
            })
            .addCase(export_location_employees_thunk.rejected, (state, action) => {
                state.exporting = false;
                state.exportError = action.payload || "Unable to export employees.";
            });
    },
});

export default locationEmployeeSlice.reducer;
