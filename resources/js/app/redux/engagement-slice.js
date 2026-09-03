import { createSlice } from "@reduxjs/toolkit";
import {
    get_engagement_posts_thunk,
    create_engagement_post_thunk,
    update_engagement_post_thunk,
    delete_engagement_post_thunk,
    get_upcoming_birthdays_thunk,
    publish_engagement_post_thunk,
    cast_poll_vote_thunk,
    upload_gallery_thunk,
    get_engagement_reward_recognitions_thunk,
    search_reward_recognition_employees_thunk,
    create_engagement_reward_recognition_thunk,
    get_engagement_reward_recognition_thunk,
    update_engagement_reward_recognition_thunk,
    delete_engagement_reward_recognition_thunk,
    get_engagement_reward_challenge_options_thunk,
    create_engagement_reward_challenge_thunk,
    update_engagement_reward_challenge_thunk,
    delete_engagement_reward_challenge_thunk,
    get_engagement_reward_challenges_thunk,
    get_my_engagement_reward_challenges_thunk,
    join_engagement_reward_challenge_thunk,
    leave_engagement_reward_challenge_thunk,
    submit_engagement_reward_challenge_proof_thunk,
    get_engagement_reward_challenge_submissions_thunk,
    get_engagement_reward_challenge_submission_stats_thunk,
    approve_engagement_reward_challenge_submission_thunk,
    decline_engagement_reward_challenge_submission_thunk,
    get_engagement_reward_challenge_profile_summary_thunk,
} from "./engagement-thunk";

export {
    get_engagement_posts_thunk,
    create_engagement_post_thunk,
    update_engagement_post_thunk,
    delete_engagement_post_thunk,
    get_upcoming_birthdays_thunk,
    publish_engagement_post_thunk,
    cast_poll_vote_thunk,
    upload_gallery_thunk,
    get_engagement_reward_recognitions_thunk,
    search_reward_recognition_employees_thunk,
    create_engagement_reward_recognition_thunk,
    get_engagement_reward_recognition_thunk,
    update_engagement_reward_recognition_thunk,
    delete_engagement_reward_recognition_thunk,
    get_engagement_reward_challenge_options_thunk,
    create_engagement_reward_challenge_thunk,
    update_engagement_reward_challenge_thunk,
    delete_engagement_reward_challenge_thunk,
    get_engagement_reward_challenges_thunk,
    get_my_engagement_reward_challenges_thunk,
    join_engagement_reward_challenge_thunk,
    leave_engagement_reward_challenge_thunk,
    submit_engagement_reward_challenge_proof_thunk,
    get_engagement_reward_challenge_submissions_thunk,
    get_engagement_reward_challenge_submission_stats_thunk,
    approve_engagement_reward_challenge_submission_thunk,
    decline_engagement_reward_challenge_submission_thunk,
    get_engagement_reward_challenge_profile_summary_thunk,
};

