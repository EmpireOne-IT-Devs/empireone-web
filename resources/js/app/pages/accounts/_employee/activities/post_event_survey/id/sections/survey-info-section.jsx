import moment from "moment";
import React from "react";
import { Calendar, Tag, CalendarDays, Hash } from "lucide-react";

// Status styles updated with orange/amber warm spectrums
const STATUS_STYLES = {
    published: "bg-orange-100 text-orange-700 border-orange-200",
    draft: "bg-amber-100 text-amber-700 border-amber-200",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function SurveyInfoSection({ survey }) {
    if (!survey) return null;

    return (
        <div className="w-full rounded-2xl border border-orange-100 bg-gray-50 p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Top Row: Survey ID, Title, Description, and Status */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1.5 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-orange-600 bg-orange-50 w-fit px-2.5 py-0.5 rounded-md font-mono">
                        <Hash className="w-3 h-3 text-orange-500" />
                        <span>SID-{String(survey.id).padStart(2, "0")}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                        {survey.title}
                    </h2>

                    {survey.description && (
                        <p className="text-sm text-slate-600 leading-relaxed mt-0.5">
                            {survey.description}
                        </p>
                    )}
                </div>

                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize border shrink-0 ${
                        STATUS_STYLES[survey.status] ??
                        "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {survey.status}
                </span>
            </div>

            {/* Bottom Row: Metadata Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 mt-5 border-t border-slate-100">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50/40 border border-orange-100/60">
                    <div className="p-2 bg-white rounded-lg text-orange-500 shadow-2xs">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
                            Linked Event
                        </p>
                        <p className="font-semibold text-slate-800 text-sm mt-0.5 line-clamp-1">
                            {survey.event?.headline ?? "—"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50/40 border border-orange-100/60">
                    <div className="p-2 bg-white rounded-lg text-orange-500 shadow-2xs">
                        <Tag className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
                            Category
                        </p>
                        <p className="font-semibold text-slate-800 text-sm mt-0.5">
                            {survey.event?.category ?? "—"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50/40 border border-orange-100/60">
                    <div className="p-2 bg-white rounded-lg text-orange-500 shadow-2xs">
                        <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
                            Published
                        </p>
                        <p className="font-semibold text-slate-800 text-sm mt-0.5">
                            {survey.published_at
                                ? moment(survey.published_at).format("MMM DD, YYYY")
                                : "—"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}