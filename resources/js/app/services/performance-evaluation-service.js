import axios from "axios";
export async function create_performance_evaluation_service(data) {
    return await axios.post("/api/er/performance_evaluation", data);
}

export async function get_performance_evaluation_by_id_service(id) {
    return (await axios.get(`/api/er/performance_evaluation/${id}`)).data;
}

export async function get_performance_evaluation_service() {
    return (await axios.get(`/api/er/performance_evaluation${window.location.search}`)).data;
}
// export async function get_performance_evaluation_by_user_id_service(user_id) {
//     return await axios.get(`/api/er/performance_evaluation_by_user_id/${user_id}`);
// }
