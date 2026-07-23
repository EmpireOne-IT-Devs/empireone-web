import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "@/app/_components/skeleton";
import { X, Star, UserCircle2 } from "lucide-react";

export default function EmployeeAnswerViewer({ surveyId, userId, onClose }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                const response = await axios.get(`/api/engagement/surveys/${surveyId}/responses/${userId}`);
                if (mounted) {
                    setData(response.data?.data ?? null);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, [surveyId, userId]);

    if (loading) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <Skeleton lines={6} />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-sm text-gray-500">
                No response found.
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                    <UserCircle2 className="h-5 w-5 text-orange-500" />
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">{data.employee_name}</h3>
                        <p className="text-xs text-gray-400">Submitted: {data.submitted_at ?? "—"}</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="mt-4 space-y-4">
                {(data.answers ?? []).map((answer, index) => {
                    const rating = Number(answer.answer);
                    const isRating = !Number.isNaN(rating) && rating >= 1 && rating <= 5;

                    return (
                        <div key={answer.id ?? index} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-800">{index + 1}. {answer.question_text}</p>
                            <div className="mt-2 text-sm text-gray-600">
                                {isRating ? (
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }, (_, starIndex) => (
                                            <Star
                                                key={starIndex}
                                                size={16}
                                                className={starIndex < rating ? "text-yellow-400" : "text-gray-300"}
                                            />
                                        ))}
                                        <span className="ml-2 text-xs text-gray-500">{rating}/5</span>
                                    </div>
                                ) : (
                                    answer.answer ?? "—"
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
