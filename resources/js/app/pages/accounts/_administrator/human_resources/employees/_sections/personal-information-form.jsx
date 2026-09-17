import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { router } from "@inertiajs/react";
import moment from "moment";
import { Calendar, User } from "lucide-react";

import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Button from "@/app/_components/button";

import { edit_information_service, update_personal_information_service } from "@/app/services/account-service";
import { get_app_data_thunk } from "@/app/redux/app-thunk";
import { setAlert } from "@/app/redux/app-slice";

import {
    regions as fetchRegions,
    provinces as fetchProvinces,
    cities as fetchCities,
    barangays as fetchBarangays,
} from "select-philippines-address";
import { get_employees_thunk } from "@/app/redux/employee-relation-thunk";
import store from "@/app/store/store";

const DEGREE_OPTIONS = [
    { value: "N/A", label: "N/A" },
    { value: "Elementary Undergraduate", label: "Elementary Undergraduate" },
    { value: "Elementary Graduate", label: "Elementary Graduate" },
    { value: "Highschool/K-12 Undergraduate", label: "Highschool/K-12 Undergraduate" },
    { value: "Highschool/K-12 Graduate", label: "Highschool/K-12 Graduate" },
    { value: "College Level", label: "College Level" },
    { value: "College Graduate", label: "College Graduate" },
    { value: "Vocational Graduate", label: "Vocational Graduate" },
    { value: "Masteral Degree", label: "Masteral Degree" },
    { value: "Doctoral Degree", label: "Doctoral Degree" },
];

