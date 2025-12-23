import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        user: {},
        sidebarOpen:false,
        desktopCollapsed:false,
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
    },
});
export const { setUser, setSidebarOpen, setDesktopCollapsed } = appSlice.actions;

export default appSlice.reducer;
