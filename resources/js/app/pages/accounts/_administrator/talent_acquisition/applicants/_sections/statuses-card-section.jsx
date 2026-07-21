import React, { useEffect, useState } from 'react';
import {
    UserCheck,
    UserX,
    Award,
    XOctagon,
    X,
    Search,
    Users,
    Clock,
    CalendarClock,
    Layers,
    UserMinus,
    Mail,
    ThumbsUp,
    ThumbsDown,
    Briefcase,
    Ban,
    ClipboardCheck
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Input from "@/app/_components/input";
import { router } from '@inertiajs/react';
import Select from '@/app/_components/select';

// Upgraded Reusable Card Component 
const StatCard = ({ title, count, type, icon: Icon, onClick }) => {
    const theme = {
        success: {
            border: 'hover:border-emerald-500',
            bg: 'bg-emerald-500',
            icon: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'
        },
        danger: {
            border: 'hover:border-rose-500',
            bg: 'bg-rose-500',
            icon: 'bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'
        },
        pending: {
            border: 'hover:border-amber-500',
            bg: 'bg-amber-500',
            icon: 'bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'
        },
        info: {
            border: 'hover:border-blue-500',
            bg: 'bg-blue-500',
            icon: 'bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white'
        }
    }[type] || theme.info;

    return (
        <div
            onClick={onClick}
            className={`
                relative overflow-hidden rounded-2xl p-6 bg-white border 
                transition-all duration-300 ease-in-out cursor-pointer
                hover:-translate-y-1 hover:shadow-xl group
                ${theme.border}
            `}
        >
            <div className={`
                absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-0 
                transition-opacity duration-500 blur-2xl group-hover:opacity-10
                ${theme.bg}
            `} />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform origin-left duration-300">
                        {count}
                    </h3>
                </div>

                <div className={`p-3 rounded-xl transition-colors duration-300 ${theme.icon}`}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
};

export default function StatusesCardSection() {
    const [search, setSearch] = useState('');

    const { statuses } = useSelector((store) => store.job_postings);
    const { data: app_data } = useSelector((store) => store.app);

    // Parse URL Search Parameters safely
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const currentLocationId = searchParams.get('location_id') || app_data?.user?.account_employee?.location_id;

    // NEW: Extract current date param to bind it to the controlled date input
    const currentSearchDate = searchParams.get('search_date') || '';

    useEffect(() => {
        setSearch(searchParams.get('search') || '');
    }, [window.location.search]);

    // Fallback numbers for UI counters
    const data = statuses || {
        initial_passed: 0,
        initial_failed: 0,
        final_passed: 0,
        final_failed: 0,
        final_withdrawn: 0,
        final_pooled: 0,
        final_sent_job_offer: 0,
        final_accepted_job_offer: 0,
        final_declined_job_offer: 0,
        final_passed_with_condition: 0,
        final_hired: 0,
        final_rejected: 0,
        no_shows: 0,
        total_applicant: 0,
        for_initial: 0,
        for_final: 0
    };

    const handleCardClick = (table, status) => {
        const currentParams = new URLSearchParams(window.location.search);

        currentParams.delete('page');
        if (table && status) {
            currentParams.delete('statuses');
            currentParams.delete('final_status');
            currentParams.delete('interview_status');
            currentParams.delete('search');
            currentParams.set(table, status);
        } else {
            currentParams.delete('statuses');
            currentParams.delete('final_status');
            currentParams.delete('search');
            currentParams.delete('interview_status');
        }

        const newQueryString = currentParams.toString();
        const url = newQueryString ? `?${newQueryString}` : window.location.pathname;

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                const resultsSection = document.getElementById('results-table');
                if (resultsSection) {
                    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const currentParams = new URLSearchParams(window.location.search);

        currentParams.delete('search_date');
        currentParams.delete('final_status');
        currentParams.delete('interview_status');
        currentParams.delete('page');
        if (search) {
            currentParams.set('search', search);
            currentParams.delete('statuses');

        } else {
            currentParams.delete('search');
        }

        router.visit(`?${currentParams.toString()}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                const resultsSection = document.getElementById('results-table');
                if (resultsSection) {
                    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    };

    const clearSearch = (e) => {
        if (e) e.preventDefault();
        setSearch('');
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.delete('search');

        const newQueryString = currentParams.toString();
        const url = newQueryString ? `?${newQueryString}` : window.location.pathname;

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                const resultsSection = document.getElementById('results-table');
                if (resultsSection) {
                    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    };

    // NEW: Handle dynamic date queries securely preserving existing active parameters
    const handleDateChange = (dateValue) => {
        const currentParams = new URLSearchParams(window.location.search);

        if (dateValue) {
            currentParams.set('search_date', dateValue);
        } else {
            currentParams.delete('search_date');
        }

        router.visit(`?${currentParams.toString()}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                const resultsSection = document.getElementById('results-table');
                if (resultsSection) {
                    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    };

    return (
        <div className="w-full">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                    title="Total Applicant"
                    count={data.total_applicant}
                    type="info"
                    icon={Users}
                    onClick={() => handleCardClick('', '')}
                />
                <StatCard
                    title="For Initial Interview"
                    count={data.for_initial}
                    type="pending"
                    icon={Clock}
                    onClick={() => handleCardClick('statuses', 'For Initial Interview')}
                />
                <StatCard
                    title="For Final Interview"
                    count={data.for_final}
                    type="pending"
                    icon={CalendarClock}
                    onClick={() => handleCardClick('statuses', 'For Final Interview')}
                />
                <StatCard
                    title="Final Passed"
                    count={data.final_passed}
                    type="success"
                    icon={Award}
                    onClick={() => handleCardClick('final_status', 'Passed')}
                />
                <StatCard
                    title="Pool"
                    count={data.final_pooled}
                    type="info"
                    icon={Layers}
                    onClick={() => handleCardClick('final_status', 'Pooled')}
                />
                <StatCard
                    title="Passed w/ Condition"
                    count={data.final_passed_with_condition}
                    type="pending"
                    icon={ClipboardCheck}
                    onClick={() => handleCardClick('final_status', 'Passed with Condition')}
                />
                <StatCard
                    title="Accepted Job Offer"
                    count={data.final_accepted_job_offer}
                    type="success"
                    icon={ThumbsUp}
                    onClick={() => handleCardClick('final_status', 'Accepted Job Offer')}
                />
                <StatCard
                    title="Hired"
                    count={data.final_hired}
                    type="success"
                    icon={Briefcase}
                    onClick={() => handleCardClick('final_status', 'Hired')}
                />
                <StatCard
                    title="Sent Job Offer"
                    count={data.final_sent_job_offer}
                    type="info"
                    icon={Mail}
                    onClick={() => handleCardClick('final_status', 'Sent Job Offer')}
                />
                <StatCard
                    title="No Shows"
                    count={data.no_shows}
                    type="danger"
                    icon={UserMinus}
                    onClick={() => handleCardClick('final_status', 'No Show')}
                />
                <StatCard
                    title="Initial Failed"
                    count={data.initial_failed}
                    type="danger"
                    icon={UserX}
                    onClick={() => handleCardClick('interview_status', 'Failed')}
                />
                <StatCard
                    title="Final Failed"
                    count={data.final_failed}
                    type="danger"
                    icon={UserX}
                    onClick={() => handleCardClick('final_status', 'Failed')}
                />
                <StatCard
                    title="Declined Job Offer"
                    count={data.final_declined_job_offer}
                    type="danger"
                    icon={ThumbsDown}
                    onClick={() => handleCardClick('final_status', 'Declined Job Offer')}
                />
                <StatCard
                    title="Rejected"
                    count={data.final_rejected}
                    type="danger"
                    icon={XOctagon}
                    onClick={() => handleCardClick('final_status', 'Rejected')}
                />
                <StatCard
                    title="Withdrawn"
                    count={data.final_withdrawn}
                    type="danger"
                    icon={Ban}
                    onClick={() => handleCardClick('final_status', 'Withdrawn')}
                />
            </div>

            {/* Title & Filtering Row */}
            <div className="mt-6">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    {/* Title Section */}
                    <div className="shrink-0">
                        <h2 className="text-2xl font-bold text-gray-800">Today's Pipeline</h2>
                        <p className="text-sm text-gray-500">Overview of application statuses updated today.</p>
                    </div>

                    {/* Mobile-Responsive Inputs Container */}
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end w-full lg:justify-end">
                        {/* Location Select */}
                        <div className="w-full md:w-64">
                            <Select
                                label="Location"
                                name="location_id"
                                className="w-full"
                                value={Number(currentLocationId)}
                                options={app_data?.locations?.map(res => ({
                                    label: res.name,
                                    value: res.id
                                }))}
                                onChange={(val) => {
                                    const currentParams = new URLSearchParams(window.location.search);
                                    currentParams.set('location_id', val);
                                    router.visit(`?${currentParams.toString()}`, {
                                        preserveState: true,
                                        preserveScroll: true
                                    });
                                }}
                            />
                        </div>

                        {/* Search Date Input */}
                        <div className="w-full md:w-64">
                            <Input
                                type="date"
                                label="Search Date"
                                name="search_date"
                                value={currentSearchDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Search Input Form */}
                        <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                iconLeft={<Search size={18} strokeWidth={2.5} />}
                                label="Search applicants by name..."
                                className="w-full"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-rose-500 transition-colors duration-200"
                                >
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}