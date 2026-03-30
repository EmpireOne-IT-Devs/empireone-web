import { get_app_data_service } from "../services/app-service";
import { get_user_by_id_service } from "../services/user-service";
import { appSlice } from "./app-slice";

export function get_app_data_thunk(product_id) {
    return async function (dispatch, getState) {
        const result = await get_app_data_service();
        dispatch(appSlice.actions.setData(result.data));
    };
}

export function get_user_by_id_thunk(user_id) {
    return async function (dispatch, getState) {
        const result = await get_user_by_id_service(user_id);
        dispatch(appSlice.actions.setUser(result.data));
    };
}
