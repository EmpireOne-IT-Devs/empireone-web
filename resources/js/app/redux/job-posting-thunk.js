import { get_job_postings_service } from "../services/job-posting-service";
import { jobPostingsSlice } from "./job-posting-slice";

export function get_job_posting_thunk() {
    return async function (dispatch, getState) {
        const result = await get_job_postings_service();
        dispatch(jobPostingsSlice.actions.setJobPostings(result.data));
    };
}