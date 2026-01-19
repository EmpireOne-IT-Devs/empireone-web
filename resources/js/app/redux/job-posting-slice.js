import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get_job_postings_service, create_job_posting_service } from '../services/job-posting-service';

export const get_job_postings_service_thunk = createAsyncThunk(
    'jobPostings/getJobPostings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await get_job_postings_service();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const create_job_posting_service_thunk = createAsyncThunk(
    'jobPostings/createJobPosting',
    async (jobPostingData, { rejectWithValue }) => {
        try {
            const response = await create_job_posting_service(jobPostingData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const jobPostingSlice = createSlice({
    name: 'job_postings',
    initialState: {
        job_postings: [],
        loading: false,
        error: null,
        creating: false,
        createError: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.createError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_job_postings_service_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_job_postings_service_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.job_postings = action.payload;
                state.error = null;
            })
            .addCase(get_job_postings_service_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(create_job_posting_service_thunk.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(create_job_posting_service_thunk.fulfilled, (state, action) => {
                state.creating = false;
                state.job_postings.push(action.payload.job_posting);
                state.createError = null;
            })
            .addCase(create_job_posting_service_thunk.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload;
            });
    },
});

export const { clearError } = jobPostingSlice.actions;
export default jobPostingSlice.reducer;
