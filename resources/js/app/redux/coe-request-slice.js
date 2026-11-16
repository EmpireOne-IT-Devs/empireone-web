import { createSlice } from "@reduxjs/toolkit";
import {
    create_coe_request_thunk,
    get_coe_requests_thunk,
    get_coe_status_thunk,
} from "./coe-request-thunk";

const initialState = {
    items: [],
    meta: null,
    loading: false,
    error: null,
    status: null,
    status_loading: false,
    saving: false,
};

const coeRequestsSlice = createSlice({
    name: "coeRequests",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(get_coe_requests_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_coe_requests_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data ?? [];
                state.meta = action.payload.meta ?? null;
            })
            .addCase(get_coe_requests_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Unable to load COE requests.";
            })
            .addCase(get_coe_status_thunk.pending, (state) => {
                state.status_loading = true;
            })
            .addCase(get_coe_status_thunk.fulfilled, (state, action) => {
                state.status_loading = false;
                state.status = action.payload.data ?? null;
            })
            .addCase(get_coe_status_thunk.rejected, (state) => {
                state.status_loading = false;
            })
            .addCase(create_coe_request_thunk.pending, (state) => {
                state.saving = true;
            })
            .addCase(create_coe_request_thunk.fulfilled, (state) => {
                state.saving = false;
            })
            .addCase(create_coe_request_thunk.rejected, (state, action) => {
                state.saving = false;
                if (action.payload?.status === 429) {
                    state.status = {
                        can_generate: false,
                        next_available_at: action.payload.next_available_at,
                    };
                }
            });
    },
});

export default coeRequestsSlice.reducer;
