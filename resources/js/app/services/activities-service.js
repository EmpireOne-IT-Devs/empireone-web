import axios from "axios";

export async function get_upcoming_birthdays_service() {
    return await axios.get("/api/activities/upcoming_birthdays");
}

export async function get_activity_posts_service() {
    return await axios.get("/api/activities/posts");
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
        return await axios.post("/api/activities/posts", form);
    }

    // For non-file posts, rename array keys to the bracket notation expected
    // by Laravel's array validation (options → options[]).
    const payload = { ...data };
    if (Array.isArray(payload.options)) {
        // Laravel's JSON body decoder accepts plain arrays under the same key.
        // No transformation needed — keep as-is.
    }
    return await axios.post("/api/activities/posts", payload);
}

export async function cast_poll_vote_service(postId, optionId) {
    return await axios.post(`/api/activities/polls/${postId}/vote`, {
        option_id: optionId,
    });
}

export async function get_poll_analytics_service() {
    return await axios.get("/api/activities/polls/analytics");
}

export async function get_poll_analytics_dashboard_service() {
    return await axios.get("/api/activities/polls/analytics/dashboard");
}

export async function get_poll_details_service(postId) {
    return await axios.get(`/api/activities/polls/${postId}`);
}

export async function get_poll_vote_records_service(postId) {
    return await axios.get(`/api/activities/polls/${postId}/vote-records`);
}

export async function export_poll_vote_records_service(postId) {
    return await axios.get(`/api/activities/polls/${postId}/vote-records/export`, {
        responseType: "blob",
    });
}

export async function close_poll_service(postId) {
    return await axios.post(`/api/activities/polls/${postId}/close`);
}

export async function reopen_poll_service(postId) {
    return await axios.post(`/api/activities/polls/${postId}/reopen`);
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
