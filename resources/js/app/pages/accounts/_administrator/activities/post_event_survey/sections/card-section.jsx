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
        <div className="flex flex-col sm:flex-row gap-4 my-3">
            {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                    <Card
                        key={index}
                        className="flex-1 flex flex-col gap-3 rounded-2xl border border-gray-200 shadow-sm"
                        padding="p-5"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}
                                >
                                    <Icon className="text-2xl text-white" />
                                </div>

                                <span className="text-2xl font-bold text-gray-900 leading-none">
                                    {card.value}
                                </span>
                            </div>

                            <TbTrendingUp className="text-green-500 text-lg" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mt-1">
                                {card.title}
                            </p>
                        </div>

                      
                    </Card>
                );
            })}
        </div>
    );
}
