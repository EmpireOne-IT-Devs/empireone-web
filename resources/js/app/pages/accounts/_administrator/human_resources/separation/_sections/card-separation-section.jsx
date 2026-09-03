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
import DocumentsListSection from './documents-list-section';

export default function CardAcknowledgementSection() {
    const { attritions } = useSelector((store) => store.human_resources);

    const accountId = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '';

    console.log('attritions',attritions)
    return (
        <div className="flex bg-gray-100 gap-6 flex-wrap w-full justify-start items-start">
            {attritions?.map((res) => {
                const empId = res.id || res.employee_id;


                const exit_documents = [{
                    document_type: 'Exit Clearance',
                    href: `/accounts/off_boarding_documents/${res.id}/exit-clearance`,
                    ...res.exit_clearance
                }, {
                    document_type: 'Exit Interview',
                    href: `/accounts/off_boarding_documents/${res.id}/exit-interview`,
                    ...res.exit_interview
                }]
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
                                value: `${res?.personal_information?.first_name} ${res?.personal_information?.last_name}`,
                            },
                            {
                                id: 'email',
                                label: 'Email',
                                icon: LuMail,
                                value:  res?.personal_information?.employee?.eogs_email ,
                                title:  res?.personal_information?.employee?.eogs_email ,
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
                                value: res?.department,
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
                        dropdown={<DocumentsListSection props_data={{ documents: exit_documents }} />}
                    />
                );
            })}
        </div>
    );
}