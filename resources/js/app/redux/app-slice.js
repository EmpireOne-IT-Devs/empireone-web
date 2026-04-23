import { createSlice } from "@reduxjs/toolkit";
import { setJobPostings } from "./job-posting-slice";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        user: {},
        sidebarOpen: false,
        desktopCollapsed: false,
        alert: {
            type: "none",
            title: "",
            message: "",
            open: false,
        },
        data: {},
        job_posting_id: null,
        loading: true,
        document: {
            name: "",
            type: "",
        },
        interviewers: [],
        interviewer: {},
        interviewer_id:{}
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setSidebarOpen: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setDesktopCollapsed: (state) => {
            state.desktopCollapsed = !state.desktopCollapsed;
        },
        setAlert: (state, action) => {
            state.alert = action.payload;
        },
        setData: (state, action) => {
            state.data = action.payload;
        },
        setJobPostingId: (state, action) => {
            state.job_posting_id = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setDocument: (state, action) => {
            state.document = action.payload;
        },
        setInterviewers: (state, action) => {
            state.interviewers = action.payload;
        },
        setInterviewer: (state, action) => {
            state.interviewer = action.payload;
        },
        setInterviewerId: (state, action) => {
            state.interviewer_id = action.payload;
        },
    },
});
export const {
    setUser,
    setSidebarOpen,
    setDesktopCollapsed,
    setAlert,
    setData,
    setJobPostingId,
    setLoading,
    setDocument,
    setInterviewers,
    setInterviewer,
    setInterviewerId
} = appSlice.actions;

export default appSlice.reducer;
