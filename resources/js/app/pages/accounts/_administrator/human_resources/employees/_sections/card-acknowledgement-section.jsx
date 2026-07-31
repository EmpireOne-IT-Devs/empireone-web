import React from 'react';
import { useSelector } from 'react-redux';
import {
    Eye,
    User,
    Mail,
    Building,
    Briefcase,
    MapPin
} from 'lucide-react';
import AcknowledgementsListSection from './acknowledgements-list-section';
import { router } from '@inertiajs/react';

export default function CardAcknowledgementSection() {
    const { employees } = useSelector((store) => store.human_resources);

    return (
        <div className="flex bg-gray-100 p-6 gap-6 flex-wrap w-full justify-start items-start">
            {employees?.data?.map((res) => {
                const empId = res.id || res.employee_id;
console.log('waaaa',res)
                return (
                    <div
                        key={empId}
                        className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.15rem)] max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between gap-4 text-sm relative overflow-visible"
                    >
                        {/* Top Employee Info Section */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                                    Employee Details
                                </span>
                                <span className="font-mono text-xs font-bold text-gray-500">
                                    #{res?.employee_id || 'N/A'}
                                </span>
                            </div>

                            {/* Fullname */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                    <User className="w-4 h-4 text-purple-600" /> Fullname
                                </span>
                                <span className="font-semibold text-gray-900 text-right truncate">
                                    {res?.user?.name || res?.personal_information?.first_name || 'N/A'}
                                </span>
                            </div>

                            {/* Email */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                    <Mail className="w-4 h-4 text-purple-600" /> Email
                                </span>
                                <span className="text-gray-900 font-medium truncate max-w-[180px] text-right" title={res?.user?.email || res?.eogs_email}>
                                    {res?.user?.email || res?.eogs_email || 'N/A'}
                                </span>
                            </div>

                            {/* Department */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                    <Building className="w-4 h-4 text-purple-600" /> Department
                                </span>
                                <span className="text-gray-900 font-medium text-right truncate">
                                    {res?.department?.name || 'N/A'}
                                </span>
                            </div>

                            {/* Account */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                    <Briefcase className="w-4 h-4 text-purple-600" /> Account
                                </span>
                                <span className="text-gray-900 font-medium text-right truncate">
                                    {res?.account?.name || res?.account || 'N/A'}
                                </span>
                            </div>

                            {/* Site */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                    <MapPin className="w-4 h-4 text-purple-600" /> Site
                                </span>
                                <span className="text-gray-900 font-medium text-right truncate">
                                    {res?.site?.location?.name || 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Acknowledgements Accordion Section */}
                        <AcknowledgementsListSection props_data={res} empId={empId} />

                        {/* Bottom Actions */}
                        <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100/80">
                            <button
                                onClick={() => router.visit(`/accounts/${window.location.pathname.split('/')[2]}/my_team/${res.id}/personal_information`)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <Eye className="w-3.5 h-3.5" /> View Profile
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}