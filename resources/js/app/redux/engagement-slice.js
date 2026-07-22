import { createSlice } from "@reduxjs/toolkit";
import {
    get_engagement_posts_thunk,
    create_engagement_post_thunk,
    update_engagement_post_thunk,
    delete_engagement_post_thunk,
    get_upcoming_birthdays_thunk,
    publish_engagement_post_thunk,
    cast_poll_vote_thunk,
    upload_gallery_thunk,
} from "./engagement-thunk";

export {
    get_engagement_posts_thunk,
    create_engagement_post_thunk,
    update_engagement_post_thunk,
    delete_engagement_post_thunk,
    get_upcoming_birthdays_thunk,
    publish_engagement_post_thunk,
    cast_poll_vote_thunk,
    upload_gallery_thunk,
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
        pollVotingPostId: null,
        birthdays: [],
        birthdayMonth: "",
        birthdayCount: 0,
        birthdaysLoading: false,

        // Gallery upload states
        uploadingGallery: false,
        uploadGalleryError: null,
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
        // Action to clear gallery errors when modal closes
        clearGalleryErrors(state) {
            state.uploadGalleryError = null;
        },
    },
    extraReducers: (builder) => {
        // ── Get Engagement Posts ──────────────────────────────────────────────
        builder
            .addCase(get_engagement_posts_thunk.pending, (state) => {
                state.fetching = true;
                state.postsLoading = true;
                state.postsError = null;
            })
            .addCase(get_engagement_posts_thunk.fulfilled, (state, action) => {
                state.fetching = false;
                state.postsLoading = false;
                // Normalize incoming posts
                const incoming = action.payload?.data ?? action.payload ?? [];
                if (Array.isArray(incoming)) {
                    // If we have upcoming birthdays in state, attach them to birthday posts
                    state.posts = incoming.map((p) => {
                        if ((p.type === 'birthday' || p.category === 'Birthday') && Array.isArray(state.birthdays) && state.birthdays.length > 0) {
                            return { ...p, celebrants: state.birthdays.map((b) => ({ ...b })) };
                        }
                        return p;
                    });
                } else {
                    state.posts = incoming;
                }
            })
            .addCase(get_engagement_posts_thunk.rejected, (state, action) => {
                state.fetching = false;
                state.postsLoading = false;
                state.postsError = action.payload;
            });

        // ── Create Post ────────────────────────────────────────────────────────
        builder
            .addCase(create_engagement_post_thunk.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(create_engagement_post_thunk.fulfilled, (state, action) => {
                state.creating = false;
                const newPost = action.payload?.data ?? action.payload;
                if (newPost && newPost.id) {
                    const exists = state.posts.some((p) => p.id === newPost.id);
                    if (!exists) {
                        state.posts = [newPost, ...state.posts];
                    }
                }
            })
            .addCase(create_engagement_post_thunk.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload;
            });

        // ── Update Post ────────────────────────────────────────────────────────
        builder
            .addCase(update_engagement_post_thunk.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(update_engagement_post_thunk.fulfilled, (state, action) => {
                state.updating = false;
                const updated = action.payload?.data ?? action.payload;
                if (updated && updated.id) {
                    const idx = state.posts.findIndex((p) => p.id === updated.id);
                    if (idx !== -1) state.posts[idx] = updated;
                }
            })
            .addCase(update_engagement_post_thunk.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            });

        // ── Delete Post ────────────────────────────────────────────────────────
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

        // ── Upcoming Birthdays ────────────────────────────────────────────────
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

        // ── Publish Rich Post (Birthday / Poll) ─────────────────────────────
        builder
            .addCase(publish_engagement_post_thunk.pending, (state) => {
                state.publishing = true;
                state.publishError = null;
            })
            .addCase(publish_engagement_post_thunk.fulfilled, (state, action) => {
                state.publishing = false;
                // Safely extract post object regardless of whether response is payload.data or direct payload
                const newPost = action.payload?.data ?? action.payload;
                if (newPost && newPost.id) {
                    // If this is a birthday post, attach the current upcoming birthdays
                    // so the frontend can render celebrants immediately even if the API
                    // does not include them in the post payload.
                    if (newPost.type === 'birthday' && Array.isArray(state.birthdays) && state.birthdays.length > 0) {
                        // Avoid mutating state.birthdays directly
                        newPost.celebrants = state.birthdays.map((b) => ({ ...b }));
                    }

                    const exists = state.posts.some((p) => p.id === newPost.id);
                    if (!exists) {
                        state.posts = [newPost, ...state.posts];
                    }
                }
            })
            .addCase(publish_engagement_post_thunk.rejected, (state, action) => {
                state.publishing = false;
                state.publishError = action.payload;
            });

        // ── Cast Poll Vote ────────────────────────────────────────────────────
        builder
            .addCase(cast_poll_vote_thunk.pending, (state, action) => {
                state.pollVotingPostId = action.meta.arg.postId;
            })
            .addCase(cast_poll_vote_thunk.fulfilled, (state, action) => {
                state.pollVotingPostId = null;
                const { postId, total_votes, user_has_voted, user_voted_option, options } = action.payload;
                const idx = state.posts.findIndex((p) => p.id === postId);
                if (idx !== -1) {
                    state.posts[idx].total_votes       = total_votes;
                    state.posts[idx].user_has_voted    = user_has_voted;
                    state.posts[idx].user_voted_option = user_voted_option;
                    if (options) state.posts[idx].options = options;
                }
            })
            .addCase(cast_poll_vote_thunk.rejected, (state) => {
                state.pollVotingPostId = null;
            });

        // ── Upload Gallery Images ─────────────────────────────────────────────
        builder
            .addCase(upload_gallery_thunk.pending, (state) => {
                state.uploadingGallery = true;
                state.uploadGalleryError = null;
            })
            .addCase(upload_gallery_thunk.fulfilled, (state, action) => {
                state.uploadingGallery = false;

                const payloadData = action.payload?.data ?? action.payload;
                const { event_id, files, drive_link } = payloadData || {};
                const idx = state.posts.findIndex((p) => p.id === event_id);

                if (idx !== -1) {
                    // Initialize the files array if it does not exist
                    if (!state.posts[idx].files) {
                        state.posts[idx].files = [];
                    }
                    // Append the newly uploaded S3 image references to our post state
                    if (files) {
                        state.posts[idx].files = [...state.posts[idx].files, ...files];
                    }

                    // Update Google Drive folder destination link if provided
                    if (drive_link) {
                        state.posts[idx].drive_link = drive_link;
                    }
                }
            })
            .addCase(upload_gallery_thunk.rejected, (state, action) => {
                state.uploadingGallery = false;
                state.uploadGalleryError = action.payload;
            });
    },
});

export const { syncInteraction, clearGalleryErrors } = engagementSlice.actions;
export default engagementSlice.reducer;