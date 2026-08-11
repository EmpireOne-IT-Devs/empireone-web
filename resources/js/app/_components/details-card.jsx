import React from 'react';
import { LuEye } from 'react-icons/lu';

export default function DetailsCard({
    list = [],
    title = 'Employee Details',
    badgeRight,
    onView,
    hideViewButton = false,
    action,
    dropdown,
}) {
    return (
        <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.15rem)] max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4 text-sm relative overflow-visible h-fit self-start">

            {/* Top Info Section */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div className="flex items-center justify-center gap-2">
                        {action && <div>{action}</div>}
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                            {title}
                        </span>
                    </div>
                    {
                        <span className="font-mono text-xs font-bold text-gray-500">
                            {badgeRight}
                        </span>
                    }
                </div>

                {/* Dynamic List Rows */}
                {list.map((detail) => {
                    const Icon = detail.icon;
                    return (
                        <div key={detail.id} className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                {Icon && <Icon className="w-4 h-4 text-purple-600" />} {detail.label}
                            </span>
                            <span
                                className={`text-gray-900 font-medium text-right truncate ${detail.extraClasses || ''}`}
                                title={detail.title}
                            >
                                {detail.value !== undefined && detail.value !== null ? detail.value : 'N/A'}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Dropdown / Extra Sections */}
            {dropdown}

            {/* Bottom Actions */}
            {!hideViewButton && (
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100/80">
                    <button
                        onClick={onView}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <LuEye className="w-3.5 h-3.5" /> View Profile
                    </button>
                </div>
            )}
        </div>
    );
}