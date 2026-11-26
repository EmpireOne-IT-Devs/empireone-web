import { get_job_application_by_user_service } from "./job-application-service";
import { get_my_tickets_service } from "./tickets-service";
import { get_post_event_service } from "./engagement-service";

export async function get_recent_activity_service() {
    const [postsResponse, applicationsResponse, ticketsResponse] =
        await Promise.all([
            get_post_event_service(),
            get_job_application_by_user_service(),
            get_my_tickets_service(),
        ]);

    return {
        posts: postsResponse.data?.data ?? [],
        applications: applicationsResponse.data ?? [],
        tickets: ticketsResponse.data?.data ?? [],
    };
}
