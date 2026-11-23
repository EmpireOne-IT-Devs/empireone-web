import { createSlice } from "@reduxjs/toolkit";
import {
    create_asset_system_unit_thunk,
    get_asset_system_units_thunk,
} from "./asset-system-unit-thunk";

const initialState = {
    items: [],
    meta: null,
    stats: null,
    // The page loads on mount; starting as loading avoids a flash of the empty state.
    loading: true,
    error: null,
    saving: false,
    errors: {},
    saveError: null,
};

const assetSystemUnitsSlice = createSlice({
    name: "assetSystemUnits",
    initialState,
    reducers: {
        clearErrors(state) {
            state.errors = {};
            state.saveError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_asset_system_units_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_asset_system_units_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data ?? [];
                state.meta = action.payload.meta ?? null;
                state.stats = action.payload.stats ?? null;
            })
            .addCase(get_asset_system_units_thunk.rejected, (state, action) => {
                // A newer request replaced this one and reports its own result.
                if (action.meta.aborted) return;
                state.loading = false;
                state.error = action.payload?.message || "Unable to load system units.";
            })
            .addCase(create_asset_system_unit_thunk.pending, (state) => {
                state.saving = true;
                state.errors = {};
                state.saveError = null;
            })
            .addCase(create_asset_system_unit_thunk.fulfilled, (state) => {
                state.saving = false;
            })
            .addCase(create_asset_system_unit_thunk.rejected, (state, action) => {
                state.saving = false;
                state.errors = action.payload?.errors || {};
                state.saveError = action.payload?.message || "Unable to save the system unit.";
            });
    },
});

export const { clearErrors } = assetSystemUnitsSlice.actions;
export default assetSystemUnitsSlice.reducer;
