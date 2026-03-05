import axios from "axios";

export async function create_job_requisition_logs_service(data) {
    return await axios.post("/api/job/requisition_logs", data);
}
