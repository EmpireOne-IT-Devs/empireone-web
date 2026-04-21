import axios from "axios";

export async function get_job_offer_by_user_service() {
    return await axios.get("/api/job/get_job_offer_by_user");
}

export async function submit_job_offer_service(data) {
    return await axios.post("/api/job/submit_job_offer",data);
}

export async function get_job_offer_by_id_service(id) {
    return (await axios.get(`/api/job/offers/${id}`)).data;
}
