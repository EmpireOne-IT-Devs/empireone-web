export async function create_post_event_service(data) {
    return await axios.post("/api/engagement/post_events", data);
}

export async function get_post_event_service(data) {
    return await axios.get("/api/engagement/post_events", data);
}

export async function get_post_event_by_id_service(data) {
    return await axios.get(`/api/engagement/post_events/${data}`);
}


export async function update_post_event_by_id_service(data) {
    return await axios.put(`/api/engagement/post_events/${data}`);
}