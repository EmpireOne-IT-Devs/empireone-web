import { createSlice } from "@reduxjs/toolkit";
import { setJobPostings } from "./job-posting-slice";

export const employeeRelationSlice = createSlice({
    name: "app",
    initialState: {
        employees: [],
    },
    reducers: {
        setEmployees: (state, action) => {
            state.employees = action.payload;
        },
    },
});
export const { setEmployees } = employeeRelationSlice.actions;

export default employeeRelationSlice.reducer;
