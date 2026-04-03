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

const TAB_IDS = ["personal", "professional", "documents", "emergency", "customization"];

const TAB_LABELS = {
    personal: "Personal Information",
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

    // ✅ useForm setup
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

    const getCode = (list, name) =>
        list.find((item) => item.name === name)?.code || name;

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
    }, [data?.user?.personal_information]);

    console.log("formValuesformValues", formValues);
    // ✅ Save handler
    const onSubmit = async (data) => {
        const finalData = {
            ...data,
            region: getName(regions, data.region),
            province: getName(provinces, data.province),
            city: getName(cities, data.city),
            barangay: getName(barangays, data.barangay),
        };
        console.log("finalData", finalData);
        try {
            await edit_information_service(finalData);
            dispatch(
                setAlert({
                    type: "success",
                    title: "Information save Successfully!",
                    message: "The Information has been saved .",
                    open: true,
                }),
            );
        } catch (error) {}
    };

    // helper (replacement for set function)
    const set = (key) => (val) => setValue(key, val);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mx-auto">
                <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl overflow-hidden">
                    <Tabs
                        tabs={tabs}
                        activeIndex={activeIndex}
                        onTabClick={() => {}}
                    />
                    <div className="p-6 space-y-4">
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
                            <EmergencyContactSection
                                register={register}
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
                    <div className="p-5">
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            className="flex w-full"
                        >
                            SAVE
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
