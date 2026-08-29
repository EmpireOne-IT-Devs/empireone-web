import moment from 'moment';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function ExitClearanceForm() {
    const { attrition } = useSelector((store) => store.human_resources)
    const initialFormState = {
        date: moment(attrition.created_at).format('LL'),
        name: `${attrition?.employee?.personal_information?.first_name} ${attrition?.employee?.personal_information?.last_name} `,
        idNumber: attrition?.employee_id,
        accountDepartment: attrition?.department,
        positionTitle: attrition?.position,
        dateHired: moment(attrition.started_at, "MMMM D, YYYY").format("YYYY-MM-DD"),
        dateSeparated: attrition?.separation_date,
        immediateSupervisor: `${attrition?.employee?.er_leader?.employee?.personal_information?.first_name} ${attrition?.employee?.er_leader?.employee?.personal_information?.last_name}`,// followup
        departmentManager: `${attrition?.employee?.department?.manager?.first_name} ${attrition?.employee?.department?.manager?.last_name}`,
        employmentStatus: attrition?.status, // Single choice
        reasonForSeparation: attrition?.reason_for_separation, // Single choice
        signOffs: {
            supervisor: { signature: '', dateSigned: '', payables: '' },
            deptHead: { signature: '', dateSigned: '', payables: '' },
            it: { signature: '', dateSigned: '', payables: '' },
            hrAdmin: { signature: '', dateSigned: '', payables: '' },
        },
        assets: {
            idBadge: false,
            lanyard: false,
            hmoCard: false,
        },
        keys: {
            office: false,
            building: false,
            cabinets: false,
        },
        devices: {
            laptop: false,
            desktop: false,
            tablet: false,
            camera: false,
            companySoftware: false,
            homeSoftware: false,
        },
        communications: {
            mobilePhone: false,
            vonage: false,
            headset: false,
            yJack: false,
        },
        employeeSignature: '',
    };

    const [formData, setFormData] = useState(initialFormState);



    // Generic text field updater
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Sign-off table updater
    const handleSignOffChange = (role, field, value) => {
        setFormData((prev) => ({
            ...prev,
            signOffs: {
                ...prev.signOffs,
                [role]: { ...prev.signOffs[role], [field]: value },
            },
        }));
    };

    // Checkbox group updater
    const handleCheckboxChange = (category, item) => {
        setFormData((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [item]: !prev[category][item],
            },
        }));
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to clear all form fields?')) {
            setFormData(initialFormState);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    console.log('attrition', attrition)

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
                        {formData.date}
                    </div>
                </div>

                {/* Employee Details Table */}
                <table className="w-full border-collapse border border-black mb-3">
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 w-1/2">
                                <span className="font-bold block">Name:</span>
                                {formData.name}
                            </td>
                            <td className="border border-black p-1 w-1/2">
                                <span className="font-bold block">ID Number:</span>
                                {formData.idNumber}
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1">
                                <span className="font-bold block">Account / Department:</span>
                                {formData.accountDepartment}
                            </td>
                            <td className="border border-black p-1">
                                <span className="font-bold block">Position Title:</span>
                                {formData.positionTitle}
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1">
                                <span className="font-bold block">Date Hired:</span>
                                {formData.dateHired}
                            </td>
                            <td className="border border-black p-1">
                                <span className="font-bold block">Date Separated:</span>
                                {formData.dateSeparated}
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1">
                                <span className="font-bold block">Immediate Supervisor:</span>
                                {formData.immediateSupervisor}
                            </td>
                            <td className="border border-black p-1">
                                <span className="font-bold block">Department Manager:</span>
                                {formData.departmentManager}
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 align-top">
                                <span className="font-bold block mb-1">Employment Status</span>
                                <div className="flex gap-3 items-center flex-wrap">
                                    {formData.employmentStatus}
                                </div>
                            </td>
                            <td className="border border-black p-1 align-top">
                                <span className="font-bold block mb-1">Reason for Separation</span>
                                <div className="w-full">
                                    {formData.reasonForSeparation}
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
                            <th className="border border-black p-1 w-1/4">Department</th>
                            <th className="border border-black p-1 w-1/4">Signature</th>
                            <th className="border border-black p-1 w-1/4">Date Signed</th>
                            <th className="border border-black p-1 w-1/4">Payables</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { id: 'supervisor', title: 'Immediate Supervisor' },
                            { id: 'deptHead', title: 'Employee Dept. Head' },
                            { id: 'it', title: 'IT (Biometrics, Laptop)' },
                            { id: 'hrAdmin', title: 'HR/ Admin' },
                        ].map(({ id, title }) => (
                            <tr key={id}>
                                <td className="border border-black p-1 font-bold">{title}</td>
                                <td className="border border-black p-1">
                                    <input
                                        type="text"
                                        value={formData.signOffs[id].signature}
                                        onChange={(e) => handleSignOffChange(id, 'signature', e.target.value)}
                                        className="w-full outline-none text-xs bg-transparent"
                                    />
                                </td>
                                <td className="border border-black p-1">
                                    <input
                                        type="date"
                                        value={formData.signOffs[id].dateSigned}
                                        onChange={(e) => handleSignOffChange(id, 'dateSigned', e.target.value)}
                                        className="w-full outline-none text-xs bg-transparent"
                                    />
                                </td>
                                <td className="border border-black p-1">
                                    <input
                                        type="text"
                                        value={formData.signOffs[id].payables}
                                        onChange={(e) => handleSignOffChange(id, 'payables', e.target.value)}
                                        className="w-full outline-none text-xs bg-transparent"
                                    />
                                </td>
                            </tr>
                        ))}
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
                                        checked={formData.assets[key]}
                                        onChange={() => handleCheckboxChange('assets', key)}
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
                                        type="checkbox"
                                        checked={formData.keys[key]}
                                        onChange={() => handleCheckboxChange('keys', key)}
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
                                            type="checkbox"
                                            checked={formData.devices[key]}
                                            onChange={() => handleCheckboxChange('devices', key)}
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
                                        type="checkbox"
                                        checked={formData.devices[key]}
                                        onChange={() => handleCheckboxChange('devices', key)}
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
                                        type="checkbox"
                                        checked={formData.communications[key]}
                                        onChange={() => handleCheckboxChange('communications', key)}
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
                                            type="checkbox"
                                            checked={formData.communications[key]}
                                            onChange={() => handleCheckboxChange('communications', key)}
                                            className="w-3 h-3 border border-black accent-slate-800"
                                        />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signature Section */}
                <div className="mt-4 mb-6 flex items-center">
                    <span className="font-bold mr-2 text-[11px]">Employee Signature over Printed Name:</span>
                    <input
                        type="text"
                        value={formData.employeeSignature}
                        onChange={(e) => handleInputChange('employeeSignature', e.target.value)}
                        className="border-b border-black outline-none flex-grow text-xs bg-transparent"
                    />
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
            </div>
        </>
    );
}