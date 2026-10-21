import { createSlice } from "@reduxjs/toolkit";
import {
    approve_team_request_thunk,
    batch_approve_team_requests_thunk,
    decline_team_request_thunk,
    get_team_requests_thunk,
} from "./team-request-thunk";

const replaceItem = (state, updated) => {
    const index = state.items.findIndex(
        (item) => item.id === updated.id && item.type === updated.type,
    );
    if (index !== -1) state.items[index] = updated;
};

const teamRequestSlice = createSlice({
    name: "teamRequests",
    initialState: {
        items: [],
        meta: null,
        isLoading: true,
        isNotLeader: false,
        error: null,
        isActing: false,
        actionError: null,
        actionErrors: {},
    },
    reducers: {
        clear_team_request_action_error: (state) => {
            state.actionError = null;
            state.actionErrors = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_team_requests_thunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.isNotLeader = false;
            })
            .addCase(get_team_requests_thunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(get_team_requests_thunk.rejected, (state, action) => {
                state.isLoading = false;
                state.items = [];
                state.meta = null;
                state.isNotLeader = action.payload?.status === 403;
                state.error = state.isNotLeader
                    ? null
                    : action.payload?.message || "Unable to load team requests.";
            })
            .addCase(approve_team_request_thunk.pending, (state) => {
                state.isActing = true;
                state.actionError = null;
            })
            .addCase(approve_team_request_thunk.fulfilled, (state, action) => {
                state.isActing = false;
                replaceItem(state, action.payload.data);
            })
            .addCase(approve_team_request_thunk.rejected, (state, action) => {
                state.isActing = false;
                state.actionError =
                    action.payload?.message || "Unable to approve this request.";
            })
            .addCase(decline_team_request_thunk.pending, (state) => {
                state.isActing = true;
                state.actionError = null;
                state.actionErrors = {};
            })
            .addCase(decline_team_request_thunk.fulfilled, (state, action) => {
                state.isActing = false;
                replaceItem(state, action.payload.data);
            })
            .addCase(decline_team_request_thunk.rejected, (state, action) => {
                state.isActing = false;
                state.actionErrors = action.payload?.errors || {};
                state.actionError =
                    action.payload?.message || "Unable to decline this request.";
            })
            .addCase(batch_approve_team_requests_thunk.pending, (state) => {
                state.isActing = true;
            })
            .addCase(batch_approve_team_requests_thunk.fulfilled, (state) => {
                state.isActing = false;
            })
            .addCase(batch_approve_team_requests_thunk.rejected, (state) => {
                state.isActing = false;
            });
    },
});

export const { clear_team_request_action_error } = teamRequestSlice.actions;

export default teamRequestSlice.reducer;
