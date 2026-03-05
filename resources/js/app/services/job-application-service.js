import axios from "axios";

export async function get_job_application_by_id_service() {
    return await axios.get(`/api/job/application/${window.location.pathname.split('/')[4]}`);
}
