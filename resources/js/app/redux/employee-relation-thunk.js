import {
    get_applicant_pooling_service,
    get_employee_applicants_service,
} from "../services/applicants-service";
import {
    get_employee_change_form_by_id_service,
    get_employee_change_form_service,
} from "../services/employee-change-form-service";
import {
    get_employees_service,
    get_probationary_service,
    get_regular_service,
} from "../services/employee-relation-service";
import {
    get_leader_by_id_service,
    get_leader_service,
} from "../services/er-leaders-service";
import {
    get_performance_evaluation_by_id_service,
    get_performance_evaluation_service,
} from "../services/performance-evaluation-service";
import { employeeRelationSlice } from "./employee-relation-slice";

export function get_employees_thunk() {
    return async function (dispatch, getState) {
        const result = await get_employees_service();
        dispatch(employeeRelationSlice.actions.setEmployees(result.data));
    };
}

export function get_employee_applicants_thunk() {
    return async function (dispatch, getState) {
        const result = await get_employee_applicants_service();
        dispatch(employeeRelationSlice.actions.setApplicants(result.data));
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

export function get_regular_thunk() {
    return async function (dispatch, getState) {
        const result = await get_regular_service();
        dispatch(employeeRelationSlice.actions.setRegulars(result.data));
    };
}

export function get_leader_thunk() {
    return async function (dispatch, getState) {
        const result = await get_leader_service();
        dispatch(employeeRelationSlice.actions.setLeaders(result.data));
        dispatch(employeeRelationSlice.actions.setUsers(result.users));
    };
}

export function get_leader_by_id_thunk(id) {
    return async function (dispatch, getState) {
        const result = await get_leader_by_id_service(id);
        dispatch(employeeRelationSlice.actions.setLeader(result.data));
    };
}
export function get_performance_evaluation_by_id_thunk(id) {
    return async function (dispatch, getState) {
        const result = await get_performance_evaluation_by_id_service(id);
        dispatch(employeeRelationSlice.actions.setEvaluation(result.data));
    };
}

export function get_performance_evaluation_thunk() {
    return async function (dispatch, getState) {
        const result = await get_performance_evaluation_service();
        dispatch(employeeRelationSlice.actions.setEvaluations(result.data));
    };
}

export function get_employee_change_form_thunk() {
    return async function (dispatch, getState) {
        const result = await get_employee_change_form_service();
        dispatch(employeeRelationSlice.actions.setECFs(result.data));
    };
}

export function get_employee_change_form_by_id_thunk(id) {
    return async function (dispatch, getState) {
        const result = await get_employee_change_form_by_id_service(id);
        dispatch(employeeRelationSlice.actions.setECF(result.data));
    };
}

// export function get_performance_evaluation_by_user_id_thunk(id) {
//     return async function (dispatch, getState) {
//         const result = await get_performance_evaluation_by_user_id_service(id);
//         dispatch(employeeRelationSlice.actions.setEvaluations(result.data));
//     };
// }
