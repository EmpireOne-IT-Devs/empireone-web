import Card from "@/app/_components/card";
import React, { useEffect } from "react";
import { TbClockHour4, TbCircleCheck, TbCircleX } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { get_engagement_reward_challenge_submission_stats_thunk } from "@/app/redux/engagement-thunk";

export default function CardSection() {
    const dispatch = useDispatch();
    const { challengeSubmissionStats } = useSelector((state) => state.engagement);

    useEffect(() => {
        dispatch(get_engagement_reward_challenge_submission_stats_thunk());
    }, [dispatch]);

    const cards = [
        {
            label: "Pending Review",
            value: challengeSubmissionStats.pending,
            icon: TbClockHour4,
            iconClassName: "text-sky-500",
        },
        {
            label: "Approved",
            value: challengeSubmissionStats.approved,
            icon: TbCircleCheck,
            iconClassName: "text-emerald-500",
        },
        {
            label: "Rejected",
            value: challengeSubmissionStats.rejected,
            icon: TbCircleX,
            iconClassName: "text-rose-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-6">
            {cards.map(({ label, value, icon: Icon, iconClassName }) => (
                <Card key={label} className="w-full text-center">
                    <div className="flex flex-col items-center gap-2">
                        <Icon className={`text-2xl ${iconClassName}`} />
                        <div className="text-xl font-semibold leading-none">
                            {value}
                        </div>
                        <div className="text-sm text-gray-500">{label}</div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
