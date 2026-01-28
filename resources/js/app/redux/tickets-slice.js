import { createSlice } from "@reduxjs/toolkit";

export const ticketsSlice = createSlice({
    name: "tickets",
    initialState: {
        ticket: {},
        tickets: [],
        tables: {
            departments:[]
        },
    },
    reducers: {
        setTicket: (state, action) => {
            state.ticket = action.payload;
        },
        setTickets: (state, action) => {
            state.tickets = action.payload;
        },
        setTables: (state, action) => {
            state.tables = action.payload;
        },
    },
});
export const { setTicket, setTickets, setTables } = ticketsSlice.actions;

export default ticketsSlice.reducer;