export default function PersonalInformationForm({ props_data, open, setOpen }) {
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.app);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: {} });

    const watchRegion = watch("region");
    const watchProvince = watch("province");
    const watchCity = watch("city");
    const watchDegree = watch("degree");

    const [addressData, setAddressData] = useState({
        regions: [],
        provinces: [],
        cities: [],
        barangays: [],
    });

    const [isInitialLoaded, setIsInitialLoaded] = useState(false);
    console.log('props_dataprops_data', props_data)
    // 1. Initial Reset from Redux Store
    useEffect(() => {
        if (data?.user?.personal_information) {
            const personal = props_data.personal_information;

            reset(personal);
        }
    }, [data?.user, reset]);

    // 2. Fetch Initial Regions
    useEffect(() => {
        fetchRegions().then((res) =>
            setAddressData((prev) => ({ ...prev, regions: res || [] }))
        );
    }, []);

    // 3. Hydrate Cascading Address Dropdowns on Initial Load
    useEffect(() => {
        const hydrateAddress = async () => {
            if (!watchRegion || isInitialLoaded || !addressData.regions.length) return;

            const regionObj = addressData.regions.find((r) => r.region_name === watchRegion);
            if (!regionObj) return;

            const provRes = await fetchProvinces(regionObj.region_code);
            let cityRes = [];
            let brgyRes = [];

            if (watchProvince) {
                const provObj = provRes.find((p) => p.province_name === watchProvince);
                if (provObj) {
                    cityRes = await fetchCities(provObj.province_code);

                    if (watchCity) {
                        const cityObj = cityRes.find((c) => c.city_name === watchCity);
                        if (cityObj) {
                            brgyRes = await fetchBarangays(cityObj.city_code);
                        }
                    }
                }
            }

            setAddressData((prev) => ({
                ...prev,
                provinces: provRes || [],
                cities: cityRes || [],
                barangays: brgyRes || [],
            }));

            setIsInitialLoaded(true);
        };

        hydrateAddress();
    }, [watchRegion, watchProvince, watchCity, addressData.regions, isInitialLoaded]);

    // Address Handlers
    const handleRegionChange = useCallback(
        async (regionName) => {
            setValue("region", regionName, { shouldValidate: true });
            setValue("province", "", { shouldValidate: true });
            setValue("city", "", { shouldValidate: true });
            setValue("barangay", "", { shouldValidate: true });

            setAddressData((prev) => ({
                ...prev,
                provinces: [],
                cities: [],
                barangays: [],
            }));

            const regionObj = addressData.regions.find((r) => r.region_name === regionName);
            if (regionObj) {
                const provRes = await fetchProvinces(regionObj.region_code);
                setAddressData((prev) => ({ ...prev, provinces: provRes || [] }));
            }
        },
        [addressData.regions, setValue]
    );

    const handleProvinceChange = useCallback(
        async (provinceName) => {
            setValue("province", provinceName, { shouldValidate: true });
            setValue("city", "", { shouldValidate: true });
            setValue("barangay", "", { shouldValidate: true });

            setAddressData((prev) => ({ ...prev, cities: [], barangays: [] }));

            const provObj = addressData.provinces.find((p) => p.province_name === provinceName);
            if (provObj) {
                const cityRes = await fetchCities(provObj.province_code);
                setAddressData((prev) => ({ ...prev, cities: cityRes || [] }));
            }
        },
        [addressData.provinces, setValue]
    );

    const handleCityChange = useCallback(
        async (cityName) => {
            setValue("city", cityName, { shouldValidate: true });
            setValue("barangay", "", { shouldValidate: true });

            setAddressData((prev) => ({ ...prev, barangays: [] }));

            const cityObj = addressData.cities.find((c) => c.city_name === cityName);
            if (cityObj) {
                const brgyRes = await fetchBarangays(cityObj.city_code);
                setAddressData((prev) => ({ ...prev, barangays: brgyRes || [] }));
            }
        },
        [addressData.cities, setValue]
    );

    // Memoized Options
    const regionOptions = useMemo(
        () => addressData.regions.map((r) => ({ value: r.region_name, label: r.region_name })),
        [addressData.regions]
    );

    const provinceOptions = useMemo(
        () => addressData.provinces.map((p) => ({ value: p.province_name, label: p.province_name })),
        [addressData.provinces]
    );

    const cityOptions = useMemo(
        () => addressData.cities.map((c) => ({ value: c.city_name, label: c.city_name })),
        [addressData.cities]
    );

    const barangayOptions = useMemo(
        () => addressData.barangays.map((b) => ({ value: b.brgy_name, label: b.brgy_name })),
        [addressData.barangays]
    );

    const onSubmit = async (formData) => {
        const finalData = {
            ...formData,
            started_at: formData.started_at ? moment(formData.started_at).format("LL") : "",
        };

        try {
            await update_personal_information_service(finalData);
            await store.dispatch(get_employees_thunk());

            dispatch(
                setAlert({
                    type: "success",
                    title: "Information saved successfully!",
                    message: "Your profile has been updated.",
                    open: true,
                })
            );
            setOpen(false)
        } catch (error) {
            console.error("Failed to save profile:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4">
                <Input
                    label={<RequiredLabel text="First Name" />}
                    name="first_name"
                    {...register("first_name", { required: "First Name is required" })}
                    error={errors.first_name}
                    iconLeft={<User size={14} />}
                />

                <Input
                    label={<RequiredLabel text="Middle Name" />}
                    name="middle_name"
                    {...register("middle_name", { required: "Middle Name is required" })}
                    error={errors.middle_name}
                    iconLeft={<User size={14} />}
                />

                <Input
                    label={<RequiredLabel text="Last Name" />}
                    name="last_name"
                    {...register("last_name", { required: "Last Name is required" })}
                    error={errors.last_name}
                    iconLeft={<User size={14} />}
                />

                <Input
                    label="Suffix"
                    name="suffix"
                    {...register("suffix")}
                    iconLeft={<User size={14} />}
                />

                <Input
                    label={<RequiredLabel text="Date of Birth" />}
                    name="date_of_birth"
                    type="date"
                    {...register("date_of_birth", { required: "Date of Birth is required" })}
                    error={errors.date_of_birth}
                    iconLeft={<Calendar size={14} />}
                />

                <Input
                    label={<RequiredLabel text="Year Graduated" />}
                    name="year_graduated"
                    {...register("year_graduated", { required: "Year Graduated is required" })}
                    error={errors.year_graduated}
                />

                <Input
                    label="Contact #"
                    name="contact"
                    {...register("contact")}
                    iconLeft={<User size={14} />}
                />

                <Input
                    label={<RequiredLabel text="School Name" />}
                    name="school_name"
                    {...register("school_name", { required: "School Name is required" })}
                    error={errors.school_name}
                />

                <Input
                    label={<RequiredLabel text="Course" />}
                    name="course"
                    {...register("course", { required: "Course is required" })}
                    error={errors.course}
                />

                <Controller
                    name="degree"
                    control={control}
                    rules={{ required: "Educational Attainment is required" }}
                    render={({ field }) => (
                        <Select
                            label={<RequiredLabel text="Educational Attainment" />}
                            options={DEGREE_OPTIONS}
                            value={field.value || watchDegree}
                            onChange={field.onChange}
                            error={errors.degree}
                        />
                    )}
                />

                <div className="mt-3 space-y-4">
                    <h2 className="border-b pb-2 text-2xl font-bold text-gray-800">
                        Address Information
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex w-full">
                            <Controller
                                name="region"
                                control={control}
                                rules={{ required: "Region is required" }}
                                render={({ field }) => (
                                    <Select
                                        label="Region"
                                        options={regionOptions}
                                        value={field.value || watchRegion}
                                        onChange={(val) => handleRegionChange(val)}
                                        error={errors.region}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex w-full">
                            <Controller
                                name="province"
                                control={control}
                                rules={{ required: "Province is required" }}
                                render={({ field }) => (
                                    <Select
                                        label="Province"
                                        options={provinceOptions}
                                        value={field.value || watchProvince}
                                        onChange={(val) => handleProvinceChange(val)}
                                        error={errors.province}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex w-full">
                            <Controller
                                name="city"
                                control={control}
                                rules={{ required: "City is required" }}
                                render={({ field }) => (
                                    <Select
                                        label="City"
                                        options={cityOptions}
                                        value={field.value || watchCity}
                                        onChange={(val) => handleCityChange(val)}
                                        error={errors.city}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex w-full">
                            <Controller
                                name="barangay"
                                control={control}
                                rules={{ required: "Barangay is required" }}
                                render={({ field }) => (
                                    <Select
                                        label="Barangay"
                                        options={barangayOptions}
                                        value={field.value}
                                        onChange={(val) => field.onChange(val)}
                                        error={errors.barangay}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex w-full">
                            <Input
                                label="Zip Code"
                                type="text"
                                maxLength={4}
                                {...register("zip_code", {
                                    required: "Zip Code is required",
                                    pattern: {
                                        value: /^\d{4}$/,
                                        message: "Must be 4 digits",
                                    },
                                })}
                                error={errors.zip_code}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <Input
                            label="House/Lot/Street/Purok/Sitio etc."
                            {...register("street", { required: "Street/Purok address is required" })}
                            error={errors.street}
                        />
                    </div>
                </div>

                <Button type="submit" variant="secondary" loading={isSubmitting}>
                    SAVE CHANGES
                </Button>
            </div>
        </form>
    );
}

// Reusable Helper Component for Form Labels
function RequiredLabel({ text }) {
    return (
        <div className="flex items-center gap-1">
            <span>{text}</span>
            <span className="font-black text-red-500">*</span>
        </div>
    );
}