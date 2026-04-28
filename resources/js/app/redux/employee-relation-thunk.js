import { get_applicant_pooling_service } from "../services/applicants-service";
import { get_employees_service, get_probationary_service } from "../services/employee-relation-service";
import { employeeRelationSlice } from "./employee-relation-slice";

export function get_employees_thunk() {
    return async function (dispatch, getState) {
        const result = await get_employees_service();
        dispatch(employeeRelationSlice.actions.setEmployees(result.data));
    };
}


export function get_applicant_pooling_thunk() {
    return async function (dispatch, getState) {
        const result = await get_applicant_pooling_service();
        dispatch(employeeRelationSlice.actions.setPools(result.data));
    };
}

export function get_probationary_thunk() {
    return async function (dispatch, getState) {
        const result = await get_probationary_service();
        console.log('resultresult',result.data)
        dispatch(employeeRelationSlice.actions.setProbationaries(result.data));
    };
}
