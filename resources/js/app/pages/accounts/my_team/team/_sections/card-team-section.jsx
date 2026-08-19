import React from 'react';
import { useSelector } from 'react-redux';
import { router } from '@inertiajs/react';
import { LuBriefcase, LuBuilding, LuMail, LuMapPin, LuUser, LuVote } from 'react-icons/lu';

import Button from '@/app/_components/button';
import DetailsCard from '@/app/_components/details-card';
import TeamListSection from './team-list-section';
// import EmployeeActionSection from './employee-action-section';
// import AcknowledgementsListSection from './acknowledgements-list-section';

export default function CardTeamSection() {
    const { employees } = useSelector((store) => store.human_resources);

    const role = window.location.pathname.split("/")[2];

    const { data } = useSelector((store) => store.app);
    // Get the account ID safely for the URL
    const accountId = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '';

    return (
        <div className="flex bg-gray-100 gap-6 flex-wrap w-full justify-start items-start">
            {data?.user?.leader?.subordinates?.map((result) => {
                const res = result.employee;
                console.log('daddada', res);
                const empId = res.id || res.employee_id;
                return (
                    <DetailsCard
                        key={empId}
                        badgeRight={`#${res.account_employee?.employee_id}`}
                        onView={() => router.visit(`/accounts/${accountId}/my_team/${res?.id}/personal_information`)}
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
                                value: res?.email || res?.eogs_email,
                                title: res?.email || res?.eogs_email,
                                extraClasses: 'max-w-[180px]',
                            },
                            {
                                id: 'department',
                                label: 'Department',
                                icon: LuBuilding,
                                value: res?.account_employee?.department?.name,
                            },
                            {
                                id: 'account',
                                label: 'Account',
                                icon: LuBriefcase,
                                value: res?.account_employee?.account?.name || res?.account,
                            },
                            {
                                id: 'site',
                                label: 'Site',
                                icon: LuMapPin,
                                value: res?.account_employee?.site?.location?.name,
                            },
                            {
                                id: '3rd Month',
                                label: '3rd Month',
                                icon: LuVote,
                                value: <>
                                    {
                                        (result?.has3_months_evaluation?.status === 'Passed' || result?.has3_months_evaluation?.status === 'Failed') ? (
                                            <Button
                                                onClick={() => window.open(`/accounts/${role}/human_resources/review/evaluations/${result?.has3_months_evaluation?.id}`, '_blank')}
                                                className="!py-1 !px-2 text-xs" // Optional: keeps the button compact inside the list
                                            >
                                                {result?.has3_months_evaluation?.evaluation_period}
                                            </Button>
                                        ) : (
                                            <span className="text-gray-500">
                                                {result?.has3_months_evaluation?.evaluation_period || "No Evaluation"}
                                            </span>
                                        )
                                    }
                                </>,
                            },
                            {
                                id: '5th Month',
                                label: '5th Month',
                                icon: LuVote,
                                value: <>
                                    {
                                        (result?.has5_months_evaluation?.status === 'Passed' || result?.has5_months_evaluation?.status === 'Failed') ? (
                                            <Button
                                                onClick={() => window.open(`/accounts/${role}/human_resources/review/evaluations/${result?.has5_months_evaluation?.id}`, '_blank')}
                                                className="!py-1 !px-2 text-xs"
                                            >
                                                {result?.has5_months_evaluation?.evaluation_period}
                                            </Button>
                                        ) : (
                                            <span className="text-gray-500">
                                                {result?.has5_months_evaluation?.evaluation_period || "No Evaluation"}
                                            </span>
                                        )
                                    }
                                </>,
                            }
                        ]}
                        dropdown={<>
                            <TeamListSection props_data={result}>
                                <div className="flex gap-3">
                                    {(result?.has3_months_evaluation?.evaluation_period === "3 Months" && result?.has3_months_evaluation?.status === null) && (
                                        <Button
                                            className='w-full'
                                            onClick={() => window.open(`/accounts/${role}/performance_evaluation/${result?.employee?.account_employee?.user_id}?evaluation_period=${result?.has3_months_evaluation?.evaluation_period}`, '_blank')}
                                        >
                                            Create {`${result?.has3_months_evaluation?.evaluation_period}`} Evaluate Performance
                                        </Button>
                                    )}

                                    {(result?.has5_months_evaluation?.evaluation_period === "5 Months" && result?.has5_months_evaluation?.status === null) && (
                                        <Button
                                            className='w-full'
                                            onClick={() => window.open(`/accounts/${role}/performance_evaluation/${result?.employee?.account_employee?.user_id}?evaluation_period=${result?.has5_months_evaluation?.evaluation_period}`, '_blank')}
                                        >
                                            Create {`${result?.has5_months_evaluation?.evaluation_period}`} Evaluate Performance
                                        </Button>
                                    )}

                                    {/* <Button
                                        className='w-full'
                                        onClick={() => window.open(`/accounts/${role}/my_team/${result?.employee?.account_employee?.user_id}/personal_information`, '_blank')}
                                    >
                                        VIEW PROFILE
                                    </Button> */}
                                </div>
                            </TeamListSection>
                        </>}
                    />
                );
            })}
        </div>
    );
}