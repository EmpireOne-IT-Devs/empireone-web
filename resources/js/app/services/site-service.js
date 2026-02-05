import axios from "axios";
export async function create_site_service(data) {
    return await axios.post("/api/sites", data);
}

export async function get_sites_service() {
    return await axios.get("/api/sites");
}
