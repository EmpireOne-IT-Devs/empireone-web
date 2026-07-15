import axios from "axios";

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

export async function get_engagement_post_comments_service(postId) {
    return await axios.get(`/api/engagement/post_events/${postId}/comments`);
}

export async function add_engagement_post_comment_service(postId, body) {
    return await axios.post(`/api/engagement/post_events/${postId}/comments`, { body });
}

export async function delete_engagement_post_comment_service(postId, commentId) {
    return await axios.delete(`/api/engagement/post_events/${postId}/comments/${commentId}`);
}

export async function toggle_engagement_reaction_service(postId) {
    return await axios.post(`/api/engagement/post_events/${postId}/react`);
}

export async function get_upcoming_birthdays_service() {
    return await axios.get("/api/engagement/upcoming_birthdays");
}

export async function cast_poll_vote_service(postId, optionId) {
    return await axios.post(`/api/engagement/polls/${postId}/vote`, { option_id: optionId });
}

export async function close_poll_service(postId) {
    return await axios.post(`/api/engagement/polls/${postId}/close`);
}

export async function reopen_poll_service(postId) {
    return await axios.post(`/api/engagement/polls/${postId}/reopen`);
}