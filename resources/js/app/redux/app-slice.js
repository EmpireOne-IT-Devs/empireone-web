import { createSlice } from "@reduxjs/toolkit";

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
    },
});
export const { setUser, setSidebarOpen, setDesktopCollapsed, setAlert,setData } =
    appSlice.actions;

export default appSlice.reducer;
