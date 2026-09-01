import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function ExitInterviewForm() {
    const { attrition } = useSelector((store) => store.human_resources);
    const exit_interview = attrition?.exit_interview;

    const mapArrayToBooleans = (array, keys) => {
        const list = Array.isArray(array) ? array : [];
        return keys.reduce((acc, key) => {
            acc[key] = list.includes(key);
            return acc;
        }, {});
    };

    const {
        register,
        handleSubmit,
        control,
        watch
    } = useForm({
        defaultValues: {
            name: `${attrition?.employee?.personal_information?.first_name || ''} ${attrition?.employee?.personal_information?.last_name || ''}`.trim(),
            idNumber: attrition?.employee_id || '',
            accountDepartment: attrition?.department || '',
            positionTitle: attrition?.position || '',
            dateHired: attrition?.started_at ? moment(attrition.started_at, "MMMM D, YYYY").format("YYYY-MM-DD") : '',
            dateSeparated: attrition?.separation_date || '',
            immediateSupervisor: attrition?.immediate_supervisor || '',
            departmentManager: attrition?.department_manager || '',
            employmentStatus: exit_interview?.employment_status || attrition?.status || '',
            reasonForSeparation: exit_interview?.reason_for_separation || attrition?.reason_for_separation || '',

            // Q1 Textarea
            mainReasonForLeaving: exit_interview?.main_reason_for_leaving || '',

            // Q2 Checkboxes
            factorsLeaving: mapArrayToBooleans(exit_interview?.factors_leaving, [
                'pay',
                'supervisor',
                'workCondition',
                'locationCommute',
                'workLifeBalance',
                'didNotLikeJob',
                'benefitsProvided',
                'strictCompanyPolicy',
                'noCareerDevelopment'
            ]),

            // Q3, Q4, Q5 Textareas
            wishHadKnown: exit_interview?.wish_had_known || '',
            suggestionsForManagement: exit_interview?.suggestions_for_management || '',
            appropriateSupport: exit_interview?.appropriate_support || '',

            // Page 2 Ratings
            ratings: {
                yourJob: {
                    useAbilities: exit_interview?.ratings?.yourJob?.useAbilities || '',
                    expectationOfJobTask: exit_interview?.ratings?.yourJob?.expectationOfJobTask || '',
                    trainingReceived: exit_interview?.ratings?.yourJob?.trainingReceived || '',
                    availabilityOfResources: exit_interview?.ratings?.yourJob?.availabilityOfResources || '',
                    recognitionOfContribution: exit_interview?.ratings?.yourJob?.recognitionOfContribution || '',
                    cooperationWithinDept: exit_interview?.ratings?.yourJob?.cooperationWithinDept || '',
                    cooperationWithOtherDept: exit_interview?.ratings?.yourJob?.cooperationWithOtherDept || '',
                },
                supervisorAndCoWorker: {
                    understandingResponsibilities: exit_interview?.ratings?.supervisorAndCoWorker?.understandingResponsibilities || '',
                    relationshipWithSupervisor: exit_interview?.ratings?.supervisorAndCoWorker?.relationshipWithSupervisor || '',
                    treatedFairly: exit_interview?.ratings?.supervisorAndCoWorker?.treatedFairly || '',
                    receptiveToSuggestions: exit_interview?.ratings?.supervisorAndCoWorker?.receptiveToSuggestions || '',
                    handledComplaints: exit_interview?.ratings?.supervisorAndCoWorker?.handledComplaints || '',
                    supervisorManagementSkills: exit_interview?.ratings?.supervisorAndCoWorker?.supervisorManagementSkills || '',
                    relationshipWithCoWorkers: exit_interview?.ratings?.supervisorAndCoWorker?.relationshipWithCoWorkers || '',
                }
            },

            employeeSignature: attrition?.employee?.signature || exit_interview?.employee_signature || '',
            conductedBy: exit_interview?.conducted_by || '',
        }
    });

    const watchedValues = watch();

    const onSubmit = async (data) => {
        console.log('Form Payload:', data);
        // Call your submission service here
    };


    console.log('attrition?.employee?.personal_information?.first_name', watchedValues?.name)

    return (
        <>
            <style>{`
                @media print {
                  @page {
                    size: A4 portrait;
                    margin: 8mm;
                  }
                  body {
                    background: white !important;
                  }
                  .no-print {
                    display: none !important;
                  }
                  .page-break {
                    page-break-before: always;
                  }
                }
            `}</style>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* PAGE 1 */}
                <div className="max-w-4xl mx-auto p-6 bg-white border border-black text-slate-900 font-sans text-[11px] leading-tight print:p-0 print:border-none print:shadow-none">

                    {/* Header Logo */}
                    <div className="flex justify-center mb-3">
                        <img src="/images/E1CXlogo.png" alt="Logo" className="h-10 object-contain" />
                    </div>

                    <div className="text-center font-bold mb-3 text-xs tracking-wide">
                        EXIT INTERVIEW
                    </div>

                    {/* Employee Info Table */}
                    <table className="w-full border-collapse border border-black mb-3">
                        <tbody>
                            <tr>
                                <td className="border border-black p-1 w-1/2">
                                    <span className="font-bold block">Name:</span>
                                    {watchedValues?.name}
                                </td>
                                <td className="border border-black p-1 w-1/2">
                                    <span className="font-bold block">ID Number:</span>
                                    {watchedValues?.idNumber}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1">
                                    <span className="font-bold block">Account / Department:</span>
                                    {watchedValues?.accountDepartment}
                                </td>
                                <td className="border border-black p-1">
                                    <span className="font-bold block">Position Title:</span>
                                    {watchedValues?.positionTitle}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1">
                                    <span className="font-bold block">Date Hired:</span>
                                    {watchedValues?.dateHired}
                                </td>
                                <td className="border border-black p-1">
                                    <span className="font-bold block">Date Separated:</span>
                                    {watchedValues?.dateSeparated}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1">
                                    <span className="font-bold block">Immediate Supervisor:</span>
                                    {watchedValues?.immediateSupervisor}
                                </td>
                                <td className="border border-black p-1">
                                    <span className="font-bold block">Department Manager:</span>
                                    {watchedValues?.departmentManager}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1 align-top">
                                    <span className="font-bold block mb-1">Employment Status</span>
                                    <div className="flex gap-4 items-center">
                                        {watchedValues.employmentStatus}
                                    </div>
                                </td>
                                <td className="border border-black p-1 align-top">
                                    <span className="font-bold block mb-1">Reason for Separation</span>
                                    <div className="flex gap-3 items-center flex-wrap">
                                        {/* {['Resignation', 'Dismissal', 'End of Contract'].map((reason) => (
                                            <label key={reason} className="flex items-center gap-1 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={reason}
                                                    {...register('reasonForSeparation')}
                                                    className="w-3 h-3 border-black accent-slate-800"
                                                />
                                                <span>{reason}</span>
                                            </label>
                                        ))} */}
                                        {watchedValues?.reasonForSeparation}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Question 1 */}
                    <div className="border border-black mb-3 p-1">
                        <label className="font-bold block mb-1">
                            1. Please describe the main reason for leaving your current position.
                        </label>
                        <textarea
                            rows={3}
                            {...register('mainReasonForLeaving')}
                            className="w-full p-1 outline-none resize-none bg-transparent"
                        />
                    </div>

                    {/* Question 2 */}
                    <div className="border border-black mb-3 p-1">
                        <label className="font-bold block mb-1">
                            2. Kindly choose the following factors below that influence your decision to leave.
                        </label>
                        <div className="space-y-1 pl-2 my-1">
                            {[
                                { key: 'pay', label: 'Pay' },
                                { key: 'supervisor', label: 'Supervisor' },
                                { key: 'workCondition', label: 'Work Condition (Schedule, Setting, Travel, Flexibility)' },
                                { key: 'locationCommute', label: 'Location / Commute' },
                                { key: 'workLifeBalance', label: 'Work-Life Balance' },
                                { key: 'didNotLikeJob', label: 'Did not like my job anymore' },
                                { key: 'benefitsProvided', label: 'Benefits Provided by the Company' },
                                { key: 'strictCompanyPolicy', label: 'Too Strict Company Policy' },
                                { key: 'noCareerDevelopment', label: 'No Career Development / Enhancement' },
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register(`factorsLeaving.${key}`)}
                                        className="w-3 h-3 border border-black accent-slate-800"
                                    />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Question 3 */}
                    <div className="border border-black mb-3 p-1">
                        <label className="font-bold block mb-1">
                            3. What, if anything, do you wish you had known before you took the job?
                        </label>
                        <textarea
                            rows={3}
                            {...register('wishHadKnown')}
                            className="w-full p-1 outline-none resize-none bg-transparent"
                        />
                    </div>

                    {/* Question 4 */}
                    <div className="border border-black mb-3 p-1">
                        <label className="font-bold block mb-1">
                            4. What would you suggest to management to make our organization a better place to work?
                        </label>
                        <textarea
                            rows={3}
                            {...register('suggestionsForManagement')}
                            className="w-full p-1 outline-none resize-none bg-transparent"
                        />
                    </div>

                    {/* Question 5 */}
                    <div className="border border-black mb-3 p-1">
                        <label className="font-bold block mb-1">
                            5. Do you feel you received appropriate support to enable you to do your job?
                        </label>
                        <textarea
                            rows={3}
                            {...register('appropriateSupport')}
                            className="w-full p-1 outline-none resize-none bg-transparent"
                        />
                    </div>

                    {/* Disclaimer Page 1 */}
                    <div className="text-[9px] italic leading-tight mt-4">
                        <p className="font-bold not-italic">Disclaimer:</p>
                        <p>
                            This document and its contents are the property of <span className="font-bold">EmpireOne BPO Solutions, Inc.</span> and are intended for internal use only. Unauthorized reproduction, disclosure, or distribution of this material, in whole or in part, without prior written permission from the company is strictly prohibited.
                        </p>
                    </div>
                </div>

                {/* PAGE 2 BREAK */}
                <div className="page-break" />

                {/* PAGE 2 */}
                <div className="max-w-4xl mx-auto p-6 bg-white border border-black text-slate-900 font-sans text-[11px] leading-tight print:p-0 print:border-none print:shadow-none">

                    {/* Header Logo */}
                    <div className="flex justify-center mb-3">
                        <img src="/images/E1CXlogo.png" alt="Logo" className="h-10 object-contain" />
                    </div>

                    {/* Instructions */}
                    <div className="mb-3 space-y-1">
                        <p className="font-semibold">
                            Instructions: Please rate the following items based on your experience working in the company.
                        </p>
                        <ol className="list-decimal list-inside pl-2 space-y-0.5">
                            <li>Very Satisfied</li>
                            <li>Satisfied</li>
                            <li>Dissatisfied</li>
                        </ol>
                    </div>

                    {/* Rating Matrix Table */}
                    <table className="w-full border-collapse border border-black mb-6 text-left">
                        <thead>
                            <tr className="text-center font-bold">
                                <th className="border border-black p-1 text-left">Your Job</th>
                                <th className="border border-black p-1 w-10">1</th>
                                <th className="border border-black p-1 w-10">2</th>
                                <th className="border border-black p-1 w-10">3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { key: 'useAbilities', label: 'Opportunities to use your abilities and skills' },
                                { key: 'expectationOfJobTask', label: 'Expectation of the Job Task' },
                                { key: 'trainingReceived', label: 'Training Received' },
                                { key: 'availabilityOfResources', label: 'Availability of the resources needed for the job' },
                                { key: 'recognitionOfContribution', label: 'Recognition of your contribution' },
                                { key: 'cooperationWithinDept', label: 'Cooperation within your department' },
                                { key: 'cooperationWithOtherDept', label: 'Cooperation with other department' },
                            ].map(({ key, label }) => (
                                <tr key={key}>
                                    <td className="border border-black p-1">{label}</td>
                                    {[1, 2, 3].map((num) => (
                                        <td key={num} className="border border-black p-1 text-center">
                                            <input
                                                type="radio"
                                                value={num}
                                                {...register(`ratings.yourJob.${key}`)}
                                                className="w-3 h-3 accent-slate-800"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {/* Section 2 Header */}
                            <tr className="font-bold bg-slate-100">
                                <td colSpan={4} className="border border-black p-1 text-center">
                                    Supervisor and Co-worker
                                </td>
                            </tr>

                            {[
                                { key: 'understandingResponsibilities', label: 'My Supervisor had an understanding of my responsibilities' },
                                { key: 'relationshipWithSupervisor', label: 'Overall relationship with my supervisor' },
                                { key: 'treatedFairly', label: 'I was treated fairly by my Supervisor' },
                                { key: 'receptiveToSuggestions', label: 'My supervisor was receptive to and implemented suggestion' },
                                { key: 'handledComplaints', label: 'My supervisor handled complaints and problems' },
                                { key: 'supervisorManagementSkills', label: 'My supervisor management skills' },
                                { key: 'relationshipWithCoWorkers', label: 'My relationship with my co-workers' },
                            ].map(({ key, label }) => (
                                <tr key={key}>
                                    <td className="border border-black p-1">{label}</td>
                                    {[1, 2, 3].map((num) => (
                                        <td key={num} className="border border-black p-1 text-center">
                                            <input
                                                type="radio"
                                                value={num}
                                                {...register(`ratings.supervisorAndCoWorker.${key}`)}
                                                className="w-3 h-3 accent-slate-800"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-6 mb-6 flex items-end">
                        <span className="font-bold mr-2 text-[11px] whitespace-nowrap pb-1">
                            Employee Signature over Printed Name:
                        </span>
                        <div className="flex-grow border-b border-black relative flex justify-center items-end h-16">
                            {/* Signature Image - Overlaying above the line */}
                            {watchedValues?.employeeSignature ? (
                                <img
                                    src={watchedValues.employeeSignature}
                                    alt="Employee Signature"
                                    className="max-h-52 object-contain absolute -bottom-28 pointer-events-none"
                                />
                            ) : null}
                            {/* Employee Printed Name - Centered right on/above the line */}
                            <span className="text-xs uppercase font-semibold tracking-wider pb-0.5">
                                {watchedValues?.name}
                            </span>
                        </div>
                    </div>

                    {/* Conducted By Section */}
                    <div className="mt-6 mb-8 flex flex-col w-1/2">
                        <span className="font-bold mb-2 text-[11px]">Exit interview Conducted by:</span>
                        <input
                            type="text"
                            {...register('conductedBy')}
                            className="border-b border-black outline-none text-xs bg-transparent p-1"
                        />
                    </div>

                    {/* Disclaimer Page 2 */}
                    <div className="text-[9px] italic leading-tight mt-12">
                        <p className="font-bold not-italic">Disclaimer:</p>
                        <p>
                            This document and its contents are the property of <span className="font-bold">EmpireOne BPO Solutions, Inc.</span> and are intended for internal use only. Unauthorized reproduction, disclosure, or distribution of this material, in whole or in part, without prior written permission from the company is strictly prohibited.
                        </p>
                    </div>

                    <div className="mt-4 flex justify-end no-print">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-xs"
                        >
                            Submit Exit Interview
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}