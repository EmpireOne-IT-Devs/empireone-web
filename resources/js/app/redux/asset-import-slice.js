import { createSlice } from "@reduxjs/toolkit";
import {
    analyze_import_thunk,
    commit_import_thunk,
} from "./asset-import-thunk";

const initialState = {
    analyzing: false,
    committing: false,
    analysis: null,
    summary: null,
    error: null,
};

const assetImportSlice = createSlice({
    name: "assetImport",
    initialState,
    reducers: {
        clearImport(state) {
            state.analysis = null;
            state.summary = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(analyze_import_thunk.pending, (state) => {
                state.analyzing = true;
                state.error = null;
            })
            .addCase(analyze_import_thunk.fulfilled, (state, action) => {
                state.analyzing = false;
                state.analysis = action.payload;
            })
            .addCase(analyze_import_thunk.rejected, (state, action) => {
                state.analyzing = false;
                state.error = action.payload?.message || "Unable to analyze the file.";
            })
            .addCase(commit_import_thunk.pending, (state) => {
                state.committing = true;
                state.error = null;
            })
            .addCase(commit_import_thunk.fulfilled, (state, action) => {
                state.committing = false;
                state.summary = action.payload;
            })
            .addCase(commit_import_thunk.rejected, (state, action) => {
                state.committing = false;
                state.error = action.payload?.message || "Import failed.";
            });
    },
});

export const { clearImport } = assetImportSlice.actions;
export default assetImportSlice.reducer;
