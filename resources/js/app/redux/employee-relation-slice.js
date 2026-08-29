import { createSlice } from "@reduxjs/toolkit";

export const employeeRelationSlice = createSlice({
    name: "app",
    initialState: {
        employees: [],
        employeesLoading: false,
        pools: [],
        probationaries: [],
        leaders: [],
        leader: {},
        evaluations: [],
        evaluation: {},
        regulars: [],
        ecfs: [],
        ecf: [],
        applicants: [],
        users: [],
        acknowledgements: [],
        attritions: [],
        attrition: {},
    },
    reducers: {
        setEmployees: (state, action) => {
            state.employees = action.payload;
        },
        setEmployeesLoading: (state, action) => {
            state.employeesLoading = action.payload;
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
        setRegulars: (state, action) => {
            state.regulars = action.payload;
        },
        setECFs: (state, action) => {
            state.ecfs = action.payload;
        },
        setECF: (state, action) => {
            state.ecf = action.payload;
        },
        setApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setAcknowledgements: (state, action) => {
            state.acknowledgements = action.payload;
        },
        setAttritions: (state, action) => {
            state.attritions = action.payload;
        },
        setAttrition: (state, action) => {
            state.attrition = action.payload;
        },
    },
});

export const {
    setEmployees,
    setAttrition,
    setAttritions,
    setEmployeesLoading,
    setPools,
    setProbationaries,
    setLeaders,
    setLeader,
    setUsers,
    setEvaluations,
    setEvaluation,
    setRegulars,
    setECFs,
    setECF,
    setApplicants,
    setAcknowledgements,
} = employeeRelationSlice.actions;

export default employeeRelationSlice.reducer;
