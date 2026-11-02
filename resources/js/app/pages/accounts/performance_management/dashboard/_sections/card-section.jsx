import React, { useState } from 'react';
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
    MessagesSquare,
    ShieldCheck
} from 'lucide-react';

export default function CardSection() {
    const [activeTeamCard, setActiveTeamCard] = useState('total-team');
    const [activeCoachingCard, setActiveCoachingCard] = useState('total-coaching');
    const [activeOtherCoachingCard, setActiveOtherCoachingCard] = useState('total-other-coaching');
    const [activeDisciplinaryCard, setActiveDisciplinaryCard] = useState('total-disciplinary');
    const [activeOtherDisciplinaryCard, setActiveOtherDisciplinaryCard] = useState('total-other-disciplinary');

    // Row 1: Team Metrics (Total placed on the right)
    const teamCards = [
        {
            id: 'regular',
            title: 'Regular',
            count: 124,
            percentage: '84%',
            icon: UserCheck,
            activeRing: 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md',
            barColor: 'bg-emerald-600',
            iconBg: 'bg-emerald-50 text-emerald-600',
        },
        {
            id: 'probationary_3rd',
            title: 'Probationary 3rd Review',
            count: 14,
            percentage: '9%',
            icon: Clock,
            activeRing: 'border-amber-500 ring-2 ring-amber-500/20 shadow-md',
            barColor: 'bg-amber-500',
            iconBg: 'bg-amber-50 text-amber-600',
        },
        {
            id: 'probationary_5th',
            title: 'Probationary 5th Review',
            count: 10,
            percentage: '7%',
            icon: CalendarCheck,
            activeRing: 'border-orange-500 ring-2 ring-orange-500/20 shadow-md',
            barColor: 'bg-orange-500',
            iconBg: 'bg-orange-50 text-orange-600',
        },
        {
            id: 'total-team',
            title: 'Total Team',
            count: 148,
            percentage: '100%',
            icon: Users,
            activeRing: 'border-blue-500 ring-2 ring-blue-500/20 shadow-md',
            barColor: 'bg-blue-600',
            iconBg: 'bg-blue-50 text-blue-600',
        },
    ];

    // Row 2: Coaching Metrics (My Team)
    const coachingCards = [
        {
            id: 'pending-coaching',
            title: 'Pending',
            count: 17,
            percentage: '29%',
            icon: Hourglass,
            activeRing: 'border-rose-500 ring-2 ring-rose-500/20 shadow-md',
            barColor: 'bg-rose-500',
            iconBg: 'bg-rose-50 text-rose-600',
        },
        {
            id: 'acknowledged-coaching',
            title: 'Acknowledged',
            count: 41,
            percentage: '71%',
            icon: CheckCircle2,
            activeRing: 'border-teal-500 ring-2 ring-teal-500/20 shadow-md',
            barColor: 'bg-teal-600',
            iconBg: 'bg-teal-50 text-teal-600',
        },
        {
            id: 'total-coaching',
            title: 'Total Coaching',
            count: 58,
            percentage: '100%',
            icon: MessageSquare,
            activeRing: 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md',
            barColor: 'bg-indigo-600',
            iconBg: 'bg-indigo-50 text-indigo-600',
        },
    ];

    // Row 3: Coaching Metrics (Other Team)
    const otherCoachingCards = [
        {
            id: 'other-pending-coaching',
            title: 'Pending',
            count: 9,
            percentage: '26%',
            icon: Hourglass,
            activeRing: 'border-rose-500 ring-2 ring-rose-500/20 shadow-md',
            barColor: 'bg-rose-500',
            iconBg: 'bg-rose-50 text-rose-600',
        },
        {
            id: 'other-acknowledged-coaching',
            title: 'Acknowledged',
            count: 26,
            percentage: '74%',
            icon: CheckCircle2,
            activeRing: 'border-teal-500 ring-2 ring-teal-500/20 shadow-md',
            barColor: 'bg-teal-600',
            iconBg: 'bg-teal-50 text-teal-600',
        },
        {
            id: 'total-other-coaching',
            title: 'Total Coaching (Other Team)',
            count: 35,
            percentage: '100%',
            icon: MessagesSquare,
            activeRing: 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-md',
            barColor: 'bg-cyan-600',
            iconBg: 'bg-cyan-50 text-cyan-600',
        },
    ];

    // Row 4: Disciplinary Actions / Escalations (My Team)
    const disciplinaryCards = [
        {
            id: 'pending',
            title: 'PENDING',
            count: 6,
            percentage: '14%',
            icon: Hourglass,
            activeRing: 'border-rose-500 ring-2 ring-rose-500/20 shadow-md',
            barColor: 'bg-rose-500',
            iconBg: 'bg-rose-50 text-rose-600',
        },
        {
            id: 'pending-employee-explanation',
            title: 'PENDING EMPLOYEE EXPLANATION',
            count: 5,
            percentage: '12%',
            icon: FileText,
            activeRing: 'border-amber-500 ring-2 ring-amber-500/20 shadow-md',
            barColor: 'bg-amber-500',
            iconBg: 'bg-amber-50 text-amber-600',
        },
        {
            id: 'pending-final-sanction',
            title: 'PENDING FINAL SANCTION',
            count: 3,
            percentage: '7%',
            icon: Gavel,
            activeRing: 'border-purple-500 ring-2 ring-purple-500/20 shadow-md',
            barColor: 'bg-purple-600',
            iconBg: 'bg-purple-50 text-purple-600',
        },
        {
            id: 'pending-employee-commitment',
            title: 'PENDING EMPLOYEE COMMITMENT',
            count: 4,
            percentage: '10%',
            icon: ShieldAlert,
            activeRing: 'border-orange-500 ring-2 ring-orange-500/20 shadow-md',
            barColor: 'bg-orange-500',
            iconBg: 'bg-orange-50 text-orange-600',
        },
        {
            id: 'completed',
            title: 'COMPLETED',
            count: 24,
            percentage: '57%',
            icon: CheckCircle2,
            activeRing: 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md',
            barColor: 'bg-emerald-600',
            iconBg: 'bg-emerald-50 text-emerald-600',
        },
        {
            id: 'total-disciplinary',
            title: 'TOTAL',
            count: 42,
            percentage: '100%',
            icon: AlertCircle,
            activeRing: 'border-slate-800 ring-2 ring-slate-800/20 shadow-md',
            barColor: 'bg-slate-800',
            iconBg: 'bg-slate-100 text-slate-800',
        },
    ];

    // Row 5: Corrective Actions / Escalations (Other Team)
    const otherDisciplinaryCards = [
        {
            id: 'other-pending',
            title: 'PENDING',
            count: 3,
            percentage: '16%',
            icon: Hourglass,
            activeRing: 'border-rose-500 ring-2 ring-rose-500/20 shadow-md',
            barColor: 'bg-rose-500',
            iconBg: 'bg-rose-50 text-rose-600',
        },
        {
            id: 'other-pending-employee-explanation',
            title: 'PENDING EMPLOYEE EXPLANATION',
            count: 2,
            percentage: '11%',
            icon: FileText,
            activeRing: 'border-amber-500 ring-2 ring-amber-500/20 shadow-md',
            barColor: 'bg-amber-500',
            iconBg: 'bg-amber-50 text-amber-600',
        },
        {
            id: 'other-pending-final-sanction',
            title: 'PENDING FINAL SANCTION',
            count: 2,
            percentage: '11%',
            icon: Gavel,
            activeRing: 'border-purple-500 ring-2 ring-purple-500/20 shadow-md',
            barColor: 'bg-purple-600',
            iconBg: 'bg-purple-50 text-purple-600',
        },
        {
            id: 'other-pending-employee-commitment',
            title: 'PENDING EMPLOYEE COMMITMENT',
            count: 1,
            percentage: '5%',
            icon: ShieldAlert,
            activeRing: 'border-orange-500 ring-2 ring-orange-500/20 shadow-md',
            barColor: 'bg-orange-500',
            iconBg: 'bg-orange-50 text-orange-600',
        },
        {
            id: 'other-completed',
            title: 'COMPLETED',
            count: 11,
            percentage: '57%',
            icon: CheckCircle2,
            activeRing: 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md',
            barColor: 'bg-emerald-600',
            iconBg: 'bg-emerald-50 text-emerald-600',
        },
        {
            id: 'total-other-disciplinary',
            title: 'TOTAL (OTHER TEAM)',
            count: 19,
            percentage: '100%',
            icon: ShieldCheck,
            activeRing: 'border-slate-800 ring-2 ring-slate-800/20 shadow-md',
            barColor: 'bg-slate-800',
            iconBg: 'bg-slate-100 text-slate-800',
        },
    ];

    const renderCardRow = (cards, activeId, setActiveId, gridCols = 'sm:grid-cols-2 lg:grid-cols-3') => (
        <div className={`grid grid-cols-1 gap-5 ${gridCols}`}>
            {cards.map((card) => {
                const Icon = card.icon;
                const isSelected = activeId === card.id;

                return (
                    <button
                        key={card.id}
                        type="button"
                        onClick={() => setActiveId(card.id)}
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 text-left transition-all duration-200 cursor-pointer select-none active:scale-[0.98] focus:outline-none ${isSelected
                            ? `${card.activeRing} -translate-y-1`
                            : 'border-slate-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md shadow-sm'
                            }`}
                    >
                        {/* Top Selection Accent Line */}
                        <span
                            className={`absolute inset-x-0 top-0 h-1.5 transition-colors duration-200 ${isSelected ? card.barColor : 'bg-transparent group-hover:bg-slate-200'
                                }`}
                        />

                        <div>
                            {/* Header: Icon + Total Count display on top-right */}
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

                                    {/* Active selection checkmark */}
                                    <span
                                        className={`flex h-5 w-5 items-center justify-center rounded-full text-white transition-all duration-200 ${isSelected ? `${card.barColor} scale-100 opacity-100` : 'scale-75 opacity-0'
                                            }`}
                                    >
                                        <Check className="h-3 w-3 stroke-[3]" />
                                    </span>
                                </div>
                            </div>

                            {/* Card Label */}
                            <div className="mt-4">
                                <p className="text-xs font-semibold tracking-wide text-slate-600 line-clamp-1">
                                    {card.title}
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Row 1: Team Overview */}
            <section className="space-y-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Team Overview</h2>
                    <p className="text-xs text-slate-500">Employment status and headcount distribution</p>
                </div>
                {renderCardRow(teamCards, activeTeamCard, setActiveTeamCard, 'sm:grid-cols-2 lg:grid-cols-4')}
            </section>

            {/* Row 2: Coaching Overview (My Team) */}
            <section className="space-y-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Coaching Sessions (My Team)</h2>
                    <p className="text-xs text-slate-500">Log progress and employee acknowledgment status</p>
                </div>
                {renderCardRow(coachingCards, activeCoachingCard, setActiveCoachingCard, 'sm:grid-cols-2 lg:grid-cols-3')}
            </section>

            {/* Row 3: Coaching Overview (Other Team) */}
            <section className="space-y-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Coaching Sessions (Other Team)</h2>
                    <p className="text-xs text-slate-500">Cross-department or other team coaching tracking</p>
                </div>
                {renderCardRow(otherCoachingCards, activeOtherCoachingCard, setActiveOtherCoachingCard, 'sm:grid-cols-2 lg:grid-cols-3')}
            </section>

            {/* Row 4: Disciplinary / Case Workflow (My Team) */}
            <section className="space-y-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Corrective Actions & Workflow (My Team)</h2>
                    <p className="text-xs text-slate-500">Status pipeline across stages and resolutions for direct team</p>
                </div>
                {renderCardRow(
                    disciplinaryCards,
                    activeDisciplinaryCard,
                    setActiveDisciplinaryCard,
                    'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'
                )}
            </section>

            {/* Row 5: Corrective Actions / Case Workflow (Other Team) */}
            <section className="space-y-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Corrective Actions & Workflow (Other Team)</h2>
                    <p className="text-xs text-slate-500">Status pipeline across stages and resolutions for other teams</p>
                </div>
                {renderCardRow(
                    otherDisciplinaryCards,
                    activeOtherDisciplinaryCard,
                    setActiveOtherDisciplinaryCard,
                    'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'
                )}
            </section>
        </div>
    );
}