import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    get_upcoming_birthdays_service,
    get_activity_posts_service,
    publish_activity_post_service,
    get_upcoming_events_service,
    update_activity_post_service,
    delete_activity_post_service,
    cast_poll_vote_service,
    get_poll_analytics_service,
    get_poll_analytics_dashboard_service,
    get_poll_details_service,
    get_poll_vote_records_service,
    close_poll_service,
    reopen_poll_service,
} from "../services/activities-service";

export const get_upcoming_birthdays_thunk = createAsyncThunk(
    "activities/getUpcomingBirthdays",
    async (_, { rejectWithValue }) => {
        try {
            const response = await get_upcoming_birthdays_service();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const get_activity_posts_thunk = createAsyncThunk(
    "activities/getActivityPosts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await get_activity_posts_service();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const publish_activity_post_thunk = createAsyncThunk(
    "activities/publishActivityPost",
    async (data, { rejectWithValue }) => {
        try {
            const response = await publish_activity_post_service(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const get_upcoming_events_thunk = createAsyncThunk(
    "activities/getUpcomingEvents",
    async (_, { rejectWithValue }) => {
        try {
            const response = await get_upcoming_events_service();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const update_activity_post_thunk = createAsyncThunk(
    "activities/updateActivityPost",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            await update_activity_post_service(id, data);
            return { id, data };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const delete_activity_post_thunk = createAsyncThunk(
    "activities/deleteActivityPost",
    async (id, { rejectWithValue }) => {
        try {
            await delete_activity_post_service(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const cast_poll_vote_thunk = createAsyncThunk(
    "activities/castPollVote",
    async ({ postId, optionId }, { rejectWithValue }) => {
        try {
            const response = await cast_poll_vote_service(postId, optionId);
            return { postId, data: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const get_poll_analytics_thunk = createAsyncThunk(
    "activities/getPollAnalytics",
    async (_, { rejectWithValue }) => {
        try {
            const response = await get_poll_analytics_service();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const get_poll_analytics_dashboard_thunk = createAsyncThunk(
    "activities/getPollAnalyticsDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const response = await get_poll_analytics_dashboard_service();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const get_poll_details_thunk = createAsyncThunk(
    "activities/getPollDetails",
    async (postId, { rejectWithValue }) => {
        try {
            const response = await get_poll_details_service(postId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const get_poll_vote_records_thunk = createAsyncThunk(
    "activities/getPollVoteRecords",
    async (postId, { rejectWithValue }) => {
        try {
            const response = await get_poll_vote_records_service(postId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const close_poll_thunk = createAsyncThunk(
    "activities/closePoll",
    async (postId, { rejectWithValue }) => {
        try {
            await close_poll_service(postId);
            return postId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const reopen_poll_thunk = createAsyncThunk(
    "activities/reopenPoll",
    async (postId, { rejectWithValue }) => {
        try {
            await reopen_poll_service(postId);
            return postId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

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
    reducers: {},
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
                state.postsError = null;
            })
            .addCase(get_activity_posts_thunk.fulfilled, (state, action) => {
                state.postsLoading = false;
                state.posts = action.payload.data ?? [];
            })
            .addCase(get_activity_posts_thunk.rejected, (state, action) => {
                state.postsLoading = false;
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

