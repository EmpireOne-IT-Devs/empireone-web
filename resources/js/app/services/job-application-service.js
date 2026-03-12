import axios from "axios";

export async function get_job_application_by_id_service() {
    return await axios.get(`/api/job/application/${window.location.pathname.split('/')[4]}`);
}


export async function update_job_application_status_service(data) {
    return await axios.post(`/api/job/update_job_application_status`,data);
}