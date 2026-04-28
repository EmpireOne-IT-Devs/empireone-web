import axios from "axios";

export async function get_applicants_service() {
    return await axios.get("/api/job/applicants");
}


export async function get_applicant_pooling_service() {
    return await axios.get("/api/job/get_applicant_pooling");
}