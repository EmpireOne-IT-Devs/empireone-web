import { createAsyncThunk } from "@reduxjs/toolkit";
import { get_recent_activity_service } from "../services/recent-activity-service";

function get_timestamp(value) {
    if (!value) return null;
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
}

function normalize_recent_activity({ posts, applications, tickets }) {
    const activities = [];

    (Array.isArray(posts) ? posts : []).forEach((post) => {
        if (post.scheduled_at && !post.published_at) return;

        const title = post.headline || post.title;
        const timestamp = get_timestamp(post.published_at || post.created_at);
        if (!title || timestamp === null) return;

        activities.push({
            id: `post-${post.id}`,
            type: post.type === "event" ? "event" : "post",
            title,
            source: post.category || post.author?.name || "Company update",
            timestamp,
        });
    });

    (Array.isArray(applications) ? applications : []).forEach(
        (application) => {
            const jobTitle =
                application?.job_posting?.job_requisition?.title ||
                application?.job_posting?.title;
            const status =
                application?.final_status ||
                application?.interview_status ||
                application?.screening_status ||
                "submitted";
            const timestamp = get_timestamp(
                application?.updated_at || application?.created_at,
            );
            if (timestamp === null) return;

            activities.push({
                id: `application-${application.id}`,
                type: "application",
                title: jobTitle
                    ? `Application for ${jobTitle}: ${status}`
                    : `Job application: ${status}`,
                source: "Job application",
                timestamp,
            });
        },
    );

    (Array.isArray(tickets) ? tickets : []).forEach((ticket) => {
        const identifier = ticket.ticketing_id || ticket.id;
        const timestamp = get_timestamp(ticket.updated_at || ticket.created_at);
        if (!identifier || timestamp === null) return;

        activities.push({
            id: `ticket-${identifier}`,
            type: "ticket",
            title: ticket.status
                ? `Ticket ${identifier}: ${ticket.status}`
                : `Ticket ${identifier} updated`,
            source: "Support ticket",
            timestamp,
        });
    });

    return activities
        .sort((first, second) => second.timestamp - first.timestamp)
        .slice(0, 5);
}

export const get_recent_activity_thunk = createAsyncThunk(
    "recentActivity/getRecentActivity",
    async (_, { rejectWithValue }) => {
        try {
            const data = await get_recent_activity_service();
            return normalize_recent_activity(data);
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Unable to load recent activity.",
            );
        }
    },
);
