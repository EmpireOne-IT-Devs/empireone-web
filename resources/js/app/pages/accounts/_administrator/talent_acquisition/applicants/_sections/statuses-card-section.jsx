import React, { useState } from 'react';
import { UserCheck, UserX, Award, XOctagon, X, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { router } from '@inertiajs/react';

// Reusable Card Component for consistent styling and animations
const StatCard = ({ title, count, type, icon: Icon, onClick }) => {
    const isSuccess = type === 'success';

    return (
        <div
            onClick={onClick}
            className={`
                relative overflow-hidden rounded-2xl p-6 bg-white border 
                transition-all duration-300 ease-in-out cursor-pointer
                hover:-translate-y-1 hover:shadow-xl group
                ${isSuccess ? 'hover:border-emerald-500' : 'hover:border-rose-500'}
            `}
        >
            {/* Background Decorative Blob on Hover */}
            <div className={`
                absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-0 
                transition-opacity duration-500 blur-2xl group-hover:opacity-10
                ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}
            `} />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform origin-left duration-300">
                        {count}
                    </h3>
                </div>

                <div className={`
                    p-3 rounded-xl transition-colors duration-300
                    ${isSuccess
                        ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'
                        : 'bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'}
                `}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
};
// ... (imports and StatCard component remain exactly the same)

export default function StatusesCardSection() {
    const [search, setSearch] = useState('');

    // Pulling statuses from Redux store
    const { statuses } = useSelector((store) => store.job_postings);

    // Default fallback data if the API hasn't loaded yet
    const data = statuses || {
        initial_passed: 0,
        initial_failed: 0,
        final_passed: 0,
        final_failed: 0,
        final_pooled: 0,
        no_shows: 0
    };

    console.log('statuses', statuses);
    const [activeFilter, setActiveFilter] = useState(null);

    const handleCardClick = (table, status) => {
        // setActiveFilter(activeFilter === filterName ? null : filterName);
        router.visit(`?${table}=${status}`, {
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

    // --- FIX APPLIED HERE ---
    const handleSearch = (e) => {
        e.preventDefault();

        router.visit('?search=' + search, {
            preserveState: true,
            preserveScroll: true, // Prevent snapping to top
            onSuccess: () => {
                // Smooth scroll to table
                const resultsSection = document.getElementById('results-table');
                if (resultsSection) {
                    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    };

    const clearSearch = (e) => {
        // Prevent default isn't strictly necessary for a type="button", but it doesn't hurt.
        if (e) e.preventDefault();

        // Clear local state
        setSearch('');

        // Clear the URL search parameter
        router.visit(window.location.pathname, {
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
        <div className="w-full py-6">

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Applicant"
                    count={data.total_applicant}
                    type="success"
                    icon={UserCheck}
                    onClick={() => handleCardClick('total_applicant')}
                />
                <StatCard
                    title="Initial Passed"
                    count={data.initial_passed}
                    type="success"
                    icon={UserCheck}
                    onClick={() => handleCardClick('initial_passed')}
                />
                <StatCard
                    title="Initial Failed"
                    count={data.initial_failed}
                    type="danger"
                    icon={UserX}
                    onClick={() => handleCardClick('initial_failed')}
                />
                <StatCard
                    title="Final Passed"
                    count={data.final_passed}
                    type="success"
                    icon={Award}
                    onClick={() => handleCardClick('final_passed', 'Passed')}
                />
                <StatCard
                    title="Final Failed"
                    count={data.final_failed}
                    type="danger"
                    icon={XOctagon}
                    onClick={() => handleCardClick('final_failed')}
                />
                <StatCard
                    title="Pool"
                    count={data.final_pooled}
                    type="success"
                    icon={UserCheck}
                    onClick={() => handleCardClick('final_pooled', 'Pool')}
                />

                <StatCard
                    title="No Shows"
                    count={data.no_shows}
                    type="danger"
                    icon={XOctagon}
                    onClick={() => handleCardClick('no_shows')}
                />

                <StatCard
                    title="Remaining Applicants"
                    count={data.remaining_applicants}
                    type="danger"
                    icon={XOctagon}
                    onClick={() => handleCardClick('remaining_applicants')}
                />

            </div>

            <div className="mt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* Title Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Today's Pipeline</h2>
                        <p className="text-sm text-gray-500">Overview of application statuses updated today.</p>
                    </div>

                    {/* Interactive Search Form */}
                    <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
                        {/* Search Icon */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300">
                            <Search size={18} strokeWidth={2.5} />
                        </div>

                        {/* Input Field */}
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search applicants by name..."
                            className="
                                w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700
                                shadow-sm transition-all duration-300 ease-in-out
                                focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-gray-300
                            "
                        />

                        {/* Clear Button (Only shows when there is text) */}
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
    );
}