import axios from "axios";

export async function get_app_data_service() {
    return await axios.get("/api/get_app_data");
}

export async function get_job_interview_by_id_service(id) {
    return await axios.get(`/api/get_job_interview_by_id/${id}`);
}


export async function get_location_service() {
    return await axios.get("/api/location");
}
