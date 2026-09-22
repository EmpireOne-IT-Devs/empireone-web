import React, { useState } from 'react';
import Modal from "@/app/_components/modal";
import {
    LuMail, LuPhone, LuLinkedin, LuX, LuLink, LuGlobe,
    LuCopy, LuCheck, LuMessageSquare, LuDownload,
    LuEye
} from 'react-icons/lu';

// Helper function to safely extract full names from relation objects
const getFullName = (relationObj) => {
    if (!relationObj || !relationObj.personal_information) return null;
    const { first_name, last_name } = relationObj.personal_information;
    return [first_name, last_name].filter(Boolean).join(' ');
};

// Interactive Info Row with tight spacing (py-1)
const InfoRow = ({ label, value, isTag = false, isCopyable = false }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 text-[13px] group border-b border-transparent hover:border-slate-100 transition-colors">
            <span className="text-slate-400 font-medium col-span-1 group-hover:text-purple-500 transition-colors flex items-center">
                {label}
            </span>
            <div className="col-span-2 text-slate-700 font-medium flex flex-wrap items-center gap-1.5">
                {value ? (
                    isCopyable ? (
                        <div
                            onClick={handleCopy}
                            className="flex items-center gap-1 cursor-pointer hover:bg-purple-50 px-1.5 py-0 -ml-1.5 rounded transition-all border border-transparent hover:border-purple-100"
                            title="Click to copy"
                        >
                            <span className="group-hover:text-purple-700">{value}</span>
                            <span className="transition-all duration-200 opacity-0 group-hover:opacity-100">
                                {copied ? <LuCheck className="w-3 h-3 text-green-500" /> : <LuCopy className="w-3 h-3 text-purple-400" />}
                            </span>
                        </div>
                    ) : isTag ? (
                        <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0 rounded-full text-[10px] font-bold tracking-wide cursor-default shadow-sm">
                            {value}
                        </span>
                    ) : (
                        <span className="px-1.5 py-0 -ml-1.5">{value}</span>
                    )
                ) : (
                    <span className="text-slate-300 italic font-normal px-1.5 py-0 -ml-1.5">Not specified</span>
                )}
            </div>
        </div>
    );
};

// Static Section Card with tight padding (p-3)
const SectionCard = ({ title, children, className = "" }) => {
    return (
        <div className={`border rounded-lg overflow-hidden bg-white border-slate-200 shadow-sm hover:border-purple-200 transition-colors ${className}`}>
            <div className="w-full px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-[13px] text-slate-700">
                    {title}
                </h3>
            </div>
            <div className="px-3 py-2 space-y-0">
                {children}
            </div>
        </div>
    );
};

