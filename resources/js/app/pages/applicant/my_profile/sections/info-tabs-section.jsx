import {
    UserCircle,
    Briefcase,
    FileText,
    Sparkles,
    Pencil,
    Check,
    X,
} from "lucide-react";
import React, { useState } from "react";
import PersonalInfoSection from "./personal-info-section";
import ProfessionalSection from "./professional-section";
import DocumentsSection from "./document-section";



const TABS = [
    { id: "personal",      label: "Personal",      icon: <UserCircle size={15} /> },
    { id: "professional",  label: "Skill",  icon: <Briefcase  size={15} /> },
    { id: "documents",     label: "Documents",     icon: <FileText   size={15} /> },
    { id: "customization", label: "Customization", icon: <Sparkles   size={15} /> },
];

const INITIAL_FORM = {
    firstName: "", middleName: "", lastName: "", suffix: "",
    dob: "", gender: "", maritalStatus: "",
    region: "", province: "", city_municipal: "", barangay: "", zip_code: "", house_lot_street: "",
    // Professional — Work
    jobTitle: "", companyName: "", employmentType: "", industry: "",
    workStartDate: "", workEndDate: "", yearsExp: "", salary: "", currentlyEmployed: "",
    // Professional — Skills
    primarySkill: "", skillLevel: "", secondarySkills: "", certifications: "",
    licenseNo: "", licenseExpiry: "",
    // Professional — Education
    schoolName: "", degreeLevel: "", course: "", yearGraduated: "", awardHonors: "", schoolAddress: "",
    // Documents — IDs
    sssNo: "", philhealthNo: "", pagibigNo: "", tinNo: "",
    umidNo: "", passportNo: "", passportExpiry: "", driversLicenseNo: "",
    // Documents — Files
    resumeFile: "", validIdFront: "", validIdBack: "", diplomaFile: "",
    coeFile: "", prcFile: "", clearanceFile: "", medicalFile: "",
};

// ── Main component ────────────────────────────────────────────────────────────
export default function InfoTabsSection({ editing, setEditing }) {
    const [activeTab, setActiveTab] = useState("personal");
    const [form,      setForm]      = useState(INITIAL_FORM);
    const [saved,     setSaved]     = useState(INITIAL_FORM);

    const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

    const handleSave   = () => { setSaved({ ...form }); setEditing(false); };
    const handleCancel = () => { setForm({ ...saved }); setEditing(false); };

    return (
        <div
            style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
            className="max-w-4xl mx-auto"
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden">

                {/* ── Tab bar ── */}
                <div className="flex border-b border-slate-100 bg-white/50 px-2 pt-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold rounded-t-xl transition-all duration-200 cursor-pointer
                                ${activeTab === tab.id
                                    ? "text-indigo-700 bg-white border border-b-0 border-slate-200 shadow-sm -mb-px"
                                    : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Content area ── */}
                <div className="p-6 space-y-4">

                    {/* Edit mode banner — visible on every tab while editing */}
                    {editing && (
                        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5">
                            <div className="flex items-center gap-2 text-xs text-indigo-700 font-medium">
                                <Pencil size={12} />
                                You're in edit mode — make your changes and hit Save.
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-all duration-150"
                                >
                                    <X size={12} /> Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-sm hover:bg-emerald-700 active:scale-95 transition-all duration-150"
                                >
                                    <Check size={12} /> Save
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Tab panels ── */}
                    {activeTab === "personal" && (
                        <PersonalInfoSection form={form} set={set} editing={editing} />
                    )}

                    {activeTab === "professional" && (
                        <ProfessionalSection form={form} set={set} editing={editing} />
                    )}

                    {activeTab === "documents" && (
                        <DocumentsSection form={form} set={set} editing={editing} />
                    )}

                    {activeTab === "customization" && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                                <Sparkles size={22} />
                            </div>
                            <p className="text-sm font-medium text-slate-500">Customization</p>
                            <p className="text-xs mt-1 text-slate-400">Content coming soon</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}