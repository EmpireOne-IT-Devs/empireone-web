import { createSlice } from "@reduxjs/toolkit";
import { setJobPostings } from "./job-posting-slice";

export const employeeRelationSlice = createSlice({
    name: "app",
    initialState: {
        employees: [],
        pools: [],
        probationaries: [],
        leaders:[],
        leader:{},
        evaluations:[],
        evaluation:{},
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
        setLeaders: (state, action) => {
            state.leaders = action.payload;
        },
        setLeader: (state, action) => {
            state.leader = action.payload;
        },
        setEvaluations: (state, action) => {
            state.evaluations = action.payload;
        },
         setEvaluation: (state, action) => {
            state.evaluation = action.payload;
        },
    },
});
export const { setEmployees, setPools, setProbationaries,setLeaders,setLeader,setEvaluations,setEvaluation } =
    employeeRelationSlice.actions;

export default employeeRelationSlice.reducer;
