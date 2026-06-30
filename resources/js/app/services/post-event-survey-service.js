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

export async function delete_post_event_survey_service(id) {
    return await axios.delete(`/api/activities/surveys/${id}`);
}
