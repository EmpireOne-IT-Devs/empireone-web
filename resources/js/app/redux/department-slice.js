import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { create_department_service, get_departments_service } from '../services/department-service';

export const create_department_service_thunk = createAsyncThunk(
    'departments/createDepartment',
    async (departmentData, { rejectWithValue }) => {
        try {
            const response = await create_department_service(departmentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const get_departments_service_thunk = createAsyncThunk(
    'departments/getDepartments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await get_departments_service();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const departmentSlice = createSlice({
    name: 'departments',
    initialState: {
        departments: [],
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
            .addCase(get_departments_service_thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_departments_service_thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload;
                state.error = null;
            })
            .addCase(get_departments_service_thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(create_department_service_thunk.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(create_department_service_thunk.fulfilled, (state, action) => {
                state.creating = false;
                state.departments.push(action.payload.department);
                state.createError = null;
            })
            .addCase(create_department_service_thunk.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload;
            });
    },
});

export const { clearError } = departmentSlice.actions;
export default departmentSlice.reducer;
