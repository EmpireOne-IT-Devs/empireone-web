import React from 'react';
import { useSelector } from 'react-redux';
import { router } from '@inertiajs/react';
import { 
    LuBriefcase, 
    LuBuilding, 
    LuMail, 
    LuMapPin, 
    LuUser, 
    LuCalendar, 
    LuInfo, 
    LuCircleX, 
    LuRotateCcw, 
    LuClock 
} from 'react-icons/lu';

import DetailsCard from '@/app/_components/details-card';
import moment from 'moment';

export default function CardAcknowledgementSection() {
    const { attritions } = useSelector((store) => store.human_resources);

    const accountId = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '';

    return (
        <div className="flex bg-gray-100 gap-6 flex-wrap w-full justify-start items-start">
            {attritions?.map((res) => {
                const empId = res.id || res.employee_id;
                return (
                    <DetailsCard
                        key={empId}
                        badgeRight={`#${res.employee_id}`}
                        onView={() => router.visit(`/accounts/${accountId}/my_team/${res?.user_id}/personal_information`)}
                        list={[
                            {
                                id: 'fullname',
                                label: 'Fullname',
                                icon: LuUser,
                                value: res?.employee?.personal_information?.first_name || res?.fullname,
                            },
                            {
                                id: 'email',
                                label: 'Email',
                                icon: LuMail,
                                value: res?.eogs_email || res?.employee?.email || res?.employee?.eogs_email,
                                title: res?.eogs_email || res?.employee?.email || res?.employee?.eogs_email,
                                extraClasses: 'max-w-[180px]',
                            },
                            {
                                id: 'position',
                                label: 'Position',
                                icon: LuBriefcase,
                                value: res?.position,
                            },
                            {
                                id: 'department',
                                label: 'Department',
                                icon: LuBuilding,
                                value: res?.department || res?.employee?.department?.name,
                            },
                            {
                                id: 'account',
                                label: 'Account',
                                icon: LuBriefcase,
                                value: res?.account || res?.employee?.account?.name || res?.employee?.account,
                            },
                            {
                                id: 'site',
                                label: 'Site',
                                icon: LuMapPin,
                                value: res?.employee?.site?.location?.name,
                            },
                            {
                                id: 'hired_date',
                                label: 'Hired Date',
                                icon: LuCalendar,
                                value: res?.started_at ? moment(res.started_at).format('LL') : '-',
                            },
                            /* --- Added missing database fields below --- */
                            {
                                id: 'separation_date',
                                label: 'Separation Date',
                                icon: LuCalendar,
                                value: res?.separation_date ? moment(res.separation_date).format('LL') : '-',
                            },
                            {
                                id: 'status',
                                label: 'Status',
                                icon: LuInfo,
                                value: res?.status,
                            },
                            {
                                id: 'employment_status',
                                label: 'Employment Status',
                                icon: LuInfo,
                                value: res?.employment_status,
                            },
                            {
                                id: 'reason_for_separation',
                                label: 'Reason for Separation',
                                icon: LuCircleX,
                                value: res?.reason_for_separation,
                            },
                            {
                                id: 'is_rehire',
                                label: 'Eligible for Rehire',
                                icon: LuRotateCcw,
                                value: res?.is_rehire,
                            },
                            {
                                id: 'attrition_status',
                                label: 'Attrition Status',
                                icon: LuClock,
                                value: res?.attrition_status,
                            },
                        ]}
                    />
                );
            })}
        </div>
    );
}