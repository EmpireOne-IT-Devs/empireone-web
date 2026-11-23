import { createSlice } from "@reduxjs/toolkit";
import {
    create_asset_device_thunk,
    delete_asset_device_thunk,
    get_asset_devices_thunk,
    import_asset_devices_thunk,
    search_asset_inventory_thunk,
    update_asset_device_thunk,
} from "./asset-device-thunk";

const initialState = {
    inventory: { items: [], meta: null, loading: true, error: null, requestId: null },
    items: [],
    meta: null,
    stats: null,
    loading: false,
    saving: false,
    importing: false,
    importResult: null,
    errors: {},
    error: null,
};

const assetDevicesSlice = createSlice({
    name: "assetDevices",
    initialState,
    reducers: {
        clearImportResult(state) {
            state.importResult = null;
        },
        clearErrors(state) {
            state.errors = {};
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(search_asset_inventory_thunk.pending, (state, action) => {
                state.inventory.loading = true;
                state.inventory.error = null;
                state.inventory.requestId = action.meta.requestId;
            })
            .addCase(search_asset_inventory_thunk.fulfilled, (state, action) => {
                if (state.inventory.requestId !== action.meta.requestId) return;
                state.inventory = {
                    items: action.payload.data, meta: action.payload.meta,
                    loading: false, error: null, requestId: null,
                };
            })
            .addCase(search_asset_inventory_thunk.rejected, (state, action) => {
                if (state.inventory.requestId !== action.meta.requestId) return;
                state.inventory.requestId = null;
                if (action.meta.aborted) return;
                state.inventory.loading = false;
                state.inventory.error = action.payload ?? { message: "Unable to search inventory." };
            })
            .addCase(get_asset_devices_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_asset_devices_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data ?? [];
                state.meta = action.payload.meta ?? null;
                state.stats = action.payload.stats ?? null;
            })
            .addCase(get_asset_devices_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Unable to load devices.";
            })
            .addCase(create_asset_device_thunk.pending, (state) => {
                state.saving = true;
                state.errors = {};
            })
            .addCase(create_asset_device_thunk.fulfilled, (state) => {
                state.saving = false;
            })
            .addCase(create_asset_device_thunk.rejected, (state, action) => {
                state.saving = false;
                state.errors = action.payload?.errors || {};
                state.error = action.payload?.message || null;
            })
            .addCase(update_asset_device_thunk.pending, (state) => {
                state.saving = true;
                state.errors = {};
            })
            .addCase(update_asset_device_thunk.fulfilled, (state) => {
                state.saving = false;
            })
            .addCase(update_asset_device_thunk.rejected, (state, action) => {
                state.saving = false;
                state.errors = action.payload?.errors || {};
                state.error = action.payload?.message || null;
            })
            .addCase(delete_asset_device_thunk.fulfilled, (state, action) => {
                state.items = state.items.filter((d) => d.id !== action.payload);
            })
            .addCase(import_asset_devices_thunk.pending, (state) => {
                state.importing = true;
                state.importResult = null;
            })
            .addCase(import_asset_devices_thunk.fulfilled, (state, action) => {
                state.importing = false;
                state.importResult = { ok: true, ...action.payload };
            })
            .addCase(import_asset_devices_thunk.rejected, (state, action) => {
                state.importing = false;
                state.importResult = {
                    ok: false,
                    message: action.payload?.message || "Import failed.",
                    failed: action.payload?.failed || [],
                    partial: action.payload?.partial || null,
                };
            });
    },
});

export const { clearImportResult, clearErrors } = assetDevicesSlice.actions;
export default assetDevicesSlice.reducer;
