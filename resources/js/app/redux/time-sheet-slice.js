import { createSlice } from "@reduxjs/toolkit";
import {
    export_time_sheets_thunk,
    get_time_sheets_thunk,
} from "./time-sheet-thunk";

const emptySummary = {
    working_days: 0,
    present: 0,
    late: 0,
    overtime_hours: 0,
};

const timeSheetSlice = createSlice({
    name: "timeSheets",
    initialState: {
        items: [],
        meta: null,
        summary: emptySummary,
        isLoading: true,
        error: null,
        isExporting: false,
        exportError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(get_time_sheets_thunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(get_time_sheets_thunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.data;
                state.meta = action.payload.meta;
                state.summary = action.payload.summary ?? emptySummary;
            })
            .addCase(get_time_sheets_thunk.rejected, (state, action) => {
                state.isLoading = false;
                state.items = [];
                state.meta = null;
                state.summary = emptySummary;
                state.error =
                    action.payload?.message || "Unable to load time sheets.";
            })
            .addCase(export_time_sheets_thunk.pending, (state) => {
                state.isExporting = true;
                state.exportError = null;
            })
            .addCase(export_time_sheets_thunk.fulfilled, (state) => {
                state.isExporting = false;
            })
            .addCase(export_time_sheets_thunk.rejected, (state, action) => {
                state.isExporting = false;
                state.exportError =
                    action.payload?.errors?.end_date?.[0] ||
                    action.payload?.message ||
                    "Unable to export time sheets.";
            });
    },
});

export default timeSheetSlice.reducer;
