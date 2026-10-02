import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_engagement_reward_challenges_thunk } from "@/app/redux/engagement-thunk";
import ChallengesGridSection from "./challenges-grid-section";

export default function AllChallengesSection() {
  const dispatch = useDispatch();
  const { rewardChallenges = [], rewardChallengesLoading } = useSelector(
    (state) => state.engagement,
  );

  useEffect(() => {
    dispatch(get_engagement_reward_challenges_thunk());
  }, [dispatch]);

  // Ended challenges (status "Completed") are auto-archived out of the main list.
  const activeChallenges = rewardChallenges.filter(
    (challenge) => challenge.status !== "Completed",
  );

  return (
    <ChallengesGridSection
      title="All Challenges"
      challenges={activeChallenges}
      loading={rewardChallengesLoading}
      emptyMessage="No challenges published yet."
    />
  );
}