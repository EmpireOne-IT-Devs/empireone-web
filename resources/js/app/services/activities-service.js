import axios from "axios";

export async function get_upcoming_birthdays_service() {
    return await axios.get("/api/activities/upcoming_birthdays");
}

export async function get_activity_posts_service() {
    return await axios.get("/api/activities/posts");
}

export async function publish_activity_post_service(data) {
    return await axios.post("/api/activities/posts", data);
}

export async function get_upcoming_events_service() {
    return await axios.get("/api/activities/upcoming_events");
}

export async function update_activity_post_service(id, data) {
    return await axios.put(`/api/activities/posts/${id}`, data);
}

export async function delete_activity_post_service(id) {
    return await axios.delete(`/api/activities/posts/${id}`);
}
