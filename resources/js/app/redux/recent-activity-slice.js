import { createSlice } from "@reduxjs/toolkit";
import { get_recent_activity_thunk } from "./recent-activity-thunk";

const recentActivitySlice = createSlice({
    name: "recentActivity",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(get_recent_activity_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_recent_activity_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(get_recent_activity_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    action.error.message ||
                    "Unable to load recent activity.";
            });
    },
});

export default recentActivitySlice.reducer;
