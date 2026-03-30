import axios from "axios";

export async function create_users_service(data) {
    try {
        const response = await axios.post("/api/users", data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function get_users_service() {
    try {
        const response = await axios.get("/api/users", {
            headers: {
                Accept: "application/json",
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function get_user_by_id_service(id) {
    return (await axios.get(`/api/accounts/get_user_by_id/${id}`)).data;
}
