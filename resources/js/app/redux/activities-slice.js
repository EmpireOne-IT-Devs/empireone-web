import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    get_upcoming_birthdays_service,
    get_activity_posts_service,
    publish_activity_post_service,
    get_upcoming_events_service,
    update_activity_post_service,
    delete_activity_post_service,
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
            const response = await update_activity_post_service(id, data);
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
            });
    },
});

export default activitiesSlice.reducer;

