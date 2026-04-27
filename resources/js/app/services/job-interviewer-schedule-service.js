export async function get_job_interviewer_schedule_service() {
    return (await axios.get(`/api/job/job_interviewer_schedules`)).data;
}

export async function create_job_interviewer_schedule_service(data) {
    return await axios.post(`/api/job/job_interviewer_schedules`,data);
}

export async function get_job_interviewer_schedule_by_interviewer_id_service(
    interviewer_id,
) {
    return (
        await axios.get(`/api/job/job_interviewer_schedules/${interviewer_id}`)
    ).data;
}
