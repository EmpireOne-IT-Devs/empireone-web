import { createSlice } from "@reduxjs/toolkit";
import { setJobPostings } from "./job-posting-slice";

export const employeeRelationSlice = createSlice({
    name: "app",
    initialState: {
        employees: [],
        pools: [],
        probationaries: [],
    },
    reducers: {
        setEmployees: (state, action) => {
            state.employees = action.payload;
        },
        setPools: (state, action) => {
            state.pools = action.payload;
        },
        setProbationaries: (state, action) => {
            state.probationaries = action.payload;
        },
    },
});
export const { setEmployees, setPools, setProbationaries } =
    employeeRelationSlice.actions;

export default employeeRelationSlice.reducer;
