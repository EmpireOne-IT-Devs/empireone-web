import axios from "axios";

export async function create_employee_change_form_service(data) {
    return await axios.post("/api/er/employee_change_form", data);
}

export async function get_employee_change_form_service() {
    return await axios.get(`/api/er/employee_change_form${window.location.search}`);
}


export async function get_employee_change_form_by_id_service(id) {
    return (await axios.get(`/api/er/employee_change_form/${id}`)).data;
}

export async function accept_employee_change_form_service(data) {
    return await axios.post("/api/er/accept_employee_change_form",data);
}