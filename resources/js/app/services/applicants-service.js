import axios from "axios";

export async function get_applicants_service() {
    return await axios.get(`/api/job/applicants${window.location.search}`);
}

export async function get_employee_applicants_service() {
    return await axios.get(`/api/job/employee_applicants${window.location.search}`);
}


export async function get_applicant_pooling_service() {
    return await axios.get("/api/job/get_applicant_pooling");
}
