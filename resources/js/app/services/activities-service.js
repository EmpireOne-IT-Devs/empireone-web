import axios from "axios";

export async function get_upcoming_birthdays_service() {
    return await axios.get("/api/engagement/upcoming_birthdays");
}

export async function get_activity_posts_service() {
    return await axios.get("/api/engagement/post_events");
}

export async function publish_activity_post_service(data) {
    // If a media file is attached, send as multipart/form-data.
    // Do NOT manually set Content-Type — axios sets it automatically with the
    // correct boundary when FormData is the request body.
    if (data.media instanceof File) {
        const form = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value === null || value === undefined) return;
            // Send arrays (e.g. poll options) as repeated indexed fields.
            if (Array.isArray(value)) {
                value.forEach((item) => form.append(`${key}[]`, item));
            } else {
                form.append(key, value);
            }
        });
        return await axios.post("/api/engagement/post_events", form);
    }

    // For non-file posts, rename array keys to the bracket notation expected
    // by Laravel's array validation (options → options[]).
    const payload = { ...data };
    if (Array.isArray(payload.options)) {
        // Laravel's JSON body decoder accepts plain arrays under the same key.
        // No transformation needed — keep as-is.
    }
    return await axios.post("/api/engagement/post_events", payload);
}

export async function cast_poll_vote_service(postId, optionId) {
    return await axios.post(`/api/engagement/polls/${postId}/vote`, {
        option_id: optionId,
    });
}

export async function get_poll_analytics_service() {
    return await axios.get("/api/engagement/polls/analytics");
}

export async function get_poll_analytics_dashboard_service() {
    return await axios.get("/api/engagement/polls/analytics/dashboard");
}

export async function get_poll_details_service(postId) {
    return await axios.get(`/api/engagement/polls/${postId}`);
}

export async function get_poll_vote_records_service(postId) {
    return await axios.get(`/api/engagement/polls/${postId}/vote-records`);
}

export async function export_poll_vote_records_service(postId) {
    return await axios.get(`/api/engagement/polls/${postId}/vote-records/export`, {
        responseType: "blob",
    });
}

export async function close_poll_service(postId) {
    return await axios.post(`/api/engagement/polls/${postId}/close`);
}

export async function reopen_poll_service(postId) {
    return await axios.post(`/api/engagement/polls/${postId}/reopen`);
}

export async function get_upcoming_events_service() {
    return await axios.get("/api/engagement/upcoming_events");
}

export async function update_activity_post_service(id, data) {
    return await axios.put(`/api/engagement/post_events/${id}`, data);
}

export async function delete_activity_post_service(id) {
    return await axios.delete(`/api/engagement/post_events/${id}`);
}


export async function toggle_reaction_service(postId, type = 'heart') {
    return await axios.post(`/api/engagement/post_events/${postId}/react`, { type });
}

export async function get_post_comments_service(postId) {
    return await axios.get(`/api/engagement/post_events/${postId}/comments`);
}

export async function add_post_comment_service(postId, body) {
    return await axios.post(`/api/engagement/post_events/${postId}/comments`, { body });
}

export async function delete_post_comment_service(postId, commentId) {
    return await axios.delete(`/api/engagement/post_events/${postId}/comments/${commentId}`);
}