// Tooltip Button Component for Header Actions
const ActionIconButton = ({ icon: Icon, label, onClick, className = "" }) => (
    <div className="relative group flex items-center justify-center">
        <button
            onClick={onClick}
            className={`p-1 rounded transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
        >
            <Icon className="w-3.5 h-3.5" />
        </button>
        <div className="absolute -top-7 px-1.5 py-0.5 bg-slate-800 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
            {label}
            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-slate-800 rotate-45"></div>
        </div>
    </div>
);

// Component receives isOpen and onClose from the parent to control the modal
export default function ShowEmployeeDetailsSection({ props_data }) {
    const [open, setOpen] = useState(false);
    const [eogsCopied, setEogsCopied] = useState(false);
    const [personalEmailCopied, setPersonalEmailCopied] = useState(false);
    const [phoneCopied, setPhoneCopied] = useState(false);
    console.log('props_data?.er_leader?.employee', props_data)
    // EXACT MAPPING WITHOUT FALLBACK STRINGS
    const data = {
        employeeId: props_data?.employee_id,
        startedAt: props_data?.started_at,
        levelOfPosition: props_data?.position_level,
        leader: getFullName(props_data?.reporting_to?.leader?.user),
        departmentManager: getFullName(props_data?.department_manager),
        account: props_data?.account?.description || props_data?.account?.name,
        department: props_data?.department?.name,
        position: props_data?.position,

        // Emails Separated
        eogsEmail: props_data?.eogs_email,
        personalEmail: props_data?.user?.email,

        employmentStatus: props_data?.status,
        basicPay: props_data?.basic_pay,
        allowance: props_data?.allowance,

        // Site Details
        siteName: props_data?.site?.name,
        siteLocation: props_data?.site?.location?.name,

        firstName: props_data?.personal_information?.first_name,
        middleName: props_data?.personal_information?.middle_name,
        lastName: props_data?.personal_information?.last_name,
        suffix: props_data?.personal_information?.suffix,
        dob: props_data?.personal_information?.date_of_birth,
        yearGraduated: props_data?.personal_information?.year_graduated,
        contact: props_data?.personal_information?.contact,
        schoolName: props_data?.personal_information?.school_name,
        course: props_data?.personal_information?.course,
        educationalAttainment: props_data?.personal_information?.educational_attainment,

        region: props_data?.personal_information?.region,
        province: props_data?.personal_information?.province,
        city: props_data?.personal_information?.city,
        barangay: props_data?.personal_information?.barangay,
        zipCode: props_data?.personal_information?.zip_code
    };

    const fullName = [data.firstName, data.middleName, data.lastName, data.suffix].filter(Boolean).join(' ');
    const fullAddress = [data.barangay, data.city, data.province, data.region, data.zipCode].filter(Boolean).join(', ');

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'eogsEmail') {
            setEogsCopied(true);
            setTimeout(() => setEogsCopied(false), 2000);
        } else if (type === 'personalEmail') {
            setPersonalEmailCopied(true);
            setTimeout(() => setPersonalEmailCopied(false), 2000);
        } else {
            setPhoneCopied(true);
            setTimeout(() => setPhoneCopied(false), 2000);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
            >
                <LuEye className="w-3.5 h-3.5" /> View Profile
            </button>
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                width="max-w-5xl h-[90vh]"
            >
                <div className="bg-slate-50 flex flex-col w-full h-full rounded-lg overflow-hidden text-left relative custom-scrollbar overflow-y-auto">

                    {/* TOP HEADER SECTION */}
                    <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center px-4 mb-1.5 gap-2">

                        {/* Profile Info Left */}
                        <div className="w-full md:w-auto">
                            <div className="flex items-center gap-2.5 mb-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
                                    {data.firstName?.charAt(0)}{data.lastName?.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                                        {fullName || "Unknown Employee"}
                                    </h1>
                                    <div className="text-[9px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0 rounded border border-purple-100 inline-block">
                                        {[data.position, data.department].filter(Boolean).join(' • ') || "No Position Details"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-1 text-[11px] font-medium ml-[42px]">
                                {data.eogsEmail && (
                                    <div
                                        onClick={() => handleCopy(data.eogsEmail, 'eogsEmail')}
                                        className="flex items-center gap-1 cursor-pointer text-slate-500 hover:text-purple-700 hover:bg-purple-50 px-1.5 py-0.5 -ml-1.5 rounded transition-all group"
                                    >
                                        {eogsCopied ? <LuCheck className="w-3 h-3 text-green-500" /> : <LuMail className="w-3 h-3 text-purple-400 group-hover:text-purple-600" />}
                                        {data.eogsEmail} (EOGS)
                                    </div>
                                )}
                                {data.personalEmail && (
                                    <div
                                        onClick={() => handleCopy(data.personalEmail, 'personalEmail')}
                                        className="flex items-center gap-1 cursor-pointer text-slate-500 hover:text-purple-700 hover:bg-purple-50 px-1.5 py-0.5 -ml-1.5 rounded transition-all group"
                                    >
                                        {personalEmailCopied ? <LuCheck className="w-3 h-3 text-green-500" /> : <LuMail className="w-3 h-3 text-purple-400 group-hover:text-purple-600" />}
                                        {data.personalEmail} (Personal)
                                    </div>
                                )}
                                {data.contact && (
                                    <div
                                        onClick={() => handleCopy(data.contact, 'phone')}
                                        className="flex items-center gap-1 cursor-pointer text-slate-500 hover:text-purple-700 hover:bg-purple-50 px-1.5 py-0.5 -ml-1.5 rounded transition-all group"
                                    >
                                        {phoneCopied ? <LuCheck className="w-3 h-3 text-green-500" /> : <LuPhone className="w-3 h-3 text-purple-400 group-hover:text-purple-600" />}
                                        {data.contact}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status & Actions Right */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
                            <div className="text-left sm:text-right bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex-shrink-0">
                                <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.8)]"></span>
                                    {data.employmentStatus || "N/A"}
                                </p>
                            </div>

                        </div>

                        {/* Profile Completion Bar Indicator */}
                        <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-slate-100">
                            <div className="h-full bg-purple-500 w-full rounded-r shadow-[0_0_4px_rgba(168,85,247,0.5)]"></div>
                        </div>
                    </div>

                    {/* MASONRY / GRID LAYOUT */}
                    <div className="p-3 md:p-4 grid grid-cols-1 lg:grid-cols-3 gap-3">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2 space-y-3">
                            <SectionCard title="Employment Information">
                                <InfoRow label="Employee ID" value={data.employeeId} isCopyable />
                                <InfoRow label="Department" value={data.department} />
                                <InfoRow label="Account" value={data.account} />
                                <InfoRow label="Position" value={data.position} />
                                <InfoRow label="Level of Position" value={data.levelOfPosition} />
                                <InfoRow label="Site" value={data.siteName} />
                                <InfoRow label="Location" value={data.siteLocation} />
                                <InfoRow label="Started At" value={data.startedAt} />
                            </SectionCard>

                            <SectionCard title="Leadership & Compensation">
                                <InfoRow label="Leader" value={data.leader} />
                                <InfoRow label="Department Manager" value={data.departmentManager} />
                                <InfoRow label="Basic Pay" value={data.basicPay ? `₱${data.basicPay}` : null} />
                                <InfoRow label="Allowance" value={data.allowance ? `₱${data.allowance}` : null} />
                            </SectionCard>

                            <SectionCard title="Address Information">
                                <div className="bg-gradient-to-r from-purple-50 to-white px-3 py-2 rounded border border-purple-100/50 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-16 h-16 bg-purple-100/50 rounded-full blur-2xl -mr-4 -mt-4"></div>
                                    <div className="flex items-center gap-2 relative z-10">
                                        <div className="p-1.5 bg-white text-purple-600 rounded shadow-sm shrink-0 border border-purple-100">
                                            <LuGlobe className="w-3.5 h-3.5" />
                                        </div>
                                        <p className="text-[11px] text-slate-600 font-medium">
                                            {fullAddress || "Address details not specified."}
                                        </p>
                                    </div>
                                </div>
                            </SectionCard>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-3">
                            <SectionCard title="Personal Details">
                                <InfoRow label="Date of Birth" value={data.dob} />
                            </SectionCard>

                            <SectionCard title="Education Background">
                                <div className="mb-2 flex flex-wrap gap-1 pt-0.5 pb-0.5">
                                    {data.educationalAttainment && <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">{data.educationalAttainment}</span>}
                                    {data.course && <span className="bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">{data.course}</span>}
                                </div>
                                <div className="border-t border-slate-100 pt-1">
                                    <InfoRow label="School" value={data.schoolName} />
                                    <InfoRow label="Graduated" value={data.yearGraduated} />
                                </div>
                            </SectionCard>
                        </div>

                    </div>
                </div>
            </Modal>
        </>
    );
}