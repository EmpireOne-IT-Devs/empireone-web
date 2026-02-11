import axios from "axios";

export async function get_app_data_service() {
    return await axios.get("/api/get_app_data");
}
