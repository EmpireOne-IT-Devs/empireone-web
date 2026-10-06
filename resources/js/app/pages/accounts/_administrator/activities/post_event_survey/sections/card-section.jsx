import React, { useMemo } from "react";
import Card from "@/app/_components/card";
import { useSelector } from "react-redux";
import {
    TbCalendarEvent,
    TbClipboardList,
    TbCheck,
    TbX,
    TbTrendingUp,
} from "react-icons/tb";

export default function CardSection() {
    const { surveys = [] } = useSelector((state) => state.post_event_surveys);

    const cards = useMemo(() => {
        const eventSurveys = surveys.filter((survey) => {
            const category = String(survey?.event?.category ?? "").trim().toLowerCase();
            return category === "events calendar" || category === "event";
        });

        const totalResponses = eventSurveys.reduce(
            (sum, survey) => sum + (survey.total_responses ?? 0),
            0,
        );

        const activeSurveys = eventSurveys.filter(
            (survey) => survey.status === "published",
        ).length;

        const inactiveSurveys = eventSurveys.filter(
            (survey) => survey.status !== "published",
        ).length;

        return [
            {
                title: "Total Events",
                value: eventSurveys.length,
                icon: TbCalendarEvent,
                bg: "bg-blue-500",
            },
            {
                title: "Survey Responses",
                value: totalResponses,
                icon: TbClipboardList,
                bg: "bg-violet-500",
            },
            {
                title: "Active",
                value: activeSurveys,
                icon: TbCheck,
                bg: "bg-emerald-500",
            },
            {
                title: "Inactive",
                value: inactiveSurveys,
                icon: TbX,
                bg: "bg-orange-500",
            },
        ];
    }, [surveys]);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-3">
            {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                    <Card
                        key={index}
                        className="min-w-0 flex flex-col gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm"
                        padding="p-3 sm:p-5"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <div
                                    className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg sm:rounded-xl flex items-center justify-center ${card.bg}`}
                                >
                                    <Icon className="text-xl sm:text-2xl text-white" />
                                </div>

                                <span className="text-xl sm:text-2xl font-bold text-gray-900 leading-none truncate">
                                    {card.value}
                                </span>
                            </div>

                            <TbTrendingUp className="shrink-0 text-green-500 text-base sm:text-lg" />
                        </div>

                        <p className="text-xs sm:text-sm text-gray-500 sm:mt-1 leading-snug">
                            {card.title}
                        </p>
                    </Card>
                );
            })}
        </div>
    );
}