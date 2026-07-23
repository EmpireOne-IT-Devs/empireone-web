import axios from "axios";

export async function get_applicants_service() {
    return await axios.get(`/api/job/applicants${window.location.search}`);
}

export async function delete_applicant_service(id) {
    return await axios.post(`/api/job/delete_applicant/${id}`);
}

export async function checking_applicant_service(data) {
    return (await axios.post(`/api/job/checking_applicant`,data)).data;
}

export async function get_employee_applicants_service() {
    return await axios.get(
        `/api/job/employee_applicants${window.location.search}`,
    );
}

export async function get_applicant_pooling_service() {
    return await axios.get("/api/job/get_applicant_pooling");
}
