import axios from "axios";

export async function get_attrition_by_id_service(id) {
    return await axios.get(`/api/er/attrition/${id}`);
}

export async function add_exit_clearance_service(data) {
    return await axios.post(`/api/er/exit_clearance`, data);
}

export async function performance_management_dashboard_service(data) {
    return (await axios.get(`/api/er/performance_management_dashboard`, data))
        .data;
}

export async function get_ai_cocd_service(data) {
    return (await axios.post(`/api/er/get_ai_cocd`, data)).data;
}

export async function create_reach_service(data) {
    return await axios.post(`/api/er/reach`, data);
}

export async function create_pip_service(data) {
    return await axios.post(`/api/er/pip`, data);
}

export async function get_pip_service() {
    return (await axios.get(`/api/er/pip${window.location.search}`)).data;
}

export async function export_change_form_service(data) {
    return await axios.post(
        `/api/er/export_change_form${window.location.search}`,
        data,
    );
}

export async function create_corrective_action_service(data) {
    return await axios.post(`/api/er/corrective_action`, data);
}
export async function get_corrective_actions_specific_leader_service(id) {
    return await axios.get(
        `/api/er/get_corrective_actions_specific_leader${window.location.search}`,
    );
}

export async function get_corrective_action_by_id_service(id) {
    return await axios.get(`/api/er/corrective_action/${id}`);
}

export async function sign_corrective_action_service(data) {
    return await axios.post(`/api/er/sign_corrective_action`, data);
}
export async function get_reach_specific_leader_service() {
    return await axios.get(
        `/api/er/get_reach_specific_leader${window.location.search}`,
    );
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

export async function get_201_files_service() {
    return await axios.get(`/api/er/get_201_files${window.location.search}`);
}

export async function update_201_files_service(data) {
    return await axios.post(`/api/er/update_201_files`, data);
}

export async function update_or_create_account_service(data) {
    return await axios.post(`/api/er/accounts`, data);
}
export async function update_or_create_department_service(data) {
    return await axios.post(`/api/er/departments`, data);
}
