import axios from "axios";

export async function create_job_requisition_service(data) {
    return await axios.post("/api/job-requisitions", data);
}

export async function get_job_requisitions_service() {
    return (await axios.get("/api/job-requisitions")).data;
}
