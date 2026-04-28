import { createSlice } from "@reduxjs/toolkit";
import { setJobPostings } from "./job-posting-slice";

export const employeeRelationSlice = createSlice({
    name: "app",
    initialState: {
        employees: [],
        pools: [],
    },
    reducers: {
        setEmployees: (state, action) => {
            state.employees = action.payload;
        },
        setPools: (state, action) => {
            state.pools = action.payload;
        },
    },
});
export const { setEmployees, setPools } = employeeRelationSlice.actions;

export default employeeRelationSlice.reducer;
