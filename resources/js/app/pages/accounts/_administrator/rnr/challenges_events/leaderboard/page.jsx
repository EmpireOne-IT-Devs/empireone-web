import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TopParticipantSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/top-participant-section";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "@/app/pages/accounts/_administrator/rnr/layout";
import TabsSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/sections/tabs-section";
import FilterChallengeLeaderboardSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/filter-challenge-leaderboard-section";
import ParticipantTableSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/participant-table-section";
import { get_engagement_reward_challenge_participants_thunk } from "@/app/redux/engagement-thunk";

export default function Page() {
    const dispatch = useDispatch();
    const [selectedChallengeId, setSelectedChallengeId] = useState(null);
    const [limit, setLimit] = useState(10);
    const [submissionType, setSubmissionType] = useState("individual");

    useEffect(() => {
        if (selectedChallengeId) {
            dispatch(
                get_engagement_reward_challenge_participants_thunk(
                    selectedChallengeId,
                ),
            );
        }
    }, [dispatch, selectedChallengeId]);

    return (
        <Layout>
            <RnrLayout>
                <TabsSection>
                    <div className="space-y-2">
                        <FilterChallengeLeaderboardSection
                            selectedChallengeId={selectedChallengeId}
                            onSelectChallenge={setSelectedChallengeId}
                            limit={limit}
                            onSelectLimit={setLimit}
                        />

                        <div
                            className="grid w-full grid-cols-2 gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm sm:w-fit"
                            role="group"
                            aria-label="Leaderboard submission type"
                        >
                            {[
                                { value: "individual", label: "Individual Submissions" },
                                { value: "team", label: "Team Submissions" },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    aria-pressed={submissionType === option.value}
                                    onClick={() =>
                                        setSubmissionType(option.value)
                                    }
                                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                                        submissionType === option.value
                                            ? "bg-purple-600 text-white shadow-sm"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        <TopParticipantSection
                            submissionType={submissionType}
                        />
                        <ParticipantTableSection
                            submissionType={submissionType}
                            limit={limit}
                        />
                    </div>
                </TabsSection>
            </RnrLayout>
        </Layout>
    );
}
