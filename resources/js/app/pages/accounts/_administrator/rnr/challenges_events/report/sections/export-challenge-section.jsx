import React, { useState } from "react";
import {
    Download,
    FileText,
    BarChart3,
} from "lucide-react";
import { export_reward_challenge_report_service } from "@/app/services/engagement-service";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";

export default function ExportChallengeSection() {
    const dispatch = useDispatch();
    const [exportingType, setExportingType] = useState(null);

    const reports = [
        {
            title: "Top 10 Leaderboard",
            description: "Export as Excel",
            type: "Excel",
            exportType: "top10_leaderboard",
            icon: BarChart3,
            badge: "bg-red-500",
        },
        {
            title: "Top 20 Leaderboard",
            description: "Export as Excel",
            type: "Excel",
            exportType: "top20_leaderboard",
            icon: BarChart3,
            badge: "bg-green-600",
        },
        {
            title: "Full Participation Report",
            description: "Export as Excel",
            type: "Excel",
            exportType: "full_participation",
            icon: BarChart3,
            badge: "bg-blue-800",
        },
        {
            title: "Points Distribution Report",
            description: "Export as Excel",
            type: "Excel",
            exportType: "points_distribution",
            icon: BarChart3,
            badge: "bg-purple-600",
        },
        {
            title: "Department Analytics",
            description: "Export as Excel",
            type: "Excel",
            exportType: "department_analytics",
            icon: BarChart3,
            badge: "bg-orange-500",
        },
        {
            title: "Completion Details Report",
            description: "Export as Excel",
            type: "Excel",
            exportType: "completion_details",
            icon: FileText,
            badge: "bg-teal-600",
        },
    ];

    const handleExport = async (report) => {
        setExportingType(report.exportType);
        try {
            const response = await export_reward_challenge_report_service(report.exportType);
            const blob = new Blob([response.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${report.exportType}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Export failed",
                    message:
                        error.response?.data?.message ??
                        "Something went wrong while generating the report.",
                    open: true,
                }),
            );
        } finally {
            setExportingType(null);
        }
    };

    return (
        <section className="w-full rounded-[20px] bg-white px-6 py-6 shadow-sm">
            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
                    <Download className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                    <h2 className="text-sm font-bold text-slate-900">
                        Export Reports
                    </h2>

                    <p className="text-xs text-slate-400">
                        Leaderboards, participation, performance
                    </p>
                </div>
            </div>

            {/* Reports */}
            <div className="space-y-3">
                {reports.map((report) => {
                    const Icon = report.icon;
                    const isExporting = exportingType === report.exportType;

                    return (
                        <button
                            key={report.title}
                            type="button"
                            disabled={exportingType !== null}
                            onClick={() => handleExport(report)}
                            className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 text-left transition hover:border-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {/* Left */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-6 w-6 items-center justify-center">
                                    <Icon className="h-5 w-5 text-blue-500" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        {report.title}
                                    </h3>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                        {isExporting ? "Exporting…" : report.description}
                                    </p>
                                </div>
                            </div>

                            {/* File Type */}
                            <span
                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white ${report.badge}`}
                            >
                                {report.type}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}