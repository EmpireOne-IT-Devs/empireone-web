import axios from "axios";

export async function get_applicants_service() {
    return await axios.get("/api/job/applicants");
}