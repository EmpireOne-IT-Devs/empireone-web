import React from 'react';
import { useSelector } from 'react-redux';
import { LuBriefcase, LuBuilding, LuMail, LuMapPin, LuUser, LuUserCheck } from 'react-icons/lu';

import DetailsCard from '@/app/_components/details-card';
import EmployeeActionSection from './employee-action-section';
import AcknowledgementsListSection from './acknowledgements-list-section';
import ShowEmployeeDetailsSection from './show-employee-details-section';

// Helper using exactly your required fields array
const calculateCompletion = (res) => {
    if (!res) return 0;

    // EXACT fields provided for profile completion
    const fields = [
        res?.employee_id,
        res?.department_id,
        res?.position,
        res?.eogs_email,
        res?.user?.email,
        res?.personal_information?.first_name,
        res?.personal_information?.last_name,
        res?.personal_information?.contact,
        res?.personal_information?.date_of_birth,
        res?.site_id,
        res?.reporting_to,
        res?.department_manager_id
    ];

    // Count how many of these required fields have a valid value
    const filledFields = fields.filter(field => field !== null && field !== undefined && field !== '');

    // Return percentage
    return Math.round((filledFields.length / fields.length) * 100);
};

export default function CardAcknowledgementSection() {
    const { employees } = useSelector((store) => store.human_resources);

    return (
        <div className="flex gap-6 flex-wrap w-full justify-start items-start">
            {employees?.data?.map((res) => {
                const empId = res.id || res.employee_id;
                const completionPercent = calculateCompletion(res);

                return (
                    <DetailsCard
                        key={empId}
                        data={res}
                        badgeRight={`#${res.employee_id}`}
                        onView={<ShowEmployeeDetailsSection props_data={res} />}
                        list={[
                            {
                                id: 'fullname',
                                label: 'Fullname',
                                icon: LuUser,
                                value: `${res?.personal_information?.first_name || ''} ${res?.personal_information?.middle_name ?? ''} ${res?.personal_information?.last_name || ''}`.trim(),
                            },
                            {
                                id: 'email',
                                label: 'Email',
                                icon: LuMail,
                                value: res?.user?.email || res?.eogs_email,
                                title: res?.user?.email || res?.eogs_email,
                                extraClasses: 'max-w-[180px]',
                            },
                            {
                                id: 'department',
                                label: 'Department',
                                icon: LuBuilding,
                                value: res?.department?.name,
                            },
                            {
                                id: 'account',
                                label: 'Account',
                                icon: LuBriefcase,
                                value: res?.account?.name || res?.account?.description || res?.account,
                            },
                            {
                                id: 'site',
                                label: 'Site',
                                icon: LuMapPin,
                                value: res?.site?.location?.name || res?.site?.name,
                            },
                            {
                                id: 'completion',
                                label: 'Profile Completion',
                                icon: LuUserCheck,
                                value: (
                                    <div className="flex items-center justify-end gap-2 w-32 ml-auto mt-0.5">
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex-1 shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${completionPercent === 100 ? 'bg-emerald-500' : 'bg-purple-500'
                                                    }`}
                                                style={{ width: `${completionPercent}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-[11px] font-bold w-7 text-right ${completionPercent === 100 ? 'text-emerald-600' : 'text-purple-600'
                                            }`}>
                                            {completionPercent}%
                                        </span>
                                    </div>
                                ),
                            }
                        ]}
                        action={<EmployeeActionSection props_data={res} />}
                        dropdown={<AcknowledgementsListSection props_data={res} empId={empId} />}
                    />
                );
            })}
        </div>
    );
}