import {
    get_job_requisitions_by_id_service,
    get_job_requisitions_service,
} from "../services/job-requisition-service";
import { jobRequisitionSlice } from "./job-requisition-slice";

export function get_job_requisitions_thunk() {
    return async function (dispatch, getState) {
        const result = await get_job_requisitions_service();
        dispatch(jobRequisitionSlice.actions.setJobRequisitions(result.data));
        dispatch(jobRequisitionSlice.actions.setStats(result.stats));
        dispatch(jobRequisitionSlice.actions.setSearchJobRequisition(result.search_job_requisition));
        
    };
}

export function get_job_requisitions_by_id_thunk() {
    return async function (dispatch, getState) {
        const result = await get_job_requisitions_by_id_service();
        dispatch(jobRequisitionSlice.actions.setJobRequisition(result.data));
    };
}
