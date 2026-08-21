import axios from "axios";
export async function create_job_posting_service(data) {
    return await axios.post("/api/job/postings", data);
}

export async function get_erps_service() {
    return (await axios.get(`/api/job/get_erps${window.location.search}`)).data;
}

export async function get_job_postings_service() {
    return await axios.get(`/api/job/postings${window.location.search}`);
}

export async function get_job_posting_by_id_service(id) {
    return await axios.get(`/api/job/postings/${id}`);
}
export async function get_job_posting_by_location_service(id) {
    return await axios.get(`/api/get_job_posting_by_location/${id}`);
}

export async function get_ta_dashboard_stats_service() {
    return (await axios.get("/api/job/dashboard_stats")).data;
}

export async function get_ta_recent_activity_service() {
    return (await axios.get("/api/job/recent_activity")).data;
}

export async function get_ta_top_performing_jobs_service() {
    return (await axios.get("/api/job/top_performing_jobs")).data;
}

export async function get_job_offers_service() {
    return await axios.get(`/api/job/offers${window.location.search}`);
}

export async function get_job_offers_by_job_posting_service(id) {
    return (await axios.get(`/api/job/get_job_offers_by_job_posting/${id}`))
        .data;
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
