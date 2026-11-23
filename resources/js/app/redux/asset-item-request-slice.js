import { createSlice } from "@reduxjs/toolkit";
import {
    create_asset_item_request_thunk,
    decide_asset_item_request_thunk,
    get_asset_item_request_thunk,
    list_asset_item_requests_thunk,
    search_asset_item_request_lookups_thunk,
} from "./asset-item-request-thunk";

const initialState = {
    list: { items: [], meta: null, loading: true, error: null, requestId: null },
    detail: { uuid: null, request: null, loading: false, error: null, requestId: null },
    lookups: {
        assets: [],
        employees: [],
        approvers: [],
        assetLoading: false,
        employeeLoading: false,
        assetError: null,
        employeeError: null,
        assetRequestId: null,
        employeeRequestId: null,
    },
    saving: false,
};

const assetItemRequestsSlice = createSlice({
    name: "assetItemRequests",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(list_asset_item_requests_thunk.pending, (state, { meta }) => {
                Object.assign(state.list, {
                    requestId: meta.requestId,
                    loading: true,
                    error: null,
                });
            })
            .addCase(list_asset_item_requests_thunk.fulfilled, (state, { meta, payload }) => {
                if (state.list.requestId !== meta.requestId) return;
                Object.assign(state.list, {
                    items: payload.data ?? [],
                    meta: payload.meta ?? null,
                    loading: false,
                    error: null,
                });
            })
            .addCase(list_asset_item_requests_thunk.rejected, (state, { meta, payload }) => {
                if (state.list.requestId !== meta.requestId) return;
                if (meta.aborted) {
                    state.list.loading = false;
                    return;
                }
                Object.assign(state.list, {
                    loading: false,
                    error: payload ?? { message: "Unable to load item requests. Please try again." },
                });
            })
            .addCase(search_asset_item_request_lookups_thunk.pending, (state, { meta }) => {
                if (meta.arg.assetSearch !== undefined) {
                    state.lookups.assetRequestId = meta.requestId;
                    state.lookups.assetLoading = true;
                    state.lookups.assetError = null;
                    state.lookups.assetSearch = meta.arg.assetSearch;
                    state.lookups.assets = [];
                }
                if (meta.arg.employeeSearch !== undefined) {
                    state.lookups.employeeRequestId = meta.requestId;
                    state.lookups.employeeLoading = true;
                    state.lookups.employeeError = null;
                    state.lookups.employeeSearch = meta.arg.employeeSearch;
                    state.lookups.employees = [];
                }
            })
            .addCase(search_asset_item_request_lookups_thunk.fulfilled, (state, { meta, payload }) => {
                if (meta.arg.approverSearch !== undefined) {
                    state.lookups.approvers = payload.data?.approvers ?? [];
                }
                if (meta.arg.assetSearch !== undefined && state.lookups.assetRequestId === meta.requestId) {
                    state.lookups.assets = payload.data?.assets ?? [];
                    state.lookups.assetLoading = false;
                }
                if (meta.arg.employeeSearch !== undefined && state.lookups.employeeRequestId === meta.requestId) {
                    state.lookups.employees = payload.data?.employees ?? [];
                    state.lookups.employeeLoading = false;
                }
            })
            .addCase(search_asset_item_request_lookups_thunk.rejected, (state, { meta, payload }) => {
                if (meta.aborted) {
                    if (meta.arg.assetSearch !== undefined && state.lookups.assetRequestId === meta.requestId) {
                        state.lookups.assetLoading = false;
                    }
                    if (meta.arg.employeeSearch !== undefined && state.lookups.employeeRequestId === meta.requestId) {
                        state.lookups.employeeLoading = false;
                    }
                    return;
                }
                if (meta.arg.assetSearch !== undefined && state.lookups.assetRequestId === meta.requestId) {
                    state.lookups.assetLoading = false;
                    state.lookups.assetError = payload ?? { message: "Unable to load assets." };
                }
                if (meta.arg.employeeSearch !== undefined && state.lookups.employeeRequestId === meta.requestId) {
                    state.lookups.employeeLoading = false;
                    state.lookups.employeeError = payload ?? { message: "Unable to load employees." };
                }
            })
            .addCase(create_asset_item_request_thunk.pending, (state) => {
                state.saving = true;
            })
            .addCase(create_asset_item_request_thunk.fulfilled, (state) => {
                state.saving = false;
            })
            .addCase(create_asset_item_request_thunk.rejected, (state) => {
                state.saving = false;
            })
            .addCase(get_asset_item_request_thunk.pending, (state, { meta }) => {
                state.detail = {
                    uuid: meta.arg,
                    request: null,
                    loading: true,
                    error: null,
                    requestId: meta.requestId,
                };
            })
            .addCase(get_asset_item_request_thunk.fulfilled, (state, { meta, payload }) => {
                if (state.detail.requestId !== meta.requestId) return;
                Object.assign(state.detail, { request: payload.data, loading: false, error: null });
            })
            .addCase(get_asset_item_request_thunk.rejected, (state, { meta, payload }) => {
                if (state.detail.requestId !== meta.requestId) return;
                if (meta.aborted) {
                    state.detail.loading = false;
                    return;
                }
                Object.assign(state.detail, {
                    loading: false,
                    error: payload ?? { message: "Unable to load this item request." },
                });
            })
            .addCase(decide_asset_item_request_thunk.fulfilled, (state, { meta, payload }) => {
                if (state.detail.uuid === meta.arg.uuid) {
                    state.detail.request = payload.data;
                    state.detail.error = null;
                }
            });
    },
});

export default assetItemRequestsSlice.reducer;
