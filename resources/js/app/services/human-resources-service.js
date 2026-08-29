export async function get_attrition_by_id_service(id) {
    return await axios.get(`/api/er/attrition/${id}`);
}
