import axios from "axios";
export async function create_job_posting_service(data) {
    return await axios.post("/api/job/postings", data);
}

export async function get_job_postings_service() {
    return await axios.get("/api/job/postings");
}
export async function delete_job_postings_service(id) {
    try {
        const result = axios.delete(`/api/job/postings/${id}`);
        return result;
    } catch (error) {}
}
