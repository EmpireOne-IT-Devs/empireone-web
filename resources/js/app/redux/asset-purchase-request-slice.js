import { createSlice } from "@reduxjs/toolkit";
import {
    decide_asset_purchase_request_thunk,
    get_asset_purchase_request_thunk,
    list_asset_purchase_requests_thunk,
    search_asset_purchase_approvers_thunk,
} from "./asset-purchase-request-thunk";

const assetPurchaseRequestsSlice = createSlice({
    name: "assetPurchaseRequests",
    initialState: {
        list: { items: [], meta: null, loading: true, error: null },
        detail: { uuid: null, request: null, loading: true, error: null },
        approvers: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(list_asset_purchase_requests_thunk.pending, (state, { meta }) => {
                Object.assign(state.list, { requestId: meta.requestId, loading: true, error: null });
            })
            .addCase(list_asset_purchase_requests_thunk.fulfilled, (state, { meta, payload }) => {
                if (state.list.requestId !== meta.requestId) return;
                Object.assign(state.list, { items: payload.data, meta: payload.meta, loading: false });
            })
            .addCase(list_asset_purchase_requests_thunk.rejected, (state, { meta, payload }) => {
                if (state.list.requestId !== meta.requestId || meta.aborted) return;
                Object.assign(state.list, { items: [], meta: null, loading: false, error: payload });
            })
            .addCase(get_asset_purchase_request_thunk.pending, (state, { meta }) => {
                state.detail = { uuid: meta.arg, requestId: meta.requestId, request: null, loading: true, error: null };
            })
            .addCase(get_asset_purchase_request_thunk.fulfilled, (state, { meta, payload }) => {
                if (state.detail.requestId !== meta.requestId) return;
                Object.assign(state.detail, { request: payload.data, loading: false });
            })
            .addCase(get_asset_purchase_request_thunk.rejected, (state, { meta, payload }) => {
                if (state.detail.requestId !== meta.requestId || meta.aborted) return;
                Object.assign(state.detail, { error: payload, loading: false });
            })
            .addCase(decide_asset_purchase_request_thunk.fulfilled, (state, { meta, payload }) => {
                if (state.detail.uuid === meta.arg.uuid) state.detail.request = payload.data;
            })
            .addCase(search_asset_purchase_approvers_thunk.fulfilled, (state, { payload }) => {
                state.approvers = payload.data ?? [];
            });
    },
});

export default assetPurchaseRequestsSlice.reducer;
