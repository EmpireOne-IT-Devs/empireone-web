import { createSlice } from "@reduxjs/toolkit";
import {
    get_engagement_posts_thunk,
    create_engagement_post_thunk,
    update_engagement_post_thunk,
    delete_engagement_post_thunk,
    get_upcoming_birthdays_thunk,
    publish_engagement_post_thunk,
} from "./engagement-thunk";

export {
    get_engagement_posts_thunk,
    create_engagement_post_thunk,
    update_engagement_post_thunk,
    delete_engagement_post_thunk,
    get_upcoming_birthdays_thunk,
    publish_engagement_post_thunk,
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
        publishing: false,
        publishError: null,
        birthdays: [],
        birthdayMonth: "",
        birthdayCount: 0,
        birthdaysLoading: false,
    },
    reducers: {
        syncInteraction(state, action) {
            const { postId, reaction_count, user_has_reacted, comment_count } = action.payload;
            const idx = state.posts.findIndex((p) => p.id === postId);
            if (idx === -1) return;
            if (reaction_count   !== undefined) state.posts[idx].reaction_count   = reaction_count;
            if (user_has_reacted !== undefined) state.posts[idx].user_has_reacted = user_has_reacted;
            if (comment_count    !== undefined) state.posts[idx].comment_count    = comment_count;
        },
    },
    extraReducers: (builder) => {
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

        // ── upcoming birthdays ────────────────────────────────────────────────
        builder
            .addCase(get_upcoming_birthdays_thunk.pending, (state) => {
                state.birthdaysLoading = true;
            })
            .addCase(get_upcoming_birthdays_thunk.fulfilled, (state, action) => {
                state.birthdaysLoading = false;
                state.birthdays = action.payload.data ?? [];
                state.birthdayMonth = action.payload.month ?? "";
                state.birthdayCount = action.payload.count ?? 0;
            })
            .addCase(get_upcoming_birthdays_thunk.rejected, (state) => {
                state.birthdaysLoading = false;
            });

        // ── publish rich post (birthday / poll) ───────────────────────────────
        builder
            .addCase(publish_engagement_post_thunk.pending, (state) => {
                state.publishing = true;
                state.publishError = null;
            })
            .addCase(publish_engagement_post_thunk.fulfilled, (state, action) => {
                state.publishing = false;
                if (action.payload.data) {
                    state.posts = [action.payload.data, ...state.posts];
                }
            })
            .addCase(publish_engagement_post_thunk.rejected, (state, action) => {
                state.publishing = false;
                state.publishError = action.payload;
            });
    },
});

export const { syncInteraction } = engagementSlice.actions;
export default engagementSlice.reducer;
