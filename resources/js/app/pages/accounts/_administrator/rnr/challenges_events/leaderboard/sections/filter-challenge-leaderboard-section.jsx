import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, Flame } from "lucide-react";

import { get_engagement_reward_challenges_thunk } from "@/app/redux/engagement-thunk";

export default function FilterChallengeLeaderboardSection() {
    const dispatch = useDispatch();
    const { rewardChallenges = [] } = useSelector((state) => state.engagement);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedChallengeId, setSelectedChallengeId] = useState(null);
    const [limit, setLimit] = useState(10);
    const dropdownRef = useRef(null);

    useEffect(() => {
        dispatch(get_engagement_reward_challenges_thunk());
    }, [dispatch]);

    useEffect(() => {
        if (selectedChallengeId || rewardChallenges.length === 0) return;
        setSelectedChallengeId(rewardChallenges[0].id);
    }, [rewardChallenges, selectedChallengeId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedChallenge = useMemo(
        () =>
            rewardChallenges.find(
                (challenge) => challenge.id === selectedChallengeId,
            ) ??
            rewardChallenges[0] ??
            null,
        [rewardChallenges, selectedChallengeId],
    );

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white px-3 py-2 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-4 mt-6">
            <div className="relative w-full sm:max-w-[360px]" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen((value) => !value)}
                    className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-gray-300"
                >
                    <span className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-orange-500 shrink-0">
                            <Flame className="h-4 w-4" />
                        </span>
                        <span className="truncate text-sm font-medium text-gray-900">
                            {selectedChallenge?.title ?? "All challenges"}
                        </span>
                    </span>
                    <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute left-0 right-0 z-20 mt-2 max-h-72 overflow-auto rounded-2xl border border-gray-100 bg-white shadow-lg">
                        {rewardChallenges.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500">
                                No challenges available.
                            </div>
                        ) : (
                            rewardChallenges.map((challenge) => {
                                const isActive =
                                    challenge.id === selectedChallengeId;

                                return (
                                    <button
                                        key={challenge.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedChallengeId(
                                                challenge.id,
                                            );
                                            setIsOpen(false);
                                        }}
                                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                                            isActive
                                                ? "bg-orange-50 text-orange-700"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-orange-500 shrink-0">
                                            <Flame className="h-4 w-4" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium">
                                                {challenge.title}
                                            </span>
                                            <span className="block truncate text-xs text-gray-400">
                                                {challenge.category ??
                                                    "General"}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                {[10, 20].map((value) => {
                    const active = limit === value;

                    return (
                        <button
                            key={value}
                            type="butto"
                            onClick={() => setLimit(value)}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                                active
                                    ? "border border-gray-200 bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-800"
                            }`}
                        >
                            Top {value}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
