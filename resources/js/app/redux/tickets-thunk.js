import { get_my_tickets_service, get_ticketing_tables_service } from "../services/tickets-service";
import { ticketsSlice } from "./tickets-slice";

export function get_my_tickets_thunk(product_id) {
    return async function (dispatch, getState) {
        const result = await get_my_tickets_service();
        dispatch(ticketsSlice.actions.setTickets(result.data));
    };
}


export function get_ticketing_tables_thunk(product_id) {
    return async function (dispatch, getState) {
        const result = await get_ticketing_tables_service();
        dispatch(ticketsSlice.actions.setTables(result.data));
    };
}