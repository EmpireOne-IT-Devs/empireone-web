import { createAsyncThunk } from "@reduxjs/toolkit";
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
