import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { create_site_service, get_sites_service } from '../services/site-service';

export const create_site_service_thunk = createAsyncThunk(
    'sites/createSite',
    async (siteData, { rejectWithValue }) => {
        try {
            const response = await create_site_service(siteData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const get_sites_service_thunk = createAsyncThunk(
    'sites/getSites',
    async (_, { rejectWithValue }) => {
        try {
            const response = await get_sites_service();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const siteSlice = createSlice({
    name: 'sites',
    initialState: {
        sites: [],
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
            .addCase(get_sites_service_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_sites_service_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.sites = action.payload;
                state.error = null;
            })
            .addCase(get_sites_service_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(create_site_service_thunk.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(create_site_service_thunk.fulfilled, (state, action) => {
                state.creating = false;
                state.sites.push(action.payload.site);
                state.createError = null;
            })
            .addCase(create_site_service_thunk.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload;
            });
    },
});

export const { clearError } = siteSlice.actions;
export default siteSlice.reducer;
