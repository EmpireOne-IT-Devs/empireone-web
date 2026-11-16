import axios from "axios";

const BASE = "/api/coe_requests";

export async function get_coe_requests_service(params = {}) {
    return (await axios.get(BASE, { params })).data;
}

export async function get_coe_status_service() {
    return (await axios.get(BASE + "/status")).data;
}

export async function create_coe_request_service(data) {
    return (await axios.post(BASE, data)).data;
}
