import React, { useState } from "react";
import {
    Users,
    UserCheck,
    Clock,
    MessageSquare,
    Hourglass,
    CheckCircle2,
    AlertCircle,
    FileText,
    Gavel,
    ShieldAlert,
    Check,
    CalendarCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "@inertiajs/react";

export default function CardSection() {
    const [activeTeamCard, setActiveTeamCard] = useState("total-team");
    const [activeCoachingCard, setActiveCoachingCard] =
        useState("total-coaching");
    const [activeDisciplinaryCard, setActiveDisciplinaryCard] =
        useState("total-disciplinary");

    const { p_m_dashboard } = useSelector((store) => store.human_resources);

    const regData = p_m_dashboard?.regularization || {};
    const coachingData = p_m_dashboard?.coachings || {};
    const correctiveData = p_m_dashboard?.corrective_actions || {};

    const getPercentage = (count, total) => {
        if (!total || total === 0) return "0%";
        return `${Math.round((count / total) * 100)}%`;
    };

    // Row 1: Team Metrics
    const totalTeamCount = regData.total || 0;
    const teamCards = [
        {
            id: "total-team",
            title: "Total Team",
            count: totalTeamCount,
            percentage: "100%",
            icon: Users,
            activeRing: "border-blue-500 ring-2 ring-blue-500/20 shadow-md",
            barColor: "bg-blue-600",
            iconBg: "bg-blue-50 text-blue-600",
            link: "/accounts/administrator/performance_management/my_team",
        },
        {
            id: "regular",
            title: "Regular",
            count: regData.regular || 0,
            percentage: getPercentage(regData.regular, totalTeamCount),
            icon: UserCheck,
            activeRing:
                "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md",
            barColor: "bg-emerald-600",
            iconBg: "bg-emerald-50 text-emerald-600",
            link: "/accounts/administrator/performance_management/my_team?status=Regular",
        },
        {
            id: "probationary",
            title: "Probationary",
            count: regData.probationary || 0,
            percentage: getPercentage(regData.probationary, totalTeamCount),
            icon: UserCheck,
            activeRing:
                "border-purple-500 ring-2 ring-purple-500/20 shadow-md",
            barColor: "bg-purple-600",
            iconBg: "bg-purple-50 text-purple-600",
            link: "/accounts/administrator/performance_management/my_team?status=Probationary",
        },
        {
            id: "probationary_3rd",
            title: "Probationary 3rd Review",
            count: regData.probation_3rd_review || 0,
            percentage: getPercentage(
                regData.probation_3rd_review,
                totalTeamCount,
            ),
            icon: Clock,
            activeRing: "border-amber-500 ring-2 ring-amber-500/20 shadow-md",
            barColor: "bg-amber-500",
            iconBg: "bg-amber-50 text-amber-600",
            link: "/accounts/administrator/performance_management/my_team?status=3rd_review",
        },
        {
            id: "probationary_5th",
            title: "Probationary 5th Review",
            count: regData.probation_5th_review || 0,
            percentage: getPercentage(
                regData.probation_5th_review,
                totalTeamCount,
            ),
            icon: CalendarCheck,
            activeRing: "border-orange-500 ring-2 ring-orange-500/20 shadow-md",
            barColor: "bg-orange-500",
            iconBg: "bg-orange-50 text-orange-600",
            link: "/accounts/administrator/performance_management/my_team?status=5th_review",
        },
    ];

    // Row 2: Coaching Metrics
    const totalCoachingCount = coachingData.total || 0;
    const coachingCards = [
        {
            id: "total-coaching",
            title: "Total Coaching",
            count: totalCoachingCount,
            percentage: "100%",
            icon: MessageSquare,
            activeRing: "border-indigo-500 ring-2 ring-indigo-500/20 shadow-md",
            barColor: "bg-indigo-600",
            iconBg: "bg-indigo-50 text-indigo-600",
            link: "/accounts/administrator/performance_management/reach?status",
        },
        {
            id: "pending-coaching",
            title: "Pending",
            count: coachingData.pending || 0,
            percentage: getPercentage(coachingData.pending, totalCoachingCount),
            icon: Hourglass,
            activeRing: "border-rose-500 ring-2 ring-rose-500/20 shadow-md",
            barColor: "bg-rose-500",
            iconBg: "bg-rose-50 text-rose-600",
            link: "/accounts/administrator/performance_management/reach?status=PENDING",
        },
        {
            id: "acknowledged-coaching",
            title: "Acknowledged",
            count: coachingData.acknowledged || 0,
            percentage: getPercentage(
                coachingData.acknowledged,
                totalCoachingCount,
            ),
            icon: CheckCircle2,
            activeRing: "border-teal-500 ring-2 ring-teal-500/20 shadow-md",
            barColor: "bg-teal-600",
            iconBg: "bg-teal-50 text-teal-600",
            link: "/accounts/administrator/performance_management/reach?status=ACKNOWLEDGED",
        },
    ];

    // Row 3: Corrective Actions Metrics
    const totalCACount = correctiveData.total || 0;
    const disciplinaryCards = [
        {
            id: "total-disciplinary",
            title: "TOTAL",
            count: totalCACount,
            percentage: "100%",
            icon: AlertCircle,
            activeRing: "border-slate-800 ring-2 ring-slate-800/20 shadow-md",
            barColor: "bg-slate-800",
            iconBg: "bg-slate-100 text-slate-800",
            link: "/accounts/administrator/performance_management/corrective_action?status=all",
        },
        {
            id: "pending",
            title: "PENDING",
            count: correctiveData.pending || 0,
            percentage: getPercentage(correctiveData.pending, totalCACount),
            icon: Hourglass,
            activeRing: "border-rose-500 ring-2 ring-rose-500/20 shadow-md",
            barColor: "bg-rose-500",
            iconBg: "bg-rose-50 text-rose-600",
            link: "/accounts/administrator/performance_management/corrective_action?status=PENDING",
        },
        {
            id: "pending-employee-explanation",
            title: "PENDING EMPLOYEE EXPLANATION",
            count: correctiveData.pending_employee_explanation || 0,
            percentage: getPercentage(
                correctiveData.pending_employee_explanation,
                totalCACount,
            ),
            icon: FileText,
            activeRing: "border-amber-500 ring-2 ring-amber-500/20 shadow-md",
            barColor: "bg-amber-500",
            iconBg: "bg-amber-50 text-amber-600",
            link: "/accounts/administrator/performance_management/corrective_action?status=PENDING EMPLOYEE EXPLANATION",
        },
        {
            id: "pending-final-sanction",
            title: "PENDING FINAL SANCTION",
            count: correctiveData.pending_final_sanction || 0,
            percentage: getPercentage(
                correctiveData.pending_final_sanction,
                totalCACount,
            ),
            icon: Gavel,
            activeRing: "border-purple-500 ring-2 ring-purple-500/20 shadow-md",
            barColor: "bg-purple-600",
            iconBg: "bg-purple-50 text-purple-600",
            link: "/accounts/administrator/performance_management/corrective_action?status=PENDING FINAL SANCTION",
        },
        {
            id: "pending-employee-commitment",
            title: "PENDING EMPLOYEE COMMITMENT",
            count: correctiveData.pending_employee_commitment || 0,
            percentage: getPercentage(
                correctiveData.pending_employee_commitment,
                totalCACount,
            ),
            icon: ShieldAlert,
            activeRing: "border-orange-500 ring-2 ring-orange-500/20 shadow-md",
            barColor: "bg-orange-500",
            iconBg: "bg-orange-50 text-orange-600",
            link: "/accounts/administrator/performance_management/corrective_action?status=PENDING EMPLOYEE COMMITMENT",
        },
        {
            id: "completed",
            title: "COMPLETED",
            count: correctiveData.completed || 0,
            percentage: getPercentage(correctiveData.completed, totalCACount),
            icon: CheckCircle2,
            activeRing:
                "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md",
            barColor: "bg-emerald-600",
            iconBg: "bg-emerald-50 text-emerald-600",
            link: "/accounts/administrator/performance_management/corrective_action?status=COMPLETED",
        },
    ];

    const renderCardRow = (
        cards,
        activeId,
        setActiveId,
        gridCols = "sm:grid-cols-2 lg:grid-cols-3",
    ) => (
        <div className={`grid grid-cols-1 gap-5 ${gridCols}`}>
            {cards.map((card) => {
                const Icon = card.icon;
                const isSelected = activeId === card.id;

                return (
                    <Link
                        key={card.id}
                        href={card.link || "#"}
                        onClick={() => setActiveId(card.id)}
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 text-left transition-all duration-200 cursor-pointer select-none active:scale-[0.98] focus:outline-none ${
                            isSelected
                                ? `${card.activeRing} -translate-y-1`
                                : "border-slate-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md shadow-sm"
                        }`}
                    >
                        <span
                            className={`absolute inset-x-0 top-0 h-1.5 transition-colors duration-200 ${
                                isSelected
                                    ? card.barColor
                                    : "bg-transparent group-hover:bg-slate-200"
                            }`}
                        />

                        <div>
                            <div className="flex items-center justify-between">
                                <span
                                    className={`inline-flex rounded-xl p-2.5 transition-transform duration-200 group-hover:scale-105 ${card.iconBg}`}
                                >
                                    <Icon className="h-5 w-5 stroke-[2]" />
                                </span>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-baseline gap-1 text-right">
                                        <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                                            {card.count}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-400">
                                            ({card.percentage})
                                        </span>
                                    </div>

                                    <span
                                        className={`flex h-5 w-5 items-center justify-center rounded-full text-white transition-all duration-200 ${
                                            isSelected
                                                ? `${card.barColor} scale-100 opacity-100`
                                                : "scale-75 opacity-0"
                                        }`}
                                    >
                                        <Check className="h-3 w-3 stroke-[3]" />
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-xs font-semibold tracking-wide text-slate-600 line-clamp-1">
                                    {card.title}
                                </p>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Row 1: Team Overview */}
            <section className="space-y-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        Team Overview
                    </h2>
                    <p className="text-xs text-slate-500">
                        Employment status and headcount distribution
                    </p>
                </div>
                {renderCardRow(
                    teamCards,
                    activeTeamCard,
                    setActiveTeamCard,
                    "sm:grid-cols-2 lg:grid-cols-5",
                )}
            </section>

            {/* Row 2: Coaching Sessions */}
            <section className="space-y-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        Coaching Sessions
                    </h2>
                    <p className="text-xs text-slate-500">
                        Log progress and employee acknowledgment status
                    </p>
                </div>
                {renderCardRow(
                    coachingCards,
                    activeCoachingCard,
                    setActiveCoachingCard,
                    "sm:grid-cols-2 lg:grid-cols-3",
                )}
            </section>

            {/* Row 3: Corrective Actions & Workflow */}
            <section className="space-y-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        Corrective Actions & Workflow
                    </h2>
                    <p className="text-xs text-slate-500">
                        Status pipeline across stages and resolutions
                    </p>
                </div>
                {renderCardRow(
                    disciplinaryCards,
                    activeDisciplinaryCard,
                    setActiveDisciplinaryCard,
                    "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3",
                )}
            </section>
        </div>
    );
}
