import axios from "axios";

export async function get_employees_service(data, all = false) {
    const search = window.location.search;
    const separator = search ? "&" : "?";
    const allParam = all ? `${separator}all=1` : "";
    return (
        await axios.get(
            `/api/accounts/employees${search}${allParam}`,
            data,
        )
    ).data;
}

export async function get_probationary_service() {
    return (await axios.get(`/api/accounts/get_probationary`)).data;
}

export async function get_attritions_service() {
    return (await axios.get(`/api/er/attrition`)).data;
}

export async function add_attrition_service(data) {
    return (await axios.post(`/api/er/attrition`, data)).data;
}

export async function get_regular_service() {
    return (await axios.get(`/api/accounts/get_regular`)).data;
}

export async function add_acknowledgement_service(data) {
    return (await axios.post(`/api/er/acknowledgement`, data)).data;
}

export async function add_sub_acknowledgement_service(data) {
    return (await axios.post(`/api/er/add_sub_acknowledgement`, data)).data;
}

export async function get_acknowledgement_service() {
    return (await axios.get(`/api/er/acknowledgement`)).data;
}

export async function add_acknowledgement_employee_service(data) {
    return (await axios.post(`/api/er/acknowledgement_employee`, data)).data;
}
