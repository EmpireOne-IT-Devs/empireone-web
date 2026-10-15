import { createSlice } from "@reduxjs/toolkit";
import { setJobPostings } from "./job-posting-slice";

export const departmentsSlice = createSlice({
    name: "departments",
    initialState: {
        departments: [],
        teams: [],
    },
    reducers: {
        setDepartments: (state, action) => {
            state.departments = action.payload;
        },
        setTeams: (state, action) => {
            state.teams = action.payload;
        },
    },
});
export const { setTeams, setDepartments } = departmentsSlice.actions;

export default departmentsSlice.reducer;
