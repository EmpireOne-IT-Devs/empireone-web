import { createSlice } from "@reduxjs/toolkit";
import { setJobPostings } from "./job-posting-slice";

export const departmentsSlice = createSlice({
    name: "departments",
    initialState: {
        departments: [],
    },
    reducers: {
        setDepartments: (state, action) => {
            state.departments = action.payload;
        },
    },
});
export const { setDepartments } = departmentsSlice.actions;

export default departmentsSlice.reducer;
