import React from "react";

const STATUS_STYLES = {
    published: "bg-green-100 text-green-600",
    draft: "bg-yellow-100 text-yellow-600",
    closed: "bg-red-100 text-red-600",
};

export default function SurveyInfoSection({ survey }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-gray-400 font-mono">
                        SID-{String(survey.id).padStart(2, "0")}
                    </p>
                    <h1 className="text-xl font-bold text-gray-900">
                        {survey.title}
                    </h1>
                    {survey.description && (
                        <p className="text-sm text-gray-500 mt-0.5">
                            {survey.description}
                        </p>
                    )}
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${
                        STATUS_STYLES[survey.status] ?? "bg-gray-100 text-gray-500"
                    }`}
                >
                    {survey.status}
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-mono mb-0.5">
                        Linked Event
                    </p>
                    <p className="font-semibold text-gray-800">
                        {survey.event?.headline ?? "—"}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-mono mb-0.5">
                        Category
                    </p>
                    <p className="font-semibold text-gray-800">
                        {survey.event?.category ?? "—"}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-mono mb-0.5">
                        Published
                    </p>
                    <p className="font-semibold text-gray-800">
                        {survey.published_at ?? "—"}
                    </p>
                </div>
            </div>
        </div>
    );
}
