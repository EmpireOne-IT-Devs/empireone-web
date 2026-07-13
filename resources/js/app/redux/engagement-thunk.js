import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    create_post_event_service,
    get_post_event_service,
    update_post_event_by_id_service,
    delete_post_event_service,
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
