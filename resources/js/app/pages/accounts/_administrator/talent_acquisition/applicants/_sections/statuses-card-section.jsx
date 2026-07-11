import React, { useState } from 'react';
import { UserCheck, UserX, Award, XOctagon } from 'lucide-react';
import { useSelector } from 'react-redux';

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

export default function StatusesCardSection() {
    // Default fallback data if the API hasn't loaded yet
    const { statuses } = useSelector(
        (store) => store.job_postings,
    );
    const data = statuses || {
        initial_passed: 0,
        initial_failed: 0,
        final_passed: 0,
        final_failed: 0,
    };

    // Optional: Add state to track which card is active if you want to filter a table below it
    const [activeFilter, setActiveFilter] = useState(null);

    const handleCardClick = (filterName) => {
        setActiveFilter(activeFilter === filterName ? null : filterName);
        // You can pass this state up to a parent component to filter your datatable!
    };

    return (
        <div className="w-full py-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Today's Pipeline</h2>
                <p className="text-sm text-gray-500">Overview of application statuses updated today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    onClick={() => handleCardClick('final_passed')}
                />
                <StatCard
                    title="Final Failed"
                    count={data.final_failed}
                    type="danger"
                    icon={XOctagon}
                    onClick={() => handleCardClick('final_failed')}
                />
            </div>
        </div>
    );
}