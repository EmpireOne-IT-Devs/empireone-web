import axios from "axios";

export async function get_employees_service(data) {
    return await axios.get(`/api/accounts/employees`, data);
}