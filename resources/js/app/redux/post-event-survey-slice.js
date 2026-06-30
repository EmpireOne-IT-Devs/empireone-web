import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    get_post_event_surveys_service,
    get_post_event_survey_service,
    create_post_event_survey_service,
    delete_post_event_survey_service,
} from "../services/post-event-survey-service";

export const get_post_event_surveys_thunk = createAsyncThunk(
    "postEventSurvey/getSurveys",
    async (_, { rejectWithValue }) => {
        try {
            const response = await get_post_event_surveys_service();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const get_post_event_survey_thunk = createAsyncThunk(
    "postEventSurvey/getSurvey",
    async (id, { rejectWithValue }) => {
        try {
            const response = await get_post_event_survey_service(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const create_post_event_survey_thunk = createAsyncThunk(
    "postEventSurvey/createSurvey",
    async (data, { rejectWithValue }) => {
        try {
            const response = await create_post_event_survey_service(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const delete_post_event_survey_thunk = createAsyncThunk(
    "postEventSurvey/deleteSurvey",
    async (id, { rejectWithValue }) => {
        try {
            await delete_post_event_survey_service(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const postEventSurveySlice = createSlice({
    name: "postEventSurvey",
    initialState: {
        surveys: [],
        surveysLoading: false,
        surveysError: null,

        selectedSurvey: null,
        selectedSurveyLoading: false,
        selectedSurveyError: null,

        creating: false,
        createError: null,

        deleting: false,
        deleteError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ── get all surveys ─────────────────────────────────────────
            .addCase(get_post_event_surveys_thunk.pending, (state) => {
                state.surveysLoading = true;
                state.surveysError = null;
            })
            .addCase(get_post_event_surveys_thunk.fulfilled, (state, action) => {
                state.surveysLoading = false;
                state.surveys = action.payload.data ?? [];
            })
            .addCase(get_post_event_surveys_thunk.rejected, (state, action) => {
                state.surveysLoading = false;
                state.surveysError = action.payload;
            })
            // ── get single survey ───────────────────────────────────────
            .addCase(get_post_event_survey_thunk.pending, (state) => {
                state.selectedSurveyLoading = true;
                state.selectedSurveyError = null;
            })
            .addCase(get_post_event_survey_thunk.fulfilled, (state, action) => {
                state.selectedSurveyLoading = false;
                state.selectedSurvey = action.payload.data ?? null;
            })
            .addCase(get_post_event_survey_thunk.rejected, (state, action) => {
                state.selectedSurveyLoading = false;
                state.selectedSurveyError = action.payload;
            })
            // ── create survey ───────────────────────────────────────────
            .addCase(create_post_event_survey_thunk.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(create_post_event_survey_thunk.fulfilled, (state, action) => {
                state.creating = false;
                state.surveys.unshift(action.payload.data);
            })
            .addCase(create_post_event_survey_thunk.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload;
            })
            // ── delete survey ───────────────────────────────────────────
            .addCase(delete_post_event_survey_thunk.pending, (state) => {
                state.deleting = true;
                state.deleteError = null;
            })
            .addCase(delete_post_event_survey_thunk.fulfilled, (state, action) => {
                state.deleting = false;
                state.surveys = state.surveys.filter((s) => s.id !== action.payload);
            })
            .addCase(delete_post_event_survey_thunk.rejected, (state, action) => {
                state.deleting = false;
                state.deleteError = action.payload;
            });
    },
});

export default postEventSurveySlice.reducer;
