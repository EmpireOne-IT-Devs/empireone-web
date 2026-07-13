import { get_app_data_service, get_job_interview_by_id_service } from "../services/app-service";
import {
    get_job_interviewer_schedule_by_interviewer_id_service,
    get_job_interviewer_schedule_service,
} from "../services/job-interviewer-schedule-service";
import { get_user_by_id_service } from "../services/user-service";
import { appSlice } from "./app-slice";

export function get_app_data_thunk(product_id) {
    return async function (dispatch, getState) {
        const result = await get_app_data_service();
        dispatch(appSlice.actions.setData(result.data));
    };
}



export function get_job_interview_by_id_thunk(id) {
    return async function (dispatch, getState) {
        const result = await get_job_interview_by_id_service(id);
        dispatch(appSlice.actions.setJobInterview(result.data));
    };
}

export function get_job_interviewer_schedule_thunk() {
    return async function (dispatch, getState) {
        const result = await get_job_interviewer_schedule_service();
        dispatch(appSlice.actions.setInterviewers(result.data));
        dispatch(appSlice.actions.setTAs(result.tas));
    };
}

export function get_job_interviewer_schedule_by_interviewer_id_thunk(
    interviewer_id,
) {
    return async function (dispatch, getState) {
        const result =
            await get_job_interviewer_schedule_by_interviewer_id_service(
                interviewer_id,
            );
        dispatch(appSlice.actions.setInterviewer(result.data));
    };
}

export function get_user_by_id_thunk(user_id) {
    return async function (dispatch, getState) {
        const result = await get_user_by_id_service(user_id);
        dispatch(appSlice.actions.setUser(result.data));
    };
}
