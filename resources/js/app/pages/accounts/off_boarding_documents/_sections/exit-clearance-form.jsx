import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { add_exit_clearance_service } from '@/app/services/human-resources-service';
import Button from '@/app/_components/button';
import { setAlert } from '@/app/redux/app-slice';
import store from '@/app/store/store';
import { get_attrition_by_id_thunk } from '@/app/redux/employee-relation-thunk';

export default function ExitClearanceForm() {
    const dispatch = useDispatch();
    const { attrition } = useSelector((store) => store.human_resources);
    const { data } = useSelector((store) => store.app);
    const exit_clearance = attrition?.exit_clearance;
    const user = attrition?.user?.account_employee;
    const todayDate = moment().format('YYYY-MM-DD');

    // Parse dynamic clearance departments saved with attrition
    const dynamicClearanceDepts = Array.isArray(attrition?.clearance_departments)
        ? attrition.clearance_departments
        : [];

    // Helper to format database dates to YYYY-MM-DD for inputs
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        return moment(dateString).isValid() ? moment(dateString).format('YYYY-MM-DD') : '';
    };

    const mapArrayToBooleans = (array, keys) => {
        const list = Array.isArray(array) ? array : [];
        return keys.reduce((acc, key) => {
            acc[key] = list.includes(key);
            return acc;
        }, {});
    };

    const is_allow_to_edit = Number(attrition?.user_id) !== Number(attrition?.user?.account_employee?.user_id);

    const isAssignedITDepartment = dynamicClearanceDepts.some(
        (dept) => Number(dept?.assigned_leader_user_id) === Number(attrition?.user?.id) && attrition?.user?.account_employee?.department_id == 1
    );

    const isAssignedHRDepartment = dynamicClearanceDepts.some(
        (dept) => Number(dept?.assigned_leader_user_id) === Number(attrition?.user?.id) && attrition?.user?.account_employee?.department_id == 2
    );

    const isAssignedComplianceDepartment = dynamicClearanceDepts.some(
        (dept) => Number(dept?.assigned_leader_user_id) === Number(attrition?.user?.id) && attrition?.user?.account_employee?.department_id == 5
    );

    const canEditIT = isAssignedITDepartment;
    const canEditHR = isAssignedHRDepartment;
    const canEditCompliance = isAssignedComplianceDepartment;

    // Map initial dynamic clearance signoffs incorporating saved date_signed
    const initialDynamicSignoffs = dynamicClearanceDepts.reduce((acc, dept) => {
        const deptKey = dept?.department_id || dept?.department_name || dept?.name;
        const savedSignoff = exit_clearance?.dynamic_signoffs?.[deptKey] || {};

        // Parse date from dynamic_signoffs JSON or direct clearance_departments record
        const rawDateSigned = dept?.date_signed || savedSignoff.dateSigned || dept?.dateSigned;
        const formattedDate = formatDateForInput(rawDateSigned);

        acc[deptKey] = {
            signature: savedSignoff.signature || dept?.signature || '',
            dateSigned: formattedDate || ((savedSignoff.signature || dept?.signature || dept?.is_assigned_sign) ? todayDate : todayDate),
            payables: savedSignoff.payables || dept?.payables || '0.00',
            assigned_leader_id: dept?.assigned_leader_id || savedSignoff.assigned_leader_id || '',
            assigned_leader_name: dept?.assigned_leader_name || savedSignoff.assigned_leader_name || '',
            assigned_email: dept?.assigned_email || savedSignoff.assigned_email || '',
            assigned_leader_user_id: dept?.assigned_leader_user_id || savedSignoff.assigned_leader_user_id || null,
        };
        return acc;
    }, {});

    const { register, handleSubmit, watch, setValue, reset, control,
        formState: { errors, isSubmitting } } = useForm({
            defaultValues: {
                date: exit_clearance?.clearance_date
                    ? moment(exit_clearance.clearance_date).format('LL')
                    : (attrition?.created_at ? moment(attrition.created_at).format('LL') : ''),
                name: `${attrition?.employee?.personal_information?.first_name || ''} ${attrition?.employee?.personal_information?.last_name || ''}`.trim(),
                idNumber: attrition?.employee_id || '',
                accountDepartment: attrition?.department || '',
                positionTitle: attrition?.position || '',
                dateHired: attrition?.started_at ? moment(attrition.started_at, "MMMM D, YYYY").format("YYYY-MM-DD") : '',
                dateSeparated: attrition?.separation_date || '',
                lastWorkingDate: attrition?.last_working_date || '',
                eogsEmail: attrition?.eogs_email || '',
                isLiquidated: attrition?.is_liquidated || 'No',
                daysOfLiquidated: attrition?.days_of_liquidated || '0',
                immediateSupervisor: attrition?.immediate_supervisor || '',
                departmentManager: attrition?.department_manager || '',
                employmentStatus: attrition?.status || '',
                reasonForSeparation: attrition?.reason_for_separation || '',
                signOffs: initialDynamicSignoffs,
                assets: mapArrayToBooleans(
                    exit_clearance?.company_assets_and_retrieval,
                    ['idBadge', 'lanyard', 'hmoCard']
                ),
                keys: mapArrayToBooleans(
                    exit_clearance?.keys,
                    ['office', 'building', 'cabinets']
                ),
                devices: mapArrayToBooleans(
                    exit_clearance?.computer_or_devices,
                    ['laptop', 'desktop', 'tablet', 'camera', 'companySoftware', 'homeSoftware']
                ),
                communications: mapArrayToBooleans(
                    exit_clearance?.communications_and_equipment,
                    ['mobilePhone', 'vonage', 'headset', 'yJack']
                ),
                employeeSignature: attrition?.employee?.signature || exit_clearance?.employee_signature,
            }
        });

    const watchedValues = watch();


    useEffect(() => {
        if (attrition) {
            reset({
                date: exit_clearance?.clearance_date
                    ? moment(exit_clearance.clearance_date).format('LL')
                    : (attrition?.created_at ? moment(attrition.created_at).format('LL') : ''),
                name: `${attrition?.employee?.personal_information?.first_name || ''} ${attrition?.employee?.personal_information?.last_name || ''}`.trim(),
                idNumber: attrition?.employee_id || '',
                accountDepartment: attrition?.department || '',
                positionTitle: attrition?.position || '',
                dateHired: attrition?.started_at ? moment(attrition.started_at, "MMMM D, YYYY").format("YYYY-MM-DD") : '',
                dateSeparated: attrition?.separation_date || '',
                lastWorkingDate: attrition?.last_working_date || '',
                eogsEmail: attrition?.eogs_email || '',
                isLiquidated: attrition?.is_liquidated || 'No',
                daysOfLiquidated: attrition?.days_of_liquidated || '0',
                immediateSupervisor: attrition?.immediate_supervisor || '',
                departmentManager: attrition?.department_manager || '',
                employmentStatus: attrition?.status || '',
                reasonForSeparation: attrition?.reason_for_separation || '',
                signOffs: initialDynamicSignoffs,
                assets: mapArrayToBooleans(exit_clearance?.company_assets_and_retrieval, ['idBadge', 'lanyard', 'hmoCard']),
                keys: mapArrayToBooleans(exit_clearance?.keys, ['office', 'building', 'cabinets']),
                devices: mapArrayToBooleans(exit_clearance?.computer_or_devices, ['laptop', 'desktop', 'tablet', 'camera', 'companySoftware', 'homeSoftware']),
                communications: mapArrayToBooleans(exit_clearance?.communications_and_equipment, ['mobilePhone', 'vonage', 'headset', 'yJack']),
                employeeSignature: attrition?.employee?.signature || exit_clearance?.employee_signature,
            });
        }
    }, [attrition]);

    const handleSignRow = (id) => {
        if (window.confirm(`Are you sure you want to sign the clearance?`)) {
            if (user?.signature) {
                setValue(`signOffs.${id}.signature`, user.signature);
            }
            if (!watch(`signOffs.${id}.dateSigned`)) {
                setValue(`signOffs.${id}.dateSigned`, todayDate);
            }
            handleSubmit(onSubmit)();
        }
    };

    const onSubmit = async (formData) => {
        try {
            // Map dynamic clearance departments payload with full metadata and dates
            const enrichedDynamicSignoffs = dynamicClearanceDepts.map((dept) => {
                const deptKey = dept?.department_id || dept?.department_name || dept?.name;
                const signoffData = formData?.signOffs?.[deptKey] || {};

                const matchedDept = (data?.departments || []).find(
                    (d) => String(d.id) === String(dept?.department_id)
                );
                const matchedLeader = matchedDept?.department_leaders?.find(
                    (l) => String(l.id) === String(dept?.assigned_leader_id)
                );
                const leaderPersonalInfo = matchedLeader?.employee?.personal_information;
                const leaderName = leaderPersonalInfo
                    ? `${leaderPersonalInfo?.first_name || ''} ${leaderPersonalInfo?.last_name || ''}`.trim()
                    : dept?.assigned_leader_name || matchedLeader?.employee?.user?.name || '';

                const activeSignature = signoffData?.signature || dept?.signature || '';
                const activeDateSigned = signoffData?.dateSigned || dept?.date_signed || dept?.dateSigned || (activeSignature ? todayDate : '');

                return {
                    department_id: dept?.department_id,
                    assigned_email: dept?.assigned_email || matchedLeader?.employee?.eogs_email || '',
                    department_name: dept?.department_name || matchedDept?.name || dept?.name || '',
                    assigned_leader_id: dept?.assigned_leader_id,
                    assigned_leader_name: leaderName,
                    is_assigned_sign: Boolean(activeSignature),
                    date_signed: activeDateSigned,
                    dateSigned: activeDateSigned,
                    assigned_leader_user_id: dept?.assigned_leader_user_id || matchedLeader?.user_id || matchedLeader?.employee?.user_id || null,
                    payables: signoffData?.payables || dept?.payables || '0.00',
                    signature: activeSignature
                };
            });

            await add_exit_clearance_service({
                ...formData,
                clearance_departments: enrichedDynamicSignoffs,
                e_r_employee_attrition_id: window.location.pathname.split('/')[3],
                is_acknowledge: !is_allow_to_edit,
                assigned_id: attrition?.user?.id,
                canEditIT: canEditIT,
                canEditHR: canEditHR,
                canEditCompliance: canEditCompliance
            });

            await store.dispatch(get_attrition_by_id_thunk(window.location.pathname.split('/')[3]));
            dispatch(
                setAlert({
                    type: "success",
                    title: "Exit clearance has been saved!",
                    message: "The attrition clearance details have been updated successfully.",
                    open: true,
                })
            );
        } catch (error) {
            console.error("Failed to submit exit clearance:", error);
            dispatch(
                setAlert({
                    type: "error",
                    title: "Error",
                    message: error?.response?.data?.message || "Failed to save exit clearance.",
                    open: true,
                })
            );
        }
    };

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
                }
            `}</style>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="max-w-4xl mx-auto print:my-0 p-6 print:p-0 bg-white print:border-none border border-black print:shadow-none text-slate-900 font-sans text-[11px] leading-tight print:break-inside-avoid">

                    {/* Header Logo */}
                    <div className="flex justify-center mb-3">
                        <div className="px-4 py-1 flex items-center gap-1 relative">
                            <img src="/images/E1CXlogo.png" alt="Logo" className="h-10 object-contain" />
                        </div>
                    </div>

                    {/* Form Title & Date */}
                    <div className="flex justify-between items-center font-bold mb-2 text-xs">
                        <span>EXIT CLEARANCE</span>
                        <div className="flex items-center gap-2">
                            <span>DATE:</span>
                            {watch('date')}
                        </div>
                    </div>

                    {/* Employee Details Table */}
                    <table className="w-full border-collapse border border-black mb-3">
                        <tbody>
                            <tr>
                                <td className="border border-black p-1 w-1/2">
                                    <span className="font-bold block">Name:</span>
                                    {watch('name')}
                                </td>
                                <td className="border border-black p-1 w-1/2">
                                    <span className="font-bold block">ID Number:</span>
                                    {watch('idNumber')}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1">
                                    <span className="font-bold block">Account / Department:</span>
                                    {watch('accountDepartment')}
                                </td>
                                <td className="border border-black p-1">
                                    <span className="font-bold block">Position Title:</span>
                                    {watch('positionTitle')}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1">
                                    <span className="font-bold block">Date Hired:</span>
                                    {watch('dateHired')}
                                </td>
                                <td className="border border-black p-1">
                                    <span className="font-bold block">Date Separated:</span>
                                    {watch('dateSeparated')}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1">
                                    <span className="font-bold block">Immediate Supervisor:</span>
                                    {watch('immediateSupervisor')}
                                </td>
                                <td className="border border-black p-1">
                                    <span className="font-bold block">Department Manager:</span>
                                    {watch('departmentManager')}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1 align-top">
                                    <span className="font-bold block mb-1">Employment Status:</span>
                                    <div>{watch('employmentStatus')}</div>
                                </td>
                                <td className="border border-black p-1 align-top">
                                    <span className="font-bold block mb-1">Reason for Separation:</span>
                                    <div>{watch('reasonForSeparation')}</div>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1 align-top">
                                    <span className="font-bold block mb-1">Last Working Date:</span>
                                    <div>{watch('lastWorkingDate') || 'N/A'}</div>
                                </td>
                                <td className="border border-black p-1 align-top">
                                    <span className="font-bold block mb-1">EmpireOne Email:</span>
                                    <div>{watch('eogsEmail') || 'N/A'}</div>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1 align-top">
                                    <span className="font-bold block mb-1">Liquidated Damages:</span>
                                    <div>{watch('isLiquidated')}</div>
                                </td>
                                <td className="border border-black p-1 align-top">
                                    <span className="font-bold block mb-1">Days of Liquidated Damages:</span>
                                    <div>{watch('isLiquidated') === 'Yes' ? (watch('daysOfLiquidated') || '0') : 'N/A'}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Certification Text */}
                    <p className="my-2 text-[10.5px]">
                        We are here to certify that the above employee is cleared with any accountability or financial obligation to the following:
                    </p>

                    {/* Clearance Sign-off Table */}
                    <table className="w-full border-collapse border border-black mb-3">
                        <thead>
                            <tr className="text-center font-bold">
                                <th className="border border-black p-1 w-1/4">Department</th>
                                <th className="border border-black p-1 w-1/4">Signature</th>
                                <th className="border border-black p-1 w-1/4">Date Signed</th>
                                <th className="border border-black p-1 w-1/4">Payables</th>
                                {is_allow_to_edit && <th className="border border-black p-1 w-1/5 no-print">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {dynamicClearanceDepts.length === 0 ? (
                                <tr>
                                    <td colSpan={is_allow_to_edit ? 5 : 4} className="border border-black p-4 text-center text-gray-500 italic">
                                        No clearance departments assigned.
                                    </td>
                                </tr>
                            ) : (
                                dynamicClearanceDepts.map((dept) => {
                                    const deptKey = dept?.department_id || dept?.department_name || dept?.name;
                                    const signatureSrc = watch(`signOffs.${deptKey}.signature`) || dept?.signature;

                                    const matchedDept = (data?.departments || []).find(
                                        (d) => String(d.id) === String(dept?.department_id)
                                    );
                                    const deptName = dept?.department_name || dept?.name || matchedDept?.name || `Department #${dept?.department_id}`;

                                    const matchedLeaderObj = matchedDept?.department_leaders?.find(
                                        (l) => String(l.id) === String(dept?.assigned_leader_id)
                                    );
                                    const personalInfo = matchedLeaderObj?.employee?.personal_information;
                                    const assignedLeaderName = dept?.assigned_leader_name || (
                                        personalInfo
                                            ? `${personalInfo?.first_name || ''} ${personalInfo?.last_name || ''}`.trim()
                                            : matchedLeaderObj?.employee?.user?.name || ''
                                    );

                                    const isAssignedUser = Number(dept?.assigned_leader_user_id) === Number(attrition?.user?.id);

                                    return (
                                        <tr key={deptKey}>
                                            <td className="border border-black p-1">
                                                <span className="font-bold block">{deptName}</span>
                                                {assignedLeaderName && (
                                                    <span className="text-[10px] text-gray-600 block italic font-normal">
                                                        Assigned: {assignedLeaderName}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-black p-1 text-center h-12 relative">
                                                {signatureSrc ? (
                                                    <img
                                                        src={signatureSrc}
                                                        alt="Signature"
                                                        className="max-h-28 mx-auto object-contain absolute -mt-10 -ml-10"
                                                    />
                                                ) : null}
                                            </td>
                                            <td className="border border-black p-1 text-center">
                                                <input
                                                    type="date"
                                                    disabled={!isAssignedUser}
                                                    {...register(`signOffs.${deptKey}.dateSigned`)}
                                                    className="w-full outline-none text-xs bg-transparent text-center cursor-pointer disabled:cursor-not-allowed"
                                                />
                                            </td>
                                            <td className="border border-black p-1 text-center">
                                                <input
                                                    type="text"
                                                    disabled={!isAssignedUser}
                                                    {...register(`signOffs.${deptKey}.payables`)}
                                                    className="w-full outline-none text-xs bg-transparent text-center disabled:cursor-not-allowed"
                                                />
                                            </td>
                                            {is_allow_to_edit && (
                                                <td className="border border-black p-1 text-center no-print">
                                                    {isAssignedUser && !dept?.is_assigned_sign && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSignRow(deptKey)}
                                                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-semibold"
                                                        >
                                                            Submit & Sign
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Checklist Sections */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
                        {/* Company Assets */}

                        <div>
                            <h3 className="font-bold mb-0.5 text-[11px]">Company Assets and Retrieval</h3>
                            <div className="space-y-0.5">
                                {[
                                    { key: 'idBadge', label: 'Company ID and Badge' },
                                    { key: 'lanyard', label: 'Lanyard' },
                                    { key: 'hmoCard', label: 'HMO Card' },
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            disabled={!canEditHR}
                                            {...register(`assets.${key}`)}
                                            className="w-3 h-3 border border-black accent-slate-800 disabled:cursor-not-allowed"
                                        />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Keys */}
                        <div>
                            <h3 className="font-bold mb-0.5 text-[11px]">Key</h3>
                            <div className="space-y-0.5">
                                {[
                                    { key: 'office', label: 'Office' },
                                    { key: 'building', label: 'Building' },
                                    { key: 'cabinets', label: 'Cabinets, Pedestal, Laterals' },
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            disabled={!canEditCompliance}
                                            type="checkbox"
                                            {...register(`keys.${key}`)}
                                            className="w-3 h-3 border border-black accent-slate-800 disabled:cursor-not-allowed"
                                        />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Computer or Devices */}
                        <div>
                            <h3 className="font-bold mb-0.5 text-[11px]">Computer or Devices</h3>
                            <div className="space-y-0.5">
                                <div className="flex gap-3">
                                    {[
                                        { key: 'laptop', label: 'Laptop' },
                                        { key: 'desktop', label: 'Desktop' },
                                        { key: 'tablet', label: 'Tablet/Notebook/iPad' },
                                    ].map(({ key, label }) => (
                                        <label key={key} className="flex items-center gap-1 cursor-pointer">
                                            <input
                                                disabled={!canEditIT}
                                                type="checkbox"
                                                {...register(`devices.${key}`)}
                                                className="w-3 h-3 border border-black accent-slate-800 disabled:cursor-not-allowed"
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                                {[
                                    { key: 'camera', label: 'Camera/ Memory Stick' },
                                    { key: 'companySoftware', label: 'Company Software' },
                                    { key: 'homeSoftware', label: 'Home Used Software' },
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            disabled={!canEditIT}
                                            type="checkbox"
                                            {...register(`devices.${key}`)}
                                            className="w-3 h-3 border border-black accent-slate-800 disabled:cursor-not-allowed"
                                        />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Communications and Equipment */}
                        <div>
                            <h3 className="font-bold mb-0.5 text-[11px]">Communications and Equipment</h3>
                            <div className="space-y-0.5">
                                {[
                                    { key: 'mobilePhone', label: 'Mobile Phone' },
                                    { key: 'vonage', label: 'Vonage' },
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            disabled={!canEditIT}
                                            type="checkbox"
                                            {...register(`communications.${key}`)}
                                            className="w-3 h-3 border border-black accent-slate-800 disabled:cursor-not-allowed"
                                        />
                                        <span>{label}</span>
                                    </label>
                                ))}
                                <div className="flex gap-3">
                                    {[
                                        { key: 'headset', label: 'Headset' },
                                        { key: 'yJack', label: 'Y-Jack' },
                                    ].map(({ key, label }) => (
                                        <label key={key} className="flex items-center gap-1 cursor-pointer">
                                            <input
                                                disabled={!canEditIT}
                                                type="checkbox"
                                                {...register(`communications.${key}`)}
                                                className="w-3 h-3 border border-black accent-slate-800 disabled:cursor-not-allowed"
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Signature Section */}
                    <div className="mt-6 mb-6 flex items-end">
                        <span className="font-bold mr-2 text-[11px] whitespace-nowrap pb-1">
                            Employee Signature over Printed Name:
                        </span>
                        <div className="flex-grow border-b border-black relative flex justify-center items-end h-16">
                            {(watchedValues?.employeeSignature && exit_clearance?.employee_signature) ? (
                                <img
                                    src={watchedValues?.employeeSignature}
                                    alt="Employee Signature"
                                    className="max-h-52 object-contain absolute -bottom-28 pointer-events-none"
                                />
                            ) : null}
                            <span className="text-xs uppercase font-semibold tracking-wider pb-0.5">
                                {watchedValues?.name}
                            </span>
                        </div>
                    </div>

                    {/* Footer Disclaimer */}
                    <div className="text-[9px] italic leading-tight">
                        <p className="font-bold not-italic">Disclaimer:</p>
                        <p>
                            This document and its contents are the property of <span className="font-bold">EmpireOne BPO Solutions, Inc.</span> and are intended for internal use only.
                            Unauthorized reproduction, disclosure, or distribution of this material, in whole or in part, without prior written permission from
                            the company is strictly prohibited.
                        </p>
                    </div>

                    <div className="mt-4 flex justify-end no-print">
                        <Button
                            type="submit"
                            loading={isSubmitting}
                        >
                            {is_allow_to_edit ? "SAVE" : "I ACKNOWLEDGE"}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}