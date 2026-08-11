import React from 'react';
import { useSelector } from 'react-redux';
import { router } from '@inertiajs/react';
import { LuBriefcase, LuBuilding, LuMail, LuMapPin, LuUser } from 'react-icons/lu';

import DetailsCard from '@/app/_components/details-card';
// import EmployeeActionSection from './employee-action-section';
// import AcknowledgementsListSection from './acknowledgements-list-section';

export default function CardAcknowledgementSection() {
    const { employees } = useSelector((store) => store.human_resources);

    // Get the account ID safely for the URL
    const accountId = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '';

    return (
        <div className="flex bg-gray-100 gap-6 flex-wrap w-full justify-start items-start">
            {employees?.data?.map((res) => {
                const empId = res.id || res.employee_id;
                return (
                    <DetailsCard
                        key={empId}
                        data={res}
                        onView={() => router.visit(`/accounts/${accountId}/my_team/${res?.user_id}/personal_information`)}
                        list={[
                            {
                                id: 'fullname',
                                label: 'Fullname',
                                icon: LuUser,
                                value: res?.user?.name || res?.personal_information?.first_name,
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
                                value: res?.account?.name || res?.account,
                            },
                            {
                                id: 'site',
                                label: 'Site',
                                icon: LuMapPin,
                                value: res?.site?.location?.name,
                            }
                        ]}
                        // action={<EmployeeActionSection props_data={res} />}
                        // dropdown={<AcknowledgementsListSection props_data={res} empId={empId} />}
                    />
                );
            })}
        </div>
    );
}