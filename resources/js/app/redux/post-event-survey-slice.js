import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    get_post_event_surveys_service,
    get_post_event_survey_service,
    create_post_event_survey_service,
    submit_post_event_survey_service,
    get_survey_responses_service,
    close_post_event_survey_service,
    reopen_post_event_survey_service,
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

export const submit_post_event_survey_thunk = createAsyncThunk(
    "postEventSurvey/submitSurvey",
    async ({ id, answers }, { rejectWithValue }) => {
        try {
            const response = await submit_post_event_survey_service(id, { answers });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const get_survey_responses_thunk = createAsyncThunk(
    "postEventSurvey/getResponses",
    async (id, { rejectWithValue }) => {
        try {
            const response = await get_survey_responses_service(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const close_post_event_survey_thunk = createAsyncThunk(
    "postEventSurvey/closeSurvey",
    async (id, { rejectWithValue }) => {
        try {
            const response = await close_post_event_survey_service(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const reopen_post_event_survey_thunk = createAsyncThunk(
    "postEventSurvey/reopenSurvey",
    async (id, { rejectWithValue }) => {
        try {
            const response = await reopen_post_event_survey_service(id);
            return response.data;
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

        submitting: false,
        submitError: null,
        submitted: false,

        responses: null,
        responsesLoading: false,
        responsesError: null,

        closing: false,
        reopening: false,

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
            })
            // ── submit survey ───────────────────────────────────────────
            .addCase(submit_post_event_survey_thunk.pending, (state) => {
                state.submitting = true;
                state.submitError = null;
                state.submitted = false;
            })
            .addCase(submit_post_event_survey_thunk.fulfilled, (state) => {
                state.submitting = false;
                state.submitted = true;
            })
            .addCase(submit_post_event_survey_thunk.rejected, (state, action) => {
                state.submitting = false;
                state.submitError = action.payload;            })
            // ── get response tracker ────────────────────────────────────
            .addCase(get_survey_responses_thunk.pending, (state) => {
                state.responsesLoading = true;
                state.responsesError = null;
            })
            .addCase(get_survey_responses_thunk.fulfilled, (state, action) => {
                state.responsesLoading = false;
                state.responses = action.payload.data ?? null;
            })
            .addCase(get_survey_responses_thunk.rejected, (state, action) => {
                state.responsesLoading = false;
                state.responsesError = action.payload;
            })
            // ── close survey ────────────────────────────────────────────
            .addCase(close_post_event_survey_thunk.pending, (state) => {
                state.closing = true;
            })
            .addCase(close_post_event_survey_thunk.fulfilled, (state) => {
                state.closing = false;
                if (state.selectedSurvey) state.selectedSurvey.status = 'closed';
            })
            .addCase(close_post_event_survey_thunk.rejected, (state) => {
                state.closing = false;
            })
            // ── reopen survey ───────────────────────────────────────────
            .addCase(reopen_post_event_survey_thunk.pending, (state) => {
                state.reopening = true;
            })
            .addCase(reopen_post_event_survey_thunk.fulfilled, (state) => {
                state.reopening = false;
                if (state.selectedSurvey) state.selectedSurvey.status = 'published';
            })
            .addCase(reopen_post_event_survey_thunk.rejected, (state) => {
                state.reopening = false;            });
    },
});

export default postEventSurveySlice.reducer;
