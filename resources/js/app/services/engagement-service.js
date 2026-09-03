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

export async function upload_gallery_service(formData) {
    return await axios.post("/api/engagement/post_events/upload-gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function get_reward_recognitions_service() {
    return await axios.get("/api/engagement/reward-recognitions");
}

export async function search_reward_recognition_employees_service(search = "") {
    return await axios.get("/api/engagement/reward-recognitions/search-employees", {
        params: { search },
    });
}

export async function create_reward_recognition_service(data) {
    return await axios.post("/api/engagement/reward-recognitions", data);
}

export async function get_reward_recognition_service(id) {
    return await axios.get(`/api/engagement/reward-recognitions/${id}`);
}

export async function update_reward_recognition_service(id, data) {
    return await axios.put(`/api/engagement/reward-recognitions/${id}`, data);
}

export async function delete_reward_recognition_service(id) {
    return await axios.delete(`/api/engagement/reward-recognitions/${id}`);
}

export async function get_reward_challenges_service() {
    return await axios.get("/api/engagement/reward-challenges");
}

export async function get_reward_challenge_options_service() {
    return await axios.get("/api/engagement/reward-challenges/options");
}

export async function create_reward_challenge_service(formData) {
    return await axios.post("/api/engagement/reward-challenges", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function update_reward_challenge_service(id, formData) {
    formData.append("_method", "PUT");
    return await axios.post(`/api/engagement/reward-challenges/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function delete_reward_challenge_service(id) {
    return await axios.delete(`/api/engagement/reward-challenges/${id}`);
}

export async function get_my_reward_challenges_service() {
    return await axios.get("/api/engagement/reward-challenges/my");
}

export async function get_reward_challenge_profile_summary_service() {
    return await axios.get("/api/engagement/reward-challenges/profile-summary");
}

export async function join_reward_challenge_service(id) {
    return await axios.post(`/api/engagement/reward-challenges/${id}/join`);
}

export async function leave_reward_challenge_service(id) {
    return await axios.delete(`/api/engagement/reward-challenges/${id}/leave`);
}

export async function submit_reward_challenge_proof_service(id, photo) {
    const formData = new FormData();
    formData.append("photo", photo);

    return await axios.post(`/api/engagement/reward-challenges/${id}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function get_reward_challenge_submissions_service(status) {
    return await axios.get("/api/engagement/reward-challenge-submissions", {
        params: status ? { status } : {},
    });
}

export async function get_reward_challenge_submission_stats_service() {
    return await axios.get("/api/engagement/reward-challenge-submissions/stats");
}

export async function approve_reward_challenge_submission_service(id) {
    return await axios.post(`/api/engagement/reward-challenge-submissions/${id}/approve`);
}

export async function decline_reward_challenge_submission_service(id, review_note) {
    return await axios.post(`/api/engagement/reward-challenge-submissions/${id}/decline`, { review_note });
}