import axios from "axios";

export async function get_post_event_surveys_service() {
    return await axios.get("/api/engagement/surveys");
}

export async function get_post_event_survey_service(id) {
    return await axios.get(`/api/engagement/surveys/${id}`);
}

export async function create_post_event_survey_service(data) {
    return await axios.post("/api/engagement/surveys", data);
}

export async function submit_post_event_survey_service(id, data) {
    return await axios.post(`/api/engagement/surveys/${id}/submit`, data);
}

export async function get_survey_responses_service(id) {
    return await axios.get(`/api/engagement/surveys/${id}/responses`);
}

export async function get_survey_analytics_service(id) {
    return await axios.get(`/api/engagement/surveys/${id}/analytics`);
}

export async function close_post_event_survey_service(id) {
    return await axios.post(`/api/engagement/surveys/${id}/close`);
}

export async function reopen_post_event_survey_service(id) {
    return await axios.post(`/api/engagement/surveys/${id}/reopen`);
}

export async function delete_post_event_survey_service(id) {
    return await axios.delete(`/api/engagement/surveys/${id}`);
}

