import axios from "axios";

export async function get_post_event_surveys_service() {
    return await axios.get("/api/activities/surveys");
}

export async function get_post_event_survey_service(id) {
    return await axios.get(`/api/activities/surveys/${id}`);
}

export async function create_post_event_survey_service(data) {
    return await axios.post("/api/activities/surveys", data);
}

export async function submit_post_event_survey_service(id, data) {
    return await axios.post(`/api/activities/surveys/${id}/submit`, data);
}

export async function get_survey_responses_service(id) {
    return await axios.get(`/api/activities/surveys/${id}/responses`);
}

export async function close_post_event_survey_service(id) {
    return await axios.post(`/api/activities/surveys/${id}/close`);
}

export async function reopen_post_event_survey_service(id) {
    return await axios.post(`/api/activities/surveys/${id}/reopen`);
}

export async function delete_post_event_survey_service(id) {
    return await axios.delete(`/api/activities/surveys/${id}`);
}
