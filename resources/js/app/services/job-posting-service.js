import axios from "axios";
export async function create_job_posting_service(data) {
    return await axios.post("/api/job/postings", data);
}

export async function get_job_postings_service() {
    return await axios.get("/api/job/postings");
}

export async function get_job_offers_service() {
    return (await axios.get(`/api/job/offers${window.location.search}`));
}


export async function get_job_offers_by_job_posting_service(id) {
    return (await axios.get(`/api/job/get_job_offers_by_job_posting/${id}`)).data;
}

export async function delete_job_postings_service(id) {
    try {
        const result = axios.delete(`/api/job/postings/${id}`);
        return result;
    } catch (error) {}
}

export async function send_job_offer_service(data) {
    try {
        const result = axios.post(`/api/job/send_job_offer`, data);
        return result;
    } catch (error) {}
}
