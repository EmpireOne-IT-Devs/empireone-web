import { createSlice } from "@reduxjs/toolkit";
import {
    create_asset_peripherals_thunk,
    delete_asset_peripherals_thunk,
    get_asset_peripherals_thunk,
    update_asset_peripherals_thunk,
} from "./asset-peripheral-thunk";

const initialState = {
    items: [],
    meta: null,
    loading: false,
    saving: false,
    errors: {},
    error: null,
};

const assetPeripheralsSlice = createSlice({
    name: "assetPeripherals",
    initialState,
    reducers: {
        clearErrors(state) {
            state.errors = {};
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_asset_peripherals_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_asset_peripherals_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data ?? [];
                state.meta = action.payload.meta ?? null;
            })
            .addCase(get_asset_peripherals_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })
            .addCase(create_asset_peripherals_thunk.pending, (state) => {
                state.saving = true;
                state.errors = {};
            })
            .addCase(create_asset_peripherals_thunk.fulfilled, (state) => {
                state.saving = false;
            })
            .addCase(create_asset_peripherals_thunk.rejected, (state, action) => {
                state.saving = false;
                state.errors = action.payload?.errors || {};
                state.error = action.payload?.message || null;
            })
            .addCase(update_asset_peripherals_thunk.pending, (state) => {
                state.saving = true;
                state.errors = {};
            })
            .addCase(update_asset_peripherals_thunk.fulfilled, (state) => {
                state.saving = false;
            })
            .addCase(update_asset_peripherals_thunk.rejected, (state, action) => {
                state.saving = false;
                state.errors = action.payload?.errors || {};
                state.error = action.payload?.message || null;
            })
            .addCase(delete_asset_peripherals_thunk.fulfilled, (state, action) => {
                state.items = state.items.filter((d) => d.id !== action.payload);
            });
    },
});

export const { clearErrors } = assetPeripheralsSlice.actions;
export default assetPeripheralsSlice.reducer;