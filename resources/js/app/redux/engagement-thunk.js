import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    create_post_event_service,
    get_post_event_service,
    update_post_event_by_id_service,
    delete_post_event_service,
    get_upcoming_birthdays_service,
    cast_poll_vote_service,
} from "../services/engagement-service";

export const get_engagement_posts_thunk = createAsyncThunk(
    "engagement/getPosts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await get_post_event_service();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    },
    {
        condition: (_, { getState }) => !getState().engagement.fetching,
    }
);

export const create_engagement_post_thunk = createAsyncThunk(
    "engagement/createPost",
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", data.content);
            formData.append("category", data.category);

            if (data.images && data.images.length > 0) {
                data.images.forEach((image) => {
                    formData.append("images[]", image);
                });
            }

            const response = await create_post_event_service(formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const update_engagement_post_thunk = createAsyncThunk(
    "engagement/updatePost",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await update_post_event_by_id_service(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const delete_engagement_post_thunk = createAsyncThunk(
    "engagement/deletePost",
    async (id, { rejectWithValue }) => {
        try {
            await delete_post_event_service(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const get_upcoming_birthdays_thunk = createAsyncThunk(
    "engagement/getUpcomingBirthdays",
    async (_, { rejectWithValue }) => {
        try {
            const response = await get_upcoming_birthdays_service();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const publish_engagement_post_thunk = createAsyncThunk(
    "engagement/publishPost",
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("type", data.type);
            formData.append("headline", data.headline);
            formData.append("message", data.message);
            formData.append("publish_to", data.publish_to);
            if (data.month)        formData.append("month", data.month);
            if (data.year)         formData.append("year", data.year);
            if (data.category)     formData.append("category", data.category);
            if (data.scheduled_at) formData.append("scheduled_at", data.scheduled_at);
            if (data.media)        formData.append("media", data.media);
            if (data.options?.length) {
                data.options.forEach((opt) => formData.append("options[]", opt));
            }

            const response = await create_post_event_service(formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const cast_poll_vote_thunk = createAsyncThunk(
    "engagement/castPollVote",
    async ({ postId, optionId }, { rejectWithValue }) => {
        try {
            const response = await cast_poll_vote_service(postId, optionId);
            return { postId, ...response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
