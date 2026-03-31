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
} = appSlice.actions;

export default appSlice.reducer;
