import { get_job_offer_by_user_service } from "../services/job-offer-service";
import { applicantSlice } from "./applicant-slice";

export function get_job_offer_by_user_thunk() {
    return async function (dispatch, getState) {
        const result = await get_job_offer_by_user_service();
        dispatch(applicantSlice.actions.setJobOffers(result.data));
    };
}
