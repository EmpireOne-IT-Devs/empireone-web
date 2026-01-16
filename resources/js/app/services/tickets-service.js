import axios from "axios";
 export async function create_tickets_service(data) {
    return await axios.post('/api/tickets',data)
}