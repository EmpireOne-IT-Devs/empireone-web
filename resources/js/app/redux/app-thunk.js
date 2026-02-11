import { get_app_data_service } from "../services/app-service";
import { appSlice } from "./app-slice";

export function get_app_data_thunk(product_id) {
    return async function (dispatch, getState) {
        const result = await get_app_data_service();
        dispatch(appSlice.actions.setData(result.data));
    };
}