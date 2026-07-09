import { createSlice } from "@reduxjs/toolkit";
import {
    get_engagement_posts_thunk,
    create_engagement_post_thunk,
    update_engagement_post_thunk,
    delete_engagement_post_thunk,
} from "./engagement-thunk";

export {
    get_engagement_posts_thunk,
    create_engagement_post_thunk,
    update_engagement_post_thunk,
    delete_engagement_post_thunk,
};

const engagementSlice = createSlice({
    name: "engagement",
    initialState: {
        posts: [],
        postsLoading: true,
        fetching: false,
        postsError: null,
        creating: false,
        createError: null,
        updating: false,
        updateError: null,
        deleting: false,
        deleteError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // ── get posts ─────────────────────────────────────────────────────────
        builder
            .addCase(get_engagement_posts_thunk.pending, (state) => {
                state.fetching = true;
                state.postsLoading = true;
                state.postsError = null;
            })
            .addCase(get_engagement_posts_thunk.fulfilled, (state, action) => {
                state.fetching = false;
                state.postsLoading = false;
                state.posts = action.payload.data ?? [];
            })
            .addCase(get_engagement_posts_thunk.rejected, (state, action) => {
                state.fetching = false;
                state.postsLoading = false;
                state.postsError = action.payload;
            });

        // ── create post ───────────────────────────────────────────────────────
        builder
            .addCase(create_engagement_post_thunk.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(create_engagement_post_thunk.fulfilled, (state, action) => {
                state.creating = false;
                if (action.payload.data) {
                    state.posts = [action.payload.data, ...state.posts];
                }
            })
            .addCase(create_engagement_post_thunk.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload;
            });

        // ── update post ───────────────────────────────────────────────────────
        builder
            .addCase(update_engagement_post_thunk.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(update_engagement_post_thunk.fulfilled, (state, action) => {
                state.updating = false;
                const updated = action.payload.data;
                if (updated) {
                    const idx = state.posts.findIndex((p) => p.id === updated.id);
                    if (idx !== -1) state.posts[idx] = updated;
                }
            })
            .addCase(update_engagement_post_thunk.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            });

        // ── delete post ───────────────────────────────────────────────────────
        builder
            .addCase(delete_engagement_post_thunk.pending, (state) => {
                state.deleting = true;
                state.deleteError = null;
            })
            .addCase(delete_engagement_post_thunk.fulfilled, (state, action) => {
                state.deleting = false;
                state.posts = state.posts.filter((p) => p.id !== action.payload);
            })
            .addCase(delete_engagement_post_thunk.rejected, (state, action) => {
                state.deleting = false;
                state.deleteError = action.payload;
            });
    },
});

export default engagementSlice.reducer;
