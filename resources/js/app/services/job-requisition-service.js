import axios from "axios";

export async function create_job_requisition_service(data) {
    return await axios.post("/api/job/requisitions", data);
}

export async function approve_job_requisition_service(data) {
    return await axios.post("/api/job/approve_job_requisition", data);
}

export async function add_account_access_service(data) {
    return await axios.post("/api/job/account_access", data);
}

export async function get_job_interview_service() {
    return (await axios.get(`/api/job/job_interview${window.location.search}`))
        .data;
}

export async function get_job_requisitions_service() {
    return (await axios.get(`/api/job/requisitions${window.location.search}`))
        .data;
}

export async function get_job_requisitions_by_id_service() {
    return (
        await axios.get(
            `/api/job/requisitions/${window.location.pathname.split("/")[3]}`,
        )
    ).data;
}
