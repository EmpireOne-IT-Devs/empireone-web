import { createSlice } from "@reduxjs/toolkit";

export const employeeRelationSlice = createSlice({
    name: "app",
    initialState: {
        employee: {},
        employees: [],
        employeesLoading: false,
        accountPendings: { data: [], meta: null },
        accountPendingsLoading: true,
        accountPendingHistory: { data: [], meta: null },
        accountPendingHistoryLoading: false,
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
        change_forms:[],
        files:[],
        reaches:[],
        corrective_action:{},
    },
    reducers: {
        setEmployees: (state, action) => {
            state.employees = action.payload;
        },
         setCorrectiveAction: (state, action) => {
            state.corrective_action = action.payload;
        },
        setChangeForms: (state, action) => {
            state.change_forms = action.payload;
        },
        setEmployee: (state, action) => {
            state.employee = action.payload;
        },
        setEmployeesLoading: (state, action) => {
            state.employeesLoading = action.payload;
        },
        setAccountPendings: (state, action) => {
            state.accountPendings = action.payload;
        },
        setAccountPendingsLoading: (state, action) => {
            state.accountPendingsLoading = action.payload;
        },
        setAccountPendingHistory: (state, action) => {
            state.accountPendingHistory = action.payload;
        },
        setAccountPendingHistoryLoading: (state, action) => {
            state.accountPendingHistoryLoading = action.payload;
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
        setFiles: (state, action) => {
            state.files = action.payload;
        },
         setReaches: (state, action) => {
            state.reaches = action.payload;
        },
        
    },
});

export const {
    setFiles,
    setCorrectiveAction,
    setReaches,
    setChangeForms,
    setEmployee,
    setEmployees,
    setAttrition,
    setAttritions,
    setEmployeesLoading,
    setAccountPendings,
    setAccountPendingsLoading,
    setAccountPendingHistory,
    setAccountPendingHistoryLoading,
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
