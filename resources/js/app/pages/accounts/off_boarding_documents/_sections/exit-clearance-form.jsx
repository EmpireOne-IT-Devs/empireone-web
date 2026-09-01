import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { add_exit_clearance_service } from '@/app/services/human-resources-service';
import Button from '@/app/_components/button';
import { setAlert } from '@/app/redux/app-slice';

export default function ExitClearanceForm() {
    const { attrition } = useSelector((store) => store.human_resources);
    const exit_clearance = attrition?.exit_clearance;
    const user = attrition?.user?.account_employee;
    const todayDate = moment().format('YYYY-MM-DD');
    const dispatch = useDispatch()
    // Helper to format database dates to YYYY-MM-DD for <input type="date" />
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
    const is_allow_to_edit = Number(attrition?.employee_id) !== Number(attrition?.user?.account_employee?.employee_id);

    console.log('is_allow_to_edit', is_allow_to_edit)

    const { register, handleSubmit, watch, setValue, control,
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
                immediateSupervisor: attrition?.immediate_supervisor || '',
                departmentManager: attrition?.department_manager || '',
                employmentStatus: attrition?.status || '',
                reasonForSeparation: attrition?.reason_for_separation || '',
                signOffs: {
                    supervisor: {
                        signature: exit_clearance?.supervisor_signature || '',
                        dateSigned: formatDateForInput(exit_clearance?.supervisor_date_signed) || (exit_clearance?.supervisor_signature ? todayDate : ''),
                        payables: exit_clearance?.supervisor_payables || '0.00'
                    },
                    deptHead: {
                        signature: exit_clearance?.dept_head_signature || '',
                        dateSigned: formatDateForInput(exit_clearance?.dept_head_date_signed) || (exit_clearance?.dept_head_signature ? todayDate : ''),
                        payables: exit_clearance?.dept_head_payables || '0.00'
                    },
                    it: {
                        signature: exit_clearance?.it_signature || '',
                        dateSigned: formatDateForInput(exit_clearance?.it_date_signed) || (exit_clearance?.it_signature ? todayDate : ''),
                        payables: exit_clearance?.it_payables || '0.00'
                    },
                    hrAdmin: {
                        signature: exit_clearance?.hr_signature || '',
                        dateSigned: formatDateForInput(exit_clearance?.hr_date_signed) || (exit_clearance?.hr_signature ? todayDate : ''),
                        payables: exit_clearance?.hr_payables || '0.00'
                    },
                },
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
                employeeSignature: attrition?.employee?.signature || exit_clearance?.employee_signature || '',
            }
        });

    const watchedSignatures = useWatch({
        control,
        name: [
            'signOffs.supervisor.signature',
            'signOffs.deptHead.signature',
            'signOffs.it.signature',
            'signOffs.hrAdmin.signature'
        ]
    });

    const watchedValues = watch();

    useEffect(() => {
        const roles = ['supervisor', 'deptHead', 'it', 'hrAdmin'];
        roles.forEach((role, index) => {
            const signature = watchedSignatures[index];
            const currentDateSigned = watch(`signOffs.${role}.dateSigned`);

            if (signature && !currentDateSigned) {
                setValue(`signOffs.${role}.dateSigned`, todayDate);
            }
        });
    }, [watchedSignatures]);

    // Handle "Submit & Sign" per row action
    const handleSignRow = (id) => {
        if (window.confirm(`Are you sure you want to sign the clearance`)) {
            if (user?.signature) {
                setValue(`signOffs.${id}.signature`, user.signature);
            }
            setValue(`signOffs.${id}.dateSigned`, todayDate);
            handleSubmit(onSubmit)();
        }

    };

    // Form submission handler
    const onSubmit = async (data) => {
        try {
            await add_exit_clearance_service({
                ...data,
                e_r_employee_attrition_id: window.location.pathname.split('/')[3]
            });
            dispatch(
                setAlert({
                    type: "success",
                    title: "Exit clearance has been saved!",
                    message: "The attrition has been created and is ready for review.",
                    open: true,
                })
            );
        } catch (error) {

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
                                    <span className="font-bold block mb-1">Employment Status</span>
                                    <div className="flex gap-3 items-center flex-wrap">
                                        {watch('employmentStatus')}
                                    </div>
                                </td>
                                <td className="border border-black p-1 align-top">
                                    <span className="font-bold block mb-1">Reason for Separation</span>
                                    <div className="w-full">
                                        {watch('reasonForSeparation')}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Certification Text */}
                    <p className="my-2 text-[10.5px]">
                        We are here to certify that the above employee is cleared with any accountability or financial obligation to the following:
                    </p>

                    {/* Sign-off Table */}
                    <table className="w-full border-collapse border border-black mb-3">
                        <thead>
                            <tr className="text-center font-bold">
                                <th className="border border-black p-1 w-1/5">Department</th>
                                <th className="border border-black p-1 w-1/5">Signature</th>
                                <th className="border border-black p-1 w-1/5">Date Signed</th>
                                <th className="border border-black p-1 w-1/5">Payables</th>
                                {
                                    is_allow_to_edit && <th className="border border-black p-1 w-1/5 no-print">Action</th>
                                }

                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'supervisor', title: 'Immediate Supervisor' },
                                { id: 'deptHead', title: 'Employee Dept. Head' },
                                { id: 'it', title: 'IT (Biometrics, Laptop)' },
                                { id: 'hrAdmin', title: 'HR/ Admin' },
                            ].map(({ id, title }) => {
                                const signatureSrc = watch(`signOffs.${id}.signature`);
                                const date = watch(`signOffs.${id}.dateSigned`)
                                return (
                                    <tr key={id}>
                                        <td className="border border-black p-1 font-bold">{title}</td>

                                        {/* Signature Image Column */}
                                        <td className="border border-black p-1 text-center h-12 ">
                                            {signatureSrc ? (
                                                <img
                                                    src={signatureSrc}
                                                    alt={`${title} Signature`}
                                                    className="max-h-28 mx-auto object-contain absolute -mt-10 -ml-10 "
                                                />
                                            ) : null}
                                        </td>

                                        {/* Date Signed Column */}
                                        <td className="border border-black p-1 text-center">
                                            {date ? moment(date).format('LL') : ""}
                                        </td>

                                        {/* Payables Column */}
                                        <td className="border border-black p-1 tex-center">
                                            <input
                                                type="text"

                                                disabled={!is_allow_to_edit}
                                                {...register(`signOffs.${id}.payables`)}
                                                className="w-full outline-none text-xs bg-transparent"
                                            />
                                        </td>

                                        {
                                            is_allow_to_edit && <td className="border border-black p-1 text-center no-print">
                                                {
                                                    !signatureSrc && <button
                                                        type="button"
                                                        onClick={() => handleSignRow(id)}
                                                        className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-semibold"
                                                    >
                                                        Submit & Sign
                                                    </button>
                                                }

                                            </td>
                                        }

                                        {/* Submit & Sign Action Column */}

                                    </tr>
                                );
                            })}
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

                                            disabled={!is_allow_to_edit}
                                            {...register(`assets.${key}`)}
                                            className="w-3 h-3 border border-black accent-slate-800"
                                        />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Key */}
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

                                            disabled={!is_allow_to_edit}
                                            type="checkbox"
                                            {...register(`keys.${key}`)}
                                            className="w-3 h-3 border border-black accent-slate-800"
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

                                                disabled={!is_allow_to_edit}
                                                type="checkbox"
                                                {...register(`devices.${key}`)}
                                                className="w-3 h-3 border border-black accent-slate-800"
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
                                            disabled={!is_allow_to_edit}
                                            type="checkbox"
                                            {...register(`devices.${key}`)}
                                            className="w-3 h-3 border border-black accent-slate-800"
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
                                            disabled={!is_allow_to_edit}
                                            type="checkbox"
                                            {...register(`communications.${key}`)}
                                            className="w-3 h-3 border border-black accent-slate-800"
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
                                                disabled={!is_allow_to_edit}
                                                type="checkbox"
                                                {...register(`communications.${key}`)}
                                                className="w-3 h-3 border border-black accent-slate-800"
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* not change the Signature Section */}
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
                    {/* Footer Disclaimer */}
                    <div className="text-[9px] italic leading-tight">
                        <p className="font-bold not-italic">Disclaimer:</p>
                        <p>
                            This document and its contents are the property of <span className="font-bold">EmpireOne BPO Solutions, Inc.</span> and are intended for internal use only.
                            Unauthorized reproduction, disclosure, or distribution of this material, in whole or in part, without prior written permission from
                            the company is strictly prohibited.
                        </p>
                    </div>

                    {
                        is_allow_to_edit && <div className="mt-4 flex justify-end no-print">
                           
                            <Button
                                type="submit"
                                loading={isSubmitting}
                            >
                                SAVE
                            </Button>
                        </div>
                    }

                </div>
            </form>
        </>
    );
}