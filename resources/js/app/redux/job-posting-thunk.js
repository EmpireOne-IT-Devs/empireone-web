import { get_applicants_service } from "../services/applicants-service";
import { get_job_application_by_id_service } from "../services/job-application-service";
import { get_job_offers_service, get_job_postings_service } from "../services/job-posting-service";
import { jobPostingsSlice } from "./job-posting-slice";

export function get_job_posting_thunk() {
    return async function (dispatch, getState) {
        const result = await get_job_postings_service();
        dispatch(jobPostingsSlice.actions.setJobPostings(result.data));
    };
}


export function get_job_offers_thunk() {
    return async function (dispatch, getState) {
        const result = await get_job_offers_service();
        dispatch(jobPostingsSlice.actions.setJobOffers(result.data));
    };
}


export function get_applicants_thunk() {
    return async function (dispatch, getState) {
        const result = await get_applicants_service();
        dispatch(jobPostingsSlice.actions.setApplicants(result.data.data));
    };
}


export function get_job_application_by_id_thunk() {
    return async function (dispatch, getState) {
        const result = await get_job_application_by_id_service();
        dispatch(jobPostingsSlice.actions.setJobApplications(result.data));
    };
}