import Tabs from "@/app/_components/tabs";
import { Sparkles, Pencil, Check, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import PersonalInfoSection from "./personal-info-section";
import ProfessionalSection from "./professional-section";
import DocumentsSection from "./document-section";
import { usePage } from "@inertiajs/react";
import Button from "@/app/_components/button";
import { useDispatch, useSelector } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";
import { edit_information_service } from "@/app/services/account-service";
import { setAlert } from "@/app/redux/app-slice";
import EmergencyContactSection from "./emergency-contact-section";
import EmployeeInformationSection from "./employee-information-section";

const TAB_IDS = [
    "personal",
    'employee',
    "professional",
    "documents",
    "emergency",
    "customization",
];

const TAB_LABELS = {
    personal: "Personal Information",
    employee: "Employee Information",
    documents: "Government Information",
    professional: "Experiences & Skills",
    emergency: "Emergency Contact",
    customization: "Customization",
};

export default function InfoTabsSection() {
    const { url } = usePage();
    const { data } = useSelector((store) => store.app);

    const urlTab = new URLSearchParams(url.split("?")[1]).get("tab");
    const activeTabId = TAB_IDS.includes(urlTab) ? urlTab : "personal";
    const activeIndex = TAB_IDS.indexOf(activeTabId);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {},
    });
    const formValues = watch();
    const dispatch = useDispatch();
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const getName = (list, code) =>
        list.find((item) => item.code === code)?.name || code;

    const {
        fields: experienceFields,
        append: appendExperience,
        remove: removeExperience,
    } = useFieldArray({ control, name: "experiences" });

    const {
        fields: skillFields,
        append: appendSkill,
        remove: removeSkill,
    } = useFieldArray({ control, name: "skills" });

    const tabs = TAB_IDS.map((id, idx) => ({
        label: TAB_LABELS[id],
        active: idx === activeIndex,
        path: `?tab=${id}`,
    }));

    useEffect(() => {
        if (data?.user?.personal_information) {
            reset({
                ...data?.user?.personal_information,
                skills: data?.user?.skills,
                experiences: data?.user?.working_experience,
            });
        }
    }, [data?.user?.personal_information, data?.user?.skills, data?.user?.working_experience, reset]);

    const onSubmit = async (data) => {
        const finalData = {
            ...data,
            region: getName(regions, data.region),
            province: getName(provinces, data.province),
            city: getName(cities, data.city),
            barangay: getName(barangays, data.barangay),
        };
        try {
            await edit_information_service(finalData);
            dispatch(
                setAlert({
                    type: "success",
                    title: "Information saved successfully!",
                    message: "Your profile has been updated.",
                    open: true,
                }),
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="mx-auto w-full">
                {/* Main Card Wrapper */}
                <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
                    
                    {/* Tabs Header - Ensure your Tabs component handles overflow-x-auto */}
                    <div className="overflow-x-auto no-scrollbar">
                         <Tabs
                            tabs={tabs}
                            activeIndex={activeIndex}
                            onTabClick={() => {}}
                        />
                    </div>

                    {/* Form Content Area */}
                    <div className="p-4 md:p-6 space-y-4">
                        {activeTabId === "personal" && (
                            <PersonalInfoSection
                                form={formValues}
                                register={register}
                                setValue={setValue}
                                watch={watch}
                                errors={errors}
                                setRegions={setRegions}
                                regions={regions}
                                provinces={provinces}
                                setProvinces={setProvinces}
                                cities={cities}
                                setCities={setCities}
                                setBarangays={setBarangays}
                                barangays={barangays}
                            />
                        )}

                        {activeTabId === "employee" && (
                            <EmployeeInformationSection
                                form={formValues}
                                register={register}
                            />
                        )}

                        {activeTabId === "professional" && (
                            <ProfessionalSection
                                watchedValues={formValues}
                                experienceFields={experienceFields}
                                removeExperience={removeExperience}
                                appendExperience={appendExperience}
                                register={register}
                                errors={errors}
                                skillFields={skillFields}
                                appendSkill={appendSkill}
                                removeSkill={removeSkill}
                                watch={watch}
                            />
                        )}

                        {activeTabId === "documents" && (
                            <DocumentsSection
                                register={register}
                                errors={errors}
                            />
                        )}
                        
                        {activeTabId === "emergency" && (
                            <EmergencyContactSection register={register} />
                        )}

                        {activeTabId === "customization" && (
                            <div className="flex flex-col items-center justify-center py-10 md:py-20">
                                <Sparkles size={22} className="text-purple-500" />
                                <p className="text-sm mt-2 text-slate-500 font-medium">
                                    Customization Settings
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer / Sticky Save Button */}
                    <div className="p-4 md:p-5 bg-white/50 border-t border-gray-100">
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            className="w-full flex justify-center py-3 text-sm font-bold tracking-wide"
                        >
                            SAVE CHANGES
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}