const engagementSlice = createSlice({
    name: "engagement",
    initialState: {
        posts: [],
        postsLoading: true,
        fetching: false,
        postsError: null,
        creating: false,
        createError: null,
        updating: false,
        updateError: null,
        deleting: false,
        deleteError: null,
        publishing: false,
        publishError: null,
        pollVotingPostId: null,
        birthdays: [],
        birthdayMonth: "",
        birthdayCount: 0,
        birthdaysLoading: false,

        // Gallery upload states
        uploadingGallery: false,
        uploadGalleryError: null,

        // Reward recognition states
        rewardRecognitions: [],
        rewardRecognition: null,
        rewardRecognitionsLoading: false,
        rewardRecognitionsError: null,
        rewardCreating: false,
        rewardCreateError: null,
        rewardUpdating: false,
        rewardUpdateError: null,
        rewardDeleting: false,
        rewardDeleteError: null,
        rewardSearching: false,
        rewardSearchResults: [],
        rewardSearchError: null,

        // Reward challenge states
        rewardChallenges: [],
        rewardChallengesLoading: false,
        rewardChallengesError: null,
        rewardChallengeDepartments: [],
        rewardChallengeAccounts: [],
        rewardChallengeTotalEmployees: 0,
        rewardChallengeOptionsLoading: false,
        rewardChallengeCreating: false,
        rewardChallengeCreateError: null,
        rewardChallengeUpdating: false,
        rewardChallengeUpdateError: null,
        rewardChallengeDeleting: false,
        rewardChallengeDeleteError: null,

        // Employee-facing challenge participation states
        myRewardChallenges: [],
        myRewardChallengesLoading: false,
        myRewardChallengesError: null,
        rewardChallengeJoiningId: null,
        rewardChallengeLeavingId: null,
        rewardChallengeSubmittingId: null,

        // Admin-facing submission review states
        challengeSubmissions: [],
        challengeSubmissionsLoading: false,
        challengeSubmissionsError: null,
        challengeSubmissionStats: { pending: 0, approved: 0, rejected: 0 },
        challengeSubmissionApprovingId: null,
        challengeSubmissionDecliningId: null,

        // Employee "My Profile" summary
        challengeProfileSummary: { total_points: 0, challenge_history: [] },
        challengeProfileSummaryLoading: false,
    },
    reducers: {
        syncInteraction(state, action) {
            const { postId, reaction_count, user_has_reacted, comment_count } = action.payload;
            const idx = state.posts.findIndex((p) => p.id === postId);
            if (idx === -1) return;
            if (reaction_count   !== undefined) state.posts[idx].reaction_count   = reaction_count;
            if (user_has_reacted !== undefined) state.posts[idx].user_has_reacted = user_has_reacted;
            if (comment_count    !== undefined) state.posts[idx].comment_count    = comment_count;
        },
        // Action to clear gallery errors when modal closes
        clearGalleryErrors(state) {
            state.uploadGalleryError = null;
        },
        clearRecognition(state) {
            state.rewardRecognition = null;
        },
        clearSearchResults(state) {
            state.rewardSearchResults = [];
        },
        clearErrors(state) {
            state.rewardRecognitionsError = null;
            state.rewardCreateError = null;
            state.rewardUpdateError = null;
            state.rewardDeleteError = null;
            state.rewardSearchError = null;
            state.rewardChallengeCreateError = null;
            state.rewardChallengeUpdateError = null;
            state.rewardChallengeDeleteError = null;
        },
    },
    extraReducers: (builder) => {
        // ── Get Engagement Posts ──────────────────────────────────────────────
        builder
            .addCase(get_engagement_posts_thunk.pending, (state) => {
                state.fetching = true;
                state.postsLoading = true;
                state.postsError = null;
            })
            .addCase(get_engagement_posts_thunk.fulfilled, (state, action) => {
                state.fetching = false;
                state.postsLoading = false;
                // Normalize incoming posts
                const incoming = action.payload?.data ?? action.payload ?? [];
                if (Array.isArray(incoming)) {
                    // If we have upcoming birthdays in state, attach them to birthday posts
                    state.posts = incoming.map((p) => {
                        if ((p.type === 'birthday' || p.category === 'Birthday') && Array.isArray(state.birthdays) && state.birthdays.length > 0) {
                            return { ...p, celebrants: state.birthdays.map((b) => ({ ...b })) };
                        }
                        return p;
                    });
                } else {
                    state.posts = incoming;
                }
            })
            .addCase(get_engagement_posts_thunk.rejected, (state, action) => {
                state.fetching = false;
                state.postsLoading = false;
                state.postsError = action.payload;
            });

        // ── Create Post ────────────────────────────────────────────────────────
        builder
            .addCase(create_engagement_post_thunk.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(create_engagement_post_thunk.fulfilled, (state, action) => {
                state.creating = false;
                const newPost = action.payload?.data ?? action.payload;
                if (newPost && newPost.id) {
                    const exists = state.posts.some((p) => p.id === newPost.id);
                    if (!exists) {
                        state.posts = [newPost, ...state.posts];
                    }
                }
            })
            .addCase(create_engagement_post_thunk.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload;
            });

        // ── Update Post ────────────────────────────────────────────────────────
        builder
            .addCase(update_engagement_post_thunk.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(update_engagement_post_thunk.fulfilled, (state, action) => {
                state.updating = false;
                const updated = action.payload?.data ?? action.payload;
                if (updated && updated.id) {
                    const idx = state.posts.findIndex((p) => p.id === updated.id);
                    if (idx !== -1) state.posts[idx] = updated;
                }
            })
            .addCase(update_engagement_post_thunk.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            });

        // ── Delete Post ────────────────────────────────────────────────────────
        builder
            .addCase(delete_engagement_post_thunk.pending, (state) => {
                state.deleting = true;
                state.deleteError = null;
            })
            .addCase(delete_engagement_post_thunk.fulfilled, (state, action) => {
                state.deleting = false;
                state.posts = state.posts.filter((p) => p.id !== action.payload);
            })
            .addCase(delete_engagement_post_thunk.rejected, (state, action) => {
                state.deleting = false;
                state.deleteError = action.payload;
            });

        // ── Upcoming Birthdays ────────────────────────────────────────────────
        builder
            .addCase(get_upcoming_birthdays_thunk.pending, (state) => {
                state.birthdaysLoading = true;
            })
            .addCase(get_upcoming_birthdays_thunk.fulfilled, (state, action) => {
                state.birthdaysLoading = false;
                state.birthdays = action.payload.data ?? [];
                state.birthdayMonth = action.payload.month ?? "";
                state.birthdayCount = action.payload.count ?? 0;
            })
            .addCase(get_upcoming_birthdays_thunk.rejected, (state) => {
                state.birthdaysLoading = false;
            });

        // ── Publish Rich Post (Birthday / Poll) ─────────────────────────────
        builder
            .addCase(publish_engagement_post_thunk.pending, (state) => {
                state.publishing = true;
                state.publishError = null;
            })
            .addCase(publish_engagement_post_thunk.fulfilled, (state, action) => {
                state.publishing = false;
                // Safely extract post object regardless of whether response is payload.data or direct payload
                const newPost = action.payload?.data ?? action.payload;
                if (newPost && newPost.id) {
                    // Prefer the caller-supplied (already-filtered) celebrants list; fall back to all birthdays
                    const celebrantsToAttach = action.meta?.arg?.celebrants ?? state.birthdays;
                    if (newPost.type === 'birthday' && Array.isArray(celebrantsToAttach) && celebrantsToAttach.length > 0) {
                        newPost.celebrants = celebrantsToAttach.map((b) => ({ ...b }));
                    }

                    const exists = state.posts.some((p) => p.id === newPost.id);
                    if (!exists) {
                        state.posts = [newPost, ...state.posts];
                    }
                }
            })
            .addCase(publish_engagement_post_thunk.rejected, (state, action) => {
                state.publishing = false;
                state.publishError = action.payload;
            });

        // ── Cast Poll Vote ────────────────────────────────────────────────────
        builder
            .addCase(cast_poll_vote_thunk.pending, (state, action) => {
                state.pollVotingPostId = action.meta.arg.postId;
            })
            .addCase(cast_poll_vote_thunk.fulfilled, (state, action) => {
                state.pollVotingPostId = null;
                const { postId, total_votes, user_has_voted, user_voted_option, options } = action.payload;
                const idx = state.posts.findIndex((p) => p.id === postId);
                if (idx !== -1) {
                    state.posts[idx].total_votes       = total_votes;
                    state.posts[idx].user_has_voted    = user_has_voted;
                    state.posts[idx].user_voted_option = user_voted_option;
                    if (options) state.posts[idx].options = options;
                }
            })
            .addCase(cast_poll_vote_thunk.rejected, (state) => {
                state.pollVotingPostId = null;
            });

        // ── Search Reward Recognition Employees ─────────────────────────────────
        builder
            .addCase(search_reward_recognition_employees_thunk.pending, (state) => {
                state.rewardSearching = true;
                state.rewardSearchError = null;
            })
            .addCase(search_reward_recognition_employees_thunk.fulfilled, (state, action) => {
                state.rewardSearching = false;
                state.rewardSearchResults = action.payload?.data ?? action.payload ?? [];
            })
            .addCase(search_reward_recognition_employees_thunk.rejected, (state, action) => {
                state.rewardSearching = false;
                state.rewardSearchError = action.payload;
            })

            // ── Get Reward Recognitions ────────────────────────────────────────────
            .addCase(get_engagement_reward_recognitions_thunk.pending, (state) => {
                state.rewardRecognitionsLoading = true;
                state.rewardRecognitionsError = null;
            })
            .addCase(get_engagement_reward_recognitions_thunk.fulfilled, (state, action) => {
                state.rewardRecognitionsLoading = false;
                state.rewardRecognitions = action.payload?.data ?? action.payload ?? [];
            })
            .addCase(get_engagement_reward_recognitions_thunk.rejected, (state, action) => {
                state.rewardRecognitionsLoading = false;
                state.rewardRecognitionsError = action.payload;
            })

            // ── Create Reward Recognition ──────────────────────────────────────────
            .addCase(create_engagement_reward_recognition_thunk.pending, (state) => {
                state.rewardCreating = true;
                state.rewardCreateError = null;
            })
            .addCase(create_engagement_reward_recognition_thunk.fulfilled, (state, action) => {
                state.rewardCreating = false;
                const newRecognition = action.payload?.data ?? action.payload;
                if (newRecognition) {
                    state.rewardRecognitions.unshift(newRecognition);
                }
            })
            .addCase(create_engagement_reward_recognition_thunk.rejected, (state, action) => {
                state.rewardCreating = false;
                state.rewardCreateError = action.payload;
            })

            // ── Get One Reward Recognition ────────────────────────────────────────
            .addCase(get_engagement_reward_recognition_thunk.pending, (state) => {
                state.rewardRecognitionsLoading = true;
                state.rewardRecognitionsError = null;
            })
            .addCase(get_engagement_reward_recognition_thunk.fulfilled, (state, action) => {
                state.rewardRecognitionsLoading = false;
                state.rewardRecognition = action.payload?.data ?? action.payload;
            })
            .addCase(get_engagement_reward_recognition_thunk.rejected, (state, action) => {
                state.rewardRecognitionsLoading = false;
                state.rewardRecognitionsError = action.payload;
            })

            // ── Update Reward Recognition ─────────────────────────────────────────
            .addCase(update_engagement_reward_recognition_thunk.pending, (state) => {
                state.rewardUpdating = true;
                state.rewardUpdateError = null;
            })
            .addCase(update_engagement_reward_recognition_thunk.fulfilled, (state, action) => {
                state.rewardUpdating = false;
                const updated = action.payload?.data ?? action.payload;
                if (updated && updated.id) {
                    const idx = state.rewardRecognitions.findIndex((item) => item.id === updated.id);
                    if (idx !== -1) state.rewardRecognitions[idx] = updated;
                    if (state.rewardRecognition?.id === updated.id) {
                        state.rewardRecognition = updated;
                    }
                }
            })
            .addCase(update_engagement_reward_recognition_thunk.rejected, (state, action) => {
                state.rewardUpdating = false;
                state.rewardUpdateError = action.payload;
            })

            // ── Delete Reward Recognition ─────────────────────────────────────────
            .addCase(delete_engagement_reward_recognition_thunk.pending, (state) => {
                state.rewardDeleting = true;
                state.rewardDeleteError = null;
            })
            .addCase(delete_engagement_reward_recognition_thunk.fulfilled, (state, action) => {
                state.rewardDeleting = false;
                state.rewardRecognitions = state.rewardRecognitions.filter((item) => item.id !== action.payload);
                if (state.rewardRecognition?.id === action.payload) {
                    state.rewardRecognition = null;
                }
            })
            .addCase(delete_engagement_reward_recognition_thunk.rejected, (state, action) => {
                state.rewardDeleting = false;
                state.rewardDeleteError = action.payload;
            })

            // ── Upload Gallery Images ─────────────────────────────────────────────
            .addCase(upload_gallery_thunk.pending, (state) => {
                state.uploadingGallery = true;
                state.uploadGalleryError = null;
            })
            .addCase(upload_gallery_thunk.fulfilled, (state, action) => {
                state.uploadingGallery = false;

                const payloadData = action.payload?.data ?? action.payload;
                const { event_id, files, drive_link } = payloadData || {};
                const idx = state.posts.findIndex((p) => p.id === event_id);

                if (idx !== -1) {
                    if (!state.posts[idx].files) {
                        state.posts[idx].files = [];
                    }
                    if (files) {
                        state.posts[idx].files = [...state.posts[idx].files, ...files];
                    }

                    if (drive_link) {
                        state.posts[idx].drive_link = drive_link;
                    }
                }
            })
            .addCase(upload_gallery_thunk.rejected, (state, action) => {
                state.uploadingGallery = false;
                state.uploadGalleryError = action.payload;
            });

        builder
            .addCase(get_engagement_reward_challenges_thunk.pending, (state) => {
                state.rewardChallengesLoading = true;
                state.rewardChallengesError = null;
            })
            .addCase(get_engagement_reward_challenges_thunk.fulfilled, (state, action) => {
                state.rewardChallengesLoading = false;
                state.rewardChallenges = action.payload?.data ?? action.payload ?? [];
            })
            .addCase(get_engagement_reward_challenges_thunk.rejected, (state, action) => {
                state.rewardChallengesLoading = false;
                state.rewardChallengesError = action.payload;
            });

        builder
            .addCase(get_engagement_reward_challenge_options_thunk.pending, (state) => {
                state.rewardChallengeOptionsLoading = true;
            })
            .addCase(get_engagement_reward_challenge_options_thunk.fulfilled, (state, action) => {
                state.rewardChallengeOptionsLoading = false;
                const options = action.payload?.data ?? {};
                state.rewardChallengeDepartments = options.departments ?? [];
                state.rewardChallengeAccounts = options.accounts ?? [];
                state.rewardChallengeTotalEmployees = options.total_employees ?? 0;
            })
            .addCase(get_engagement_reward_challenge_options_thunk.rejected, (state) => {
                state.rewardChallengeOptionsLoading = false;
            })
            .addCase(create_engagement_reward_challenge_thunk.pending, (state) => {
                state.rewardChallengeCreating = true;
                state.rewardChallengeCreateError = null;
            })
            .addCase(create_engagement_reward_challenge_thunk.fulfilled, (state, action) => {
                state.rewardChallengeCreating = false;
                const challenge = action.payload?.data ?? action.payload;
                if (challenge?.id) {
                    state.rewardChallenges.unshift(challenge);
                }
            })
            .addCase(create_engagement_reward_challenge_thunk.rejected, (state, action) => {
                state.rewardChallengeCreating = false;
                state.rewardChallengeCreateError = action.payload;
            })

            // ── Update Reward Challenge ────────────────────────────────────────────
            .addCase(update_engagement_reward_challenge_thunk.pending, (state) => {
                state.rewardChallengeUpdating = true;
                state.rewardChallengeUpdateError = null;
            })
            .addCase(update_engagement_reward_challenge_thunk.fulfilled, (state, action) => {
                state.rewardChallengeUpdating = false;
                const updated = action.payload?.data ?? action.payload;
                if (updated?.id) {
                    const idx = state.rewardChallenges.findIndex((item) => item.id === updated.id);
                    if (idx !== -1) state.rewardChallenges[idx] = updated;
                }
            })
            .addCase(update_engagement_reward_challenge_thunk.rejected, (state, action) => {
                state.rewardChallengeUpdating = false;
                state.rewardChallengeUpdateError = action.payload;
            })

            // ── Delete Reward Challenge ────────────────────────────────────────────
            .addCase(delete_engagement_reward_challenge_thunk.pending, (state) => {
                state.rewardChallengeDeleting = true;
                state.rewardChallengeDeleteError = null;
            })
            .addCase(delete_engagement_reward_challenge_thunk.fulfilled, (state, action) => {
                state.rewardChallengeDeleting = false;
                state.rewardChallenges = state.rewardChallenges.filter((item) => item.id !== action.payload);
            })
            .addCase(delete_engagement_reward_challenge_thunk.rejected, (state, action) => {
                state.rewardChallengeDeleting = false;
                state.rewardChallengeDeleteError = action.payload;
            });

        builder
            .addCase(get_my_engagement_reward_challenges_thunk.pending, (state) => {
                state.myRewardChallengesLoading = true;
                state.myRewardChallengesError = null;
            })
            .addCase(get_my_engagement_reward_challenges_thunk.fulfilled, (state, action) => {
                state.myRewardChallengesLoading = false;
                state.myRewardChallenges = action.payload?.data ?? [];
            })
            .addCase(get_my_engagement_reward_challenges_thunk.rejected, (state, action) => {
                state.myRewardChallengesLoading = false;
                state.myRewardChallengesError = action.payload;
            })
            .addCase(join_engagement_reward_challenge_thunk.pending, (state, action) => {
                state.rewardChallengeJoiningId = action.meta.arg;
            })
            .addCase(join_engagement_reward_challenge_thunk.fulfilled, (state, action) => {
                state.rewardChallengeJoiningId = null;
                const updated = action.payload?.data;
                if (updated?.id) {
                    const idx = state.myRewardChallenges.findIndex((item) => item.id === updated.id);
                    if (idx !== -1) state.myRewardChallenges[idx] = updated;
                }
            })
            .addCase(join_engagement_reward_challenge_thunk.rejected, (state) => {
                state.rewardChallengeJoiningId = null;
            })
            .addCase(leave_engagement_reward_challenge_thunk.pending, (state, action) => {
                state.rewardChallengeLeavingId = action.meta.arg;
            })
            .addCase(leave_engagement_reward_challenge_thunk.fulfilled, (state, action) => {
                state.rewardChallengeLeavingId = null;
                const updated = action.payload?.data;
                if (updated?.id) {
                    const idx = state.myRewardChallenges.findIndex((item) => item.id === updated.id);
                    if (idx !== -1) state.myRewardChallenges[idx] = updated;
                }
            })
            .addCase(leave_engagement_reward_challenge_thunk.rejected, (state) => {
                state.rewardChallengeLeavingId = null;
            })
            .addCase(submit_engagement_reward_challenge_proof_thunk.pending, (state, action) => {
                state.rewardChallengeSubmittingId = action.meta.arg?.id ?? null;
            })
            .addCase(submit_engagement_reward_challenge_proof_thunk.fulfilled, (state, action) => {
                state.rewardChallengeSubmittingId = null;
                const updated = action.payload?.data;
                if (updated?.id) {
                    const idx = state.myRewardChallenges.findIndex((item) => item.id === updated.id);
                    if (idx !== -1) state.myRewardChallenges[idx] = updated;
                }
            })
            .addCase(submit_engagement_reward_challenge_proof_thunk.rejected, (state) => {
                state.rewardChallengeSubmittingId = null;
            });

        builder
            .addCase(get_engagement_reward_challenge_submissions_thunk.pending, (state) => {
                state.challengeSubmissionsLoading = true;
                state.challengeSubmissionsError = null;
            })
            .addCase(get_engagement_reward_challenge_submissions_thunk.fulfilled, (state, action) => {
                state.challengeSubmissionsLoading = false;
                state.challengeSubmissions = action.payload?.data ?? [];
            })
            .addCase(get_engagement_reward_challenge_submissions_thunk.rejected, (state, action) => {
                state.challengeSubmissionsLoading = false;
                state.challengeSubmissionsError = action.payload;
            })
            .addCase(get_engagement_reward_challenge_submission_stats_thunk.fulfilled, (state, action) => {
                state.challengeSubmissionStats = action.payload?.data ?? { pending: 0, approved: 0, rejected: 0 };
            })
            .addCase(approve_engagement_reward_challenge_submission_thunk.pending, (state, action) => {
                state.challengeSubmissionApprovingId = action.meta.arg;
            })
            .addCase(approve_engagement_reward_challenge_submission_thunk.fulfilled, (state, action) => {
                state.challengeSubmissionApprovingId = null;
                const updated = action.payload?.data;
                if (updated?.id) {
                    const idx = state.challengeSubmissions.findIndex((item) => item.id === updated.id);
                    if (idx !== -1) state.challengeSubmissions[idx] = updated;
                }
            })
            .addCase(approve_engagement_reward_challenge_submission_thunk.rejected, (state) => {
                state.challengeSubmissionApprovingId = null;
            })
            .addCase(decline_engagement_reward_challenge_submission_thunk.pending, (state, action) => {
                state.challengeSubmissionDecliningId = action.meta.arg?.id ?? null;
            })
            .addCase(decline_engagement_reward_challenge_submission_thunk.fulfilled, (state, action) => {
                state.challengeSubmissionDecliningId = null;
                const updated = action.payload?.data;
                if (updated?.id) {
                    const idx = state.challengeSubmissions.findIndex((item) => item.id === updated.id);
                    if (idx !== -1) state.challengeSubmissions[idx] = updated;
                }
            })
            .addCase(decline_engagement_reward_challenge_submission_thunk.rejected, (state) => {
                state.challengeSubmissionDecliningId = null;
            })
            .addCase(get_engagement_reward_challenge_profile_summary_thunk.pending, (state) => {
                state.challengeProfileSummaryLoading = true;
            })
            .addCase(get_engagement_reward_challenge_profile_summary_thunk.fulfilled, (state, action) => {
                state.challengeProfileSummaryLoading = false;
                state.challengeProfileSummary = action.payload?.data ?? { total_points: 0, challenge_history: [] };
            })
            .addCase(get_engagement_reward_challenge_profile_summary_thunk.rejected, (state) => {
                state.challengeProfileSummaryLoading = false;
            });
    },
});

export const {
    syncInteraction,
    clearGalleryErrors,
    clearRecognition,
    clearSearchResults,
    clearErrors,
} = engagementSlice.actions;
export default engagementSlice.reducer;