import axios from "axios";

export async function add_leader_service(data) {
    return await axios.post("/api/er/leaders", data);
}

export async function get_leader_service(data) {
    return await axios.get("/api/er/leaders", data);
}

export async function get_leader_by_id_service(id) {
    return await axios.get(`/api/er/leaders/${id}`);
}

export async function add_subordinates_service(data) {
    return await axios.post("/api/er/subordinates", data);
}
