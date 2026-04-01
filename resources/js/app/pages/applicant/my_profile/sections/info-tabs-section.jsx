import Tabs from "@/app/_components/tabs";
import { Sparkles, Pencil, Check, X } from "lucide-react";
import React from "react";
import PersonalInfoSection from "./personal-info-section";
import ProfessionalSection from "./professional-section";
import DocumentsSection from "./document-section";
import { usePage } from "@inertiajs/react";
import Button from "@/app/_components/button";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

const TAB_IDS = ["personal", "professional", "documents", "customization"];

const TAB_LABELS = {
    personal: "Personal Information",
    documents: "Government Information",
    professional: "Talent & Skill",
    customization: "Customization",
};

const INITIAL_FORM = {
    first_name: "",
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
};

export default function InfoTabsSection({ editing, setEditing }) {
    const { url } = usePage();
    const { data } = useSelector((store) => store.app);

    const urlTab = new URLSearchParams(url.split("?")[1]).get("tab");
    const activeTabId = TAB_IDS.includes(urlTab) ? urlTab : "personal";
    const activeIndex = TAB_IDS.indexOf(activeTabId);

    // ✅ useForm setup
    const { register, handleSubmit, reset, watch, setValue } = useForm({
        defaultValues: {},
    });

    console.log('datadata',data)

    const formValues = watch(); // replaces form state
    const [saved, setSaved] = React.useState(INITIAL_FORM);

    const tabs = TAB_IDS.map((id, idx) => ({
        label: TAB_LABELS[id],
        active: idx === activeIndex,
        path: `?tab=${id}`,
    }));

    // ✅ Save handler
    const onSubmit = (data) => {
        setSaved(data);
        setEditing(false);
    };

    // ✅ Cancel handler
    const handleCancel = () => {
        reset(saved); // restore saved values
        setEditing(false);
    };

    // helper (replacement for set function)
    const set = (key) => (val) => setValue(key, val);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl overflow-hidden">
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
                                    You're in edit mode — make changes and save.
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        onClick={handleCancel}
                                    >
                                        <X size={12} className="mr-2" /> Cancel
                                    </Button>
                                    <Button type="submit">
                                        <Check size={12} className="mr-2" />{" "}
                                        Save
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTabId === "personal" && (
                            <PersonalInfoSection
                                form={formValues}
                                set={set}
                                register={register}
                                editing={editing}
                            />
                        )}

                        {activeTabId === "professional" && (
                            <ProfessionalSection
                                form={formValues}
                                set={set}
                                register={register}
                                editing={editing}
                            />
                        )}

                        {activeTabId === "documents" && (
                            <DocumentsSection
                                form={formValues}
                                set={set}
                                register={register}
                                editing={editing}
                            />
                        )}

                        {activeTabId === "customization" && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Sparkles size={22} />
                                <p className="text-sm mt-2 text-slate-500">
                                    Customization
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
