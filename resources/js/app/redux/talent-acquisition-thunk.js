import { get_job_applicant_schedule_service } from "../services/job-applicant-schedule-service";
import { get_job_interview_service } from "../services/job-requisition-service";
import { talentAcquisitionSlice } from "./talent-acquisition-slice";

export function get_job_applicant_schedule_thunk() {
    return async function (dispatch, getState) {
        const result = await get_job_applicant_schedule_service();
        dispatch(talentAcquisitionSlice.actions.setSchedules(result.data));
    };
}

export function get_job_interview_thunk() {
    return async function (dispatch, getState) {
        const result = await get_job_interview_service();
        dispatch(talentAcquisitionSlice.actions.setInterviews(result.data));
    };
}
