import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_my_engagement_reward_challenges_thunk } from "@/app/redux/engagement-thunk";
import HeaderSection from "./header-section";
import ChallengeCardSection from "./challenge-card-section";

export default function ChallengeEventSection() {
    const dispatch = useDispatch();
    const { myRewardChallenges, myRewardChallengesLoading } = useSelector(
        (state) => state.engagement,
    );
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        dispatch(get_my_engagement_reward_challenges_thunk());
    }, [dispatch]);

    const activeCount = useMemo(
        () => myRewardChallenges.filter((challenge) => challenge.status === "Active").length,
        [myRewardChallenges],
    );

    const joinedCount = useMemo(
        () => myRewardChallenges.filter((challenge) => challenge.is_joined).length,
        [myRewardChallenges],
    );

    const filteredChallenges = useMemo(
        () =>
            filter === "All"
                ? myRewardChallenges
                : myRewardChallenges.filter((challenge) => challenge.type === filter),
        [myRewardChallenges, filter],
    );

    return (
        <div className="flex flex-col gap-4">
            <HeaderSection
                activeCount={activeCount}
                joinedCount={joinedCount}
                filter={filter}
                onFilterChange={setFilter}
            />
            <ChallengeCardSection
                challenges={filteredChallenges}
                loading={myRewardChallengesLoading}
            />
        </div>
    );
}
