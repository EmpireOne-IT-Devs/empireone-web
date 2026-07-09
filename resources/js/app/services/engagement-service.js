export async function create_post_event_service(data) {
    return await axios.post("/api/engagement/post_events", data);
}

export async function get_post_event_service() {
    return await axios.get("/api/engagement/post_events");
}

export async function get_post_event_by_id_service(id) {
    return await axios.get(`/api/engagement/post_events/${id}`);
}

export async function update_post_event_by_id_service(id, data) {
    return await axios.put(`/api/engagement/post_events/${id}`, data);
}

export async function delete_post_event_service(id) {
    return await axios.delete(`/api/engagement/post_events/${id}`);
}