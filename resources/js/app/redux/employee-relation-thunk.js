import { get_applicant_pooling_service } from "../services/applicants-service";
import { get_employees_service, get_probationary_service } from "../services/employee-relation-service";
import { get_leader_by_id_service, get_leader_service } from "../services/er-leaders-service";
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
        dispatch(employeeRelationSlice.actions.setProbationaries(result.data));
    };
}


export function get_leader_thunk() {
    return async function (dispatch, getState) {
        const result = await get_leader_service();
        dispatch(employeeRelationSlice.actions.setLeaders(result.data));
    };
}


export function get_leader_by_id_thunk(id) {
    return async function (dispatch, getState) {
        const result = await get_leader_by_id_service(id);
        dispatch(employeeRelationSlice.actions.setLeader(result.data));
    };
}
