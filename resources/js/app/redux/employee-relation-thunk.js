import { get_employees_service } from "../services/employee-relation-service";
import { employeeRelationSlice } from "./employee-relation-slice";

export function get_employees_thunk() {
    return async function (dispatch, getState) {
        const result = await get_employees_service();
        dispatch(employeeRelationSlice.actions.setEmployees(result.data));
    };
}
