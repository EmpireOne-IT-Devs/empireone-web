import Tabs from "@/app/_components/tabs";
import { Sparkles, Pencil, Check, X } from "lucide-react";
import React, { useState } from "react";
import PersonalInfoSection from "./personal-info-section";
import ProfessionalSection from "./professional-section";
import DocumentsSection from "./document-section";
import { usePage } from "@inertiajs/react";
import Button from "@/app/_components/button";
import EmergencyContactSection from "./emergency-contact-section";

const TAB_IDS = [
    "personal",
    "professional",
    "documents",
    "emergency",
    "customization",
];

const TAB_LABELS = {
    personal: "Personal Information",
    documents: "Government Information",
    professional: "Talent & Skill",
    emergency: "Emergency Contact",
    customization: "Customization",
};

const INITIAL_FORM = {
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    region: "",
    province: "",
    city_municipal: "",
    barangay: "",
    zip_code: "",
    house_lot_street: "",
    jobTitle: "",
    companyName: "",
    employmentType: "",
    industry: "",
    workStartDate: "",
    workEndDate: "",
    yearsExp: "",
    salary: "",
    currentlyEmployed: "",
    primarySkill: "",
    skillLevel: "",
    secondarySkills: "",
    certifications: "",
    licenseNo: "",
    licenseExpiry: "",
    schoolName: "",
    degreeLevel: "",
    course: "",
    yearGraduated: "",
    awardHonors: "",
    schoolAddress: "",
    sssNo: "",
    philhealthNo: "",
    pagibigNo: "",
    tinNo: "",
    umidNo: "",
    passportNo: "",
    passportExpiry: "",
    driversLicenseNo: "",
    resumeFile: "",
    validIdFront: "",
    validIdBack: "",
    diplomaFile: "",
    coeFile: "",
    prcFile: "",
    clearanceFile: "",
    medicalFile: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    emergencyContactEmail: "",
    emergencyContactAddress: "",
    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    fatherContactNo: "",
    motherFirstName: "",
    motherMiddleName: "",
    motherLastName: "",
    motherContactNo: "",
};

export default function InfoTabsSection({ editing, setEditing }) {
    const { url } = usePage();

    const urlTab = new URLSearchParams(url.split("?")[1]).get("tab");
    const activeTabId = TAB_IDS.includes(urlTab) ? urlTab : "personal";
    const activeIndex = TAB_IDS.indexOf(activeTabId);

    const [form, setForm] = useState(INITIAL_FORM);
    const [saved, setSaved] = useState(INITIAL_FORM);

    const tabs = TAB_IDS.map((id, idx) => ({
        label: TAB_LABELS[id],
        active: idx === activeIndex,
        path: `?tab=${id}`,
    }));

    const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

    const handleSave = () => {
        setSaved({ ...form });
        setEditing(false);
    };
    const handleCancel = () => {
        setForm({ ...saved });
        setEditing(false);
    };

    return (
        <div
            style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
            className="max-w-9xl mx-auto"
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

            <div className=" bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden">
                <Tabs
                    tabs={tabs}
                    activeIndex={activeIndex}
                    onTabClick={() => {}}
                />

                <div className="p-6 space-y-4">
                    {editing && (
                        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5">
                            <div className="flex items-center gap-2 text-xs text-indigo-700 font-medium">
                                <Pencil size={12} />
                                You're in edit mode — make your changes and hit
                                Save.
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleCancel}>
                                    <X size={12} className="mr-2" /> Cancel
                                </Button>
                                <Button onClick={handleSave}>
                                    <Check size={12} className="mr-2" /> Save
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTabId === "personal" && (
                        <PersonalInfoSection
                            form={form}
                            set={set}
                            editing={editing}
                        />
                    )}
                    {activeTabId === "professional" && (
                        <ProfessionalSection
                            form={form}
                            set={set}
                            editing={editing}
                        />
                    )}
                    {activeTabId === "documents" && (
                        <DocumentsSection
                            form={form}
                            set={set}
                            editing={editing}
                        />
                    )}
                    {activeTabId === "emergency" && (
                        <EmergencyContactSection
                            form={form}
                            set={set}
                            editing={editing}
                        />
                    )}

                    {activeTabId === "customization" && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                                <Sparkles size={22} />
                            </div>
                            <p className="text-sm font-medium text-slate-500">
                                Customization
                            </p>
                            <p className="text-xs mt-1 text-slate-400">
                                Content coming soon
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
