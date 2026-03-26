import { get_documents_by_user_service } from "../services/documents-services";
import { get_job_offer_by_user_service } from "../services/job-offer-service";
import { applicantSlice } from "./applicant-slice";

export function get_job_offer_by_user_thunk() {
    return async function (dispatch, getState) {
        const result = await get_job_offer_by_user_service();
        dispatch(applicantSlice.actions.setJobOffers(result.data));
    };
}

export function get_documents_by_user_thunk() {
    return async function (dispatch, getState) {
        const result = await get_documents_by_user_service();
        dispatch(applicantSlice.actions.setDocuments(result.data));
        dispatch(applicantSlice.actions.setDocumentStats(result.data.stats));
    };
}
