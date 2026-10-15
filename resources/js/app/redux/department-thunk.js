import { get_my_team_service } from "../services/account-service";
import { get_departments_service } from "../services/department-service";
import { departmentsSlice } from "./department-slice";

export function get_departments_thunk() {
    return async function (dispatch, getState) {
        const result = await get_departments_service();
        dispatch(departmentsSlice.actions.setDepartments(result.data));
    };
}

export function get_my_team_thunk() {
    return async function (dispatch, getState) {
        const result = await get_my_team_service();
        dispatch(departmentsSlice.actions.setTeams(result.data));
    };
}
