import { get_departments_service } from "../services/department-service";
import { departmentsSlice } from "./department-slice";

export function get_departments_thunk() {
    return async function (dispatch, getState) {
        const result = await get_departments_service();
        dispatch(departmentsSlice.actions.setDepartments(result.data));
    };
}
