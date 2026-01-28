import axios from "axios";
export async function create_tickets_service(data) {
    return await axios.post("/api/tickets", data);
}

export async function get_my_tickets_service() {
    return await axios.get("/api/my_tickets");
}

export async function get_ticketing_tables_service() {
    return await axios.get("/api/ticketing_tables");
}
