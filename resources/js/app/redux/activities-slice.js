import { createSlice } from "@reduxjs/toolkit";
import {
    get_upcoming_birthdays_thunk,
    get_activity_posts_thunk,
    publish_activity_post_thunk,
    get_upcoming_events_thunk,
    update_activity_post_thunk,
    delete_activity_post_thunk,
    cast_poll_vote_thunk,
    get_poll_analytics_thunk,
    get_poll_analytics_dashboard_thunk,
    get_poll_details_thunk,
    get_poll_vote_records_thunk,
    close_poll_thunk,
    reopen_poll_thunk,
} from "./activities-thunk";

// Re-export thunks so any existing import from this file still works
export {
    get_upcoming_birthdays_thunk,
    get_activity_posts_thunk,
    publish_activity_post_thunk,
    get_upcoming_events_thunk,
    update_activity_post_thunk,
    delete_activity_post_thunk,
    cast_poll_vote_thunk,
    get_poll_analytics_thunk,
    get_poll_analytics_dashboard_thunk,
    get_poll_details_thunk,
    get_poll_vote_records_thunk,
    close_poll_thunk,
    reopen_poll_thunk,
};

const activitiesSlice = createSlice({
    name: "activities",
    initialState: {
        // birthdays
        birthdays: [],
        birthdayMonth: "",
        birthdayCount: 0,
        loading: false,
        error: null,
        // posts feed
        posts: [],
        postsLoading: true,
        postsFetching: false, // true only while an HTTP request is in-flight (used for dedup)
        postsError: null,
        // upcoming scheduled events
        upcomingEvents: [],
        // publish
        publishing: false,
        publishError: null,
        // update / delete
        postUpdating: false,
        postUpdateError: null,
        postDeleting: false,
        postDeleteError: null,
        // poll voting
        pollVotingPostId: null,
        pollVoteError: null,
        // poll analytics module
        pollAnalytics: [],
        pollAnalyticsLoading: false,
        pollAnalyticsError: null,
        pollDashboard: null,
        pollDashboardLoading: false,
        selectedPoll: null,
        selectedPollLoading: false,
        selectedPollError: null,
        pollVoteRecords: [],
        pollVoteRecordsLoading: false,
        pollStatusUpdating: false,
        pollStatusUpdateError: null,
    },
    reducers: {
       
        sync_post_interaction(state, action) {
            const { postId, reaction_count, user_has_reacted, comment_count } = action.payload;
            const idx = state.posts.findIndex((p) => p.id === postId);
            if (idx === -1) return;
            if (reaction_count !== undefined)   state.posts[idx].reaction_count   = reaction_count;
            if (user_has_reacted !== undefined) state.posts[idx].user_has_reacted = user_has_reacted;
            if (comment_count !== undefined)    state.posts[idx].comment_count    = comment_count;
        },
    },
    extraReducers: (builder) => {
        builder
            // ── upcoming birthdays ──────────────────────────────────────
            .addCase(get_upcoming_birthdays_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_upcoming_birthdays_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.birthdays = action.payload.data ?? [];
                state.birthdayMonth = action.payload.month ?? "";
                state.birthdayCount = action.payload.count ?? 0;
            })
            .addCase(get_upcoming_birthdays_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ── activity posts feed ─────────────────────────────────────
            .addCase(get_activity_posts_thunk.pending, (state) => {
                state.postsLoading = true;
                state.postsFetching = true;
                state.postsError = null;
            })
            .addCase(get_activity_posts_thunk.fulfilled, (state, action) => {
                state.postsLoading = false;
                state.postsFetching = false;
                state.posts = action.payload.data ?? [];
            })
            .addCase(get_activity_posts_thunk.rejected, (state, action) => {
                state.postsLoading = false;
                state.postsFetching = false;
                state.postsError = action.payload;
            })
            // ── publish post ────────────────────────────────────────────
            .addCase(publish_activity_post_thunk.pending, (state) => {
                state.publishing = true;
                state.publishError = null;
            })
            .addCase(publish_activity_post_thunk.fulfilled, (state) => {
                state.publishing = false;
            })
            .addCase(publish_activity_post_thunk.rejected, (state, action) => {
                state.publishing = false;
                state.publishError = action.payload;
            })
            // ── upcoming scheduled events ───────────────────────────────
            .addCase(get_upcoming_events_thunk.fulfilled, (state, action) => {
                state.upcomingEvents = action.payload.data ?? [];
            })
            // ── update post ─────────────────────────────────────────────
            .addCase(update_activity_post_thunk.pending, (state) => {
                state.postUpdating = true;
                state.postUpdateError = null;
            })
            .addCase(update_activity_post_thunk.fulfilled, (state, action) => {
                state.postUpdating = false;
                const { id, data } = action.payload;
                const idx = state.posts.findIndex((p) => p.id === id);
                if (idx !== -1) {
                    state.posts[idx] = { ...state.posts[idx], ...data };
                }
            })
            .addCase(update_activity_post_thunk.rejected, (state, action) => {
                state.postUpdating = false;
                state.postUpdateError = action.payload;
            })
            // ── delete post ─────────────────────────────────────────────
            .addCase(delete_activity_post_thunk.pending, (state) => {
                state.postDeleting = true;
                state.postDeleteError = null;
            })
            .addCase(delete_activity_post_thunk.fulfilled, (state, action) => {
                state.postDeleting = false;
                state.posts = state.posts.filter((p) => p.id !== action.payload);
            })
            .addCase(delete_activity_post_thunk.rejected, (state, action) => {
                state.postDeleting = false;
                state.postDeleteError = action.payload;
            })
            // ── cast poll vote ──────────────────────────────────────────
            .addCase(cast_poll_vote_thunk.pending, (state, action) => {
                state.pollVotingPostId = action.meta.arg.postId;
                state.pollVoteError = null;
            })
            .addCase(cast_poll_vote_thunk.fulfilled, (state, action) => {
                state.pollVotingPostId = null;
                const { postId, data } = action.payload;
                const idx = state.posts.findIndex((p) => p.id === postId);
                if (idx !== -1) {
                    state.posts[idx] = {
                        ...state.posts[idx],
                        options: data.options,
                        total_votes: data.total_votes,
                        user_has_voted: data.user_has_voted,
                        user_voted_option: data.user_voted_option,
                    };
                }
            })
            .addCase(cast_poll_vote_thunk.rejected, (state, action) => {
                state.pollVotingPostId = null;
                state.pollVoteError = action.payload;
            })
            // ── poll analytics list ─────────────────────────────────────
            .addCase(get_poll_analytics_thunk.pending, (state) => {
                state.pollAnalyticsLoading = true;
                state.pollAnalyticsError = null;
            })
            .addCase(get_poll_analytics_thunk.fulfilled, (state, action) => {
                state.pollAnalyticsLoading = false;
                state.pollAnalytics = action.payload.data ?? [];
            })
            .addCase(get_poll_analytics_thunk.rejected, (state, action) => {
                state.pollAnalyticsLoading = false;
                state.pollAnalyticsError = action.payload;
            })
            // ── poll analytics dashboard ────────────────────────────────
            .addCase(get_poll_analytics_dashboard_thunk.pending, (state) => {
                state.pollDashboardLoading = true;
            })
            .addCase(
                get_poll_analytics_dashboard_thunk.fulfilled,
                (state, action) => {
                    state.pollDashboardLoading = false;
                    state.pollDashboard = action.payload.data ?? null;
                }
            )
            .addCase(get_poll_analytics_dashboard_thunk.rejected, (state) => {
                state.pollDashboardLoading = false;
            })
            // ── poll details ────────────────────────────────────────────
            .addCase(get_poll_details_thunk.pending, (state) => {
                state.selectedPollLoading = true;
                state.selectedPollError = null;
            })
            .addCase(get_poll_details_thunk.fulfilled, (state, action) => {
                state.selectedPollLoading = false;
                state.selectedPoll = action.payload.data ?? null;
            })
            .addCase(get_poll_details_thunk.rejected, (state, action) => {
                state.selectedPollLoading = false;
                state.selectedPollError = action.payload;
            })
            // ── vote records ────────────────────────────────────────────
            .addCase(get_poll_vote_records_thunk.pending, (state) => {
                state.pollVoteRecordsLoading = true;
            })
            .addCase(get_poll_vote_records_thunk.fulfilled, (state, action) => {
                state.pollVoteRecordsLoading = false;
                state.pollVoteRecords = action.payload.data ?? [];
            })
            .addCase(get_poll_vote_records_thunk.rejected, (state) => {
                state.pollVoteRecordsLoading = false;
            })
            // ── close/reopen poll ───────────────────────────────────────
            .addCase(close_poll_thunk.pending, (state) => {
                state.pollStatusUpdating = true;
                state.pollStatusUpdateError = null;
            })
            .addCase(close_poll_thunk.fulfilled, (state, action) => {
                state.pollStatusUpdating = false;
                const pollId = action.payload;
                const poll = state.pollAnalytics.find((p) => p.id === pollId);
                if (poll) {
                    poll.status = "Closed";
                }
                if (state.selectedPoll?.poll_information?.id === pollId) {
                    state.selectedPoll.poll_information.status = "Closed";
                }
            })
            .addCase(close_poll_thunk.rejected, (state, action) => {
                state.pollStatusUpdating = false;
                state.pollStatusUpdateError = action.payload;
            })
            .addCase(reopen_poll_thunk.pending, (state) => {
                state.pollStatusUpdating = true;
                state.pollStatusUpdateError = null;
            })
            .addCase(reopen_poll_thunk.fulfilled, (state, action) => {
                state.pollStatusUpdating = false;
                const pollId = action.payload;
                const poll = state.pollAnalytics.find((p) => p.id === pollId);
                if (poll) {
                    poll.status = "Active";
                }
                if (state.selectedPoll?.poll_information?.id === pollId) {
                    state.selectedPoll.poll_information.status = "Active";
                }
            })
            .addCase(reopen_poll_thunk.rejected, (state, action) => {
                state.pollStatusUpdating = false;
                state.pollStatusUpdateError = action.payload;
            });
    },
});

export default activitiesSlice.reducer;

export const { sync_post_interaction } = activitiesSlice.actions;

