import { createSlice } from "@reduxjs/toolkit";
import {
    create_asset_parts_thunk,
    delete_asset_parts_thunk,
    get_asset_parts_thunk,
    update_asset_parts_thunk,
} from "./asset-part-thunk";

const initialState = {
    items: [],
    meta: null,
    loading: false,
    saving: false,
    errors: {},
    error: null,
};

const assetPartsSlice = createSlice({
    name: "assetParts",
    initialState,
    reducers: {
        clearErrors(state) {
            state.errors = {};
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_asset_parts_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_asset_parts_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data ?? [];
                state.meta = action.payload.meta ?? null;
            })
            .addCase(get_asset_parts_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })
            .addCase(create_asset_parts_thunk.pending, (state) => {
                state.saving = true;
                state.errors = {};
            })
            .addCase(create_asset_parts_thunk.fulfilled, (state) => {
                state.saving = false;
            })
            .addCase(create_asset_parts_thunk.rejected, (state, action) => {
                state.saving = false;
                state.errors = action.payload?.errors || {};
                state.error = action.payload?.message || null;
            })
            .addCase(update_asset_parts_thunk.pending, (state) => {
                state.saving = true;
                state.errors = {};
            })
            .addCase(update_asset_parts_thunk.fulfilled, (state) => {
                state.saving = false;
            })
            .addCase(update_asset_parts_thunk.rejected, (state, action) => {
                state.saving = false;
                state.errors = action.payload?.errors || {};
                state.error = action.payload?.message || null;
            })
            .addCase(delete_asset_parts_thunk.fulfilled, (state, action) => {
                state.items = state.items.filter((d) => d.id !== action.payload);
            });
    },
});

export const { clearErrors } = assetPartsSlice.actions;
export default assetPartsSlice.reducer;