import axios from "axios";

export async function get_attrition_by_id_service(id) {
    return await axios.get(`/api/er/attrition/${id}`);
}

export async function add_exit_clearance_service(data) {
    return await axios.post(`/api/er/exit_clearance`, data);
}

export async function add_exit_interview_service(data) {
    return await axios.post(`/api/er/exit_interview`, data);
}

export async function search_employee_service(value) {
    return await axios.get(`/api/er/search_employee?search=${value}`);
}

export async function employee_change_form_service() {
    return await axios.get(`/api/er/employee_change_form`);
}
