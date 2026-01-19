import axios from "axios";
export async function create_job_posting_service(data) {
    return await axios.post("/api/job-postings", data);
}
