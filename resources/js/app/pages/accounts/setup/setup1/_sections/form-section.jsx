import Input from '@/app/_components/input';
import Select from '@/app/_components/select';
import Button from '@/app/_components/button';
import { Briefcase, Hash, Building2, Mail, UserCircle, User, Calendar } from "lucide-react";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { router } from '@inertiajs/react';
import { edit_information_service } from '@/app/services/account-service';
import store from '@/app/store/store';
import { get_app_data_thunk } from '@/app/redux/app-thunk';
import { setAlert } from '@/app/redux/app-slice';

import {
    regions as fetchRegions,
    provinces as fetchProvinces,
    cities as fetchCities,
    barangays as fetchBarangays
} from "select-philippines-address";

const getName = (list, code) =>
    list.find((item) => item.code === code)?.name || code;

export default function FormSection() {
    const { data } = useSelector((store) => store.app);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: {} });

    const dispatch = useDispatch();

    // Replaced 'watchedValues' with 'form' since watch() is assigned to it
    const form = watch();

    useEffect(() => {
        if (data?.user?.personal_information) {
            reset({
                ...data?.user?.personal_information,
                e_r_leader_id: data?.user?.account_employee?.e_r_leader_id,
                started_at: data?.user?.account_employee?.started_at
                    ? moment(data.user.account_employee.started_at).format('YYYY-MM-DD')
                    : '',
                position_level: data?.user?.account_employee?.position_level,
                basic_pay: data?.user?.account_employee?.basic_pay,
                allowance: data?.user?.account_employee?.allowance,
                employee_id: data?.user?.account_employee?.employee_id,
                department_id: data?.user?.account_employee?.department_id,
                account_id: data?.user?.account_employee?.account_id,
                site_id: data?.user?.account_employee?.site_id,
                position: data?.user?.account_employee?.position,
                eogs_email: data?.user?.account_employee?.eogs_email,
                status: data?.user?.account_employee?.status,
                skills: data?.user?.skills,
                experiences: data?.user?.working_experience,
            });
        }
    }, [
        data?.user?.personal_information,
        data?.user?.skills,
        data?.user?.working_experience,
        reset,
    ]);

    const onSubmit = async (formData) => {
        const finalData = {
            ...formData,
            started_at: moment(formData.started_at).format('LL'),
            // Since your Select components set the value to 'region_name' etc., 
            // formData.region is already the name. You can just pass it directly.
            region: formData.region,
            province: formData.province,
            city: formData.city,
            barangay: formData.barangay,
        };
        try {
            await edit_information_service(finalData);
            await store.dispatch(get_app_data_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Information saved successfully!",
                    message: "Your profile has been updated.",
                    open: true,
                }),
            );
            router.visit('/dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    const [addressData, setAddressData] = useState({
        regions: [],
        provinces: [],
        cities: [],
        barangays: [],
    });

    const [selected, setSelected] = useState({
        region: "",
        province: "",
        city: "",
        barangay: "",
    });

    const [isInitialLoaded, setIsInitialLoaded] = useState(false);

    // 1. Initial Load: Get Regions
    useEffect(() => {
        fetchRegions().then((res) => setAddressData((prev) => ({ ...prev, regions: res })));
    }, []);

    // 2. Handle Default Values (Cascading Load)
    useEffect(() => {
        const loadDefaultData = async () => {
            setSelected({
                region: form?.region || "",
                province: form?.province || "",
                city: form?.city || "",
                barangay: form?.barangay || "",
            });

            if (form?.region) {
                const regionObj = addressData.regions.find(
                    (r) => r.region_name === form.region,
                );

                if (regionObj) {
                    const provRes = await fetchProvinces(regionObj.region_code);
                    setAddressData((prev) => ({ ...prev, provinces: provRes }));

                    if (form?.province) {
                        const provObj = provRes.find(
                            (p) => p.province_name === form.province,
                        );

                        if (provObj) {
                            const cityRes = await fetchCities(provObj.province_code);
                            setAddressData((prev) => ({ ...prev, cities: cityRes }));

                            if (form?.city) {
                                const cityObj = cityRes.find(
                                    (c) => c.city_name === form.city,
                                );

                                if (cityObj) {
                                    const brgyRes = await fetchBarangays(
                                        cityObj.city_code,
                                    );
                                    setAddressData((prev) => ({
                                        ...prev,
                                        barangays: brgyRes,
                                    }));
                                }
                            }
                        }
                    }
                }
            }
        };

        if (
            form?.region &&
            !isInitialLoaded &&
            addressData.regions.length > 0
        ) {
            loadDefaultData();
            setIsInitialLoaded(true);
        }
    }, [form, isInitialLoaded, addressData.regions]);

    // 3. Handle Region Change
    const handleRegionChange = (regionName) => {
        setSelected({
            region: regionName,
            province: "",
            city: "",
            barangay: "",
        });

        if (setValue) {
            setValue("region", regionName, { shouldValidate: true });
            setValue("province", "", { shouldValidate: true });
            setValue("city", "", { shouldValidate: true });
            setValue("barangay", "", { shouldValidate: true });
        }

        setAddressData((prev) => ({
            ...prev,
            provinces: [],
            cities: [],
            barangays: [],
        }));

        const regionObj = addressData.regions.find(
            (r) => r.region_name === regionName,
        );
        if (regionObj) {
            fetchProvinces(regionObj.region_code).then((res) =>
                setAddressData((prev) => ({ ...prev, provinces: res })),
            );
        }
    };

    // 4. Handle Province Change
    const handleProvinceChange = (provinceName) => {
        setSelected((prev) => ({
            ...prev,
            province: provinceName,
            city: "",
            barangay: "",
        }));

        if (setValue) {
            setValue("province", provinceName, { shouldValidate: true });
            setValue("city", "", { shouldValidate: true });
            setValue("barangay", "", { shouldValidate: true });
        }

        setAddressData((prev) => ({ ...prev, cities: [], barangays: [] }));

        const provObj = addressData.provinces.find(
            (p) => p.province_name === provinceName,
        );
        if (provObj) {
            fetchCities(provObj.province_code).then((res) =>
                setAddressData((prev) => ({ ...prev, cities: res })),
            );
        }
    };

    // 5. Handle City Change
    const handleCityChange = (cityName) => {
        setSelected((prev) => ({ ...prev, city: cityName, barangay: "" }));

        if (setValue) {
            setValue("city", cityName, { shouldValidate: true });
            setValue("barangay", "", { shouldValidate: true });
        }

        setAddressData((prev) => ({ ...prev, barangays: [] }));

        const cityObj = addressData.cities.find((c) => c.city_name === cityName);
        if (cityObj) {
            fetchBarangays(cityObj.city_code).then((res) =>
                setAddressData((prev) => ({ ...prev, barangays: res })),
            );
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-6 gap-y-4">
                <Input
                    label={
                        <div className="flex">
                            First Name
                            <div className="text-red-500 font-black">*</div>
                        </div>
                    }
                    name="first_name"
                    {...register("first_name")}
                    iconLeft={<User size={14} />}
                />
                <Input
                    label={
                        <div className="flex">
                            Middle Name
                            <div className="text-red-500 font-black">*</div>
                        </div>
                    }
                    name="middle_name"
                    {...register("middle_name")}
                    iconLeft={<User size={14} />}
                />
                <Input
                    label={
                        <div className="flex">
                            Last Name
                            <div className="text-red-500 font-black">*</div>
                        </div>
                    }
                    name="last_name"
                    {...register("last_name")}
                    iconLeft={<User size={14} />}
                />
                <Input
                    label="Suffix"
                    name="suffix"
                    {...register("suffix")}
                    iconLeft={<User size={14} />}
                />
                <Input
                    label={
                        <div className="flex">
                            Date of Birth
                            <div className="text-red-500 font-black">*</div>
                        </div>
                    }
                    name="date_of_birth"
                    type="date"
                    {...register("date_of_birth")}
                    iconLeft={<Calendar size={14} />}
                />
                <Input
                    label={
                        <div className="flex">
                            Year Graduated
                            <div className="text-red-500 font-black">*</div>
                        </div>
                    }
                    name="year_graduated"
                    {...register("year_graduated", {
                        required: "Required",
                    })}
                    error={errors.year_graduated}
                />
                <Input
                    label="Contact #"
                    name="contact"
                    {...register("contact")}
                    iconLeft={<User size={14} />}
                />
                <Input
                    label={
                        <div className="flex">
                            School Name
                            <div className="text-red-500 font-black">*</div>
                        </div>
                    }
                    name="school_name"
                    {...register("school_name", {
                        required: "Required",
                    })}
                    error={errors.school_name}
                />
                <Input
                    label={
                        <div className="flex">
                            Course
                            <div className="text-red-500 font-black">*</div>
                        </div>
                    }
                    name="course"
                    {...register("course", {
                        required: "Required",
                    })}
                    error={errors.course}
                />

                <Select
                    label={
                        <div className="flex">
                            Educational Attainment
                            <div className="text-red-500 font-black">*</div>
                        </div>
                    }
                    name="degree"
                    {...register("degree", {
                        required: true,
                    })}
                    options={[
                        { value: "N/A", label: "N/A" },
                        { value: "Elementary", label: "Elementary" },
                        {
                            value: "High School Junior",
                            label: "High School Junior",
                        },
                        {
                            value: "High School Senior",
                            label: "High School Senior",
                        },
                        { value: "College", label: "College" },
                        { value: "Undergraduate", label: "Undergraduate" },
                        { value: "Degree Holder", label: "Degree Holder" },
                        { value: "Masteral", label: "Masteral" },
                        { value: "Doctoral", label: "Doctoral" },
                        { value: "Vocational", label: "Vocational" },
                    ]}
                    error={errors.degree}
                    value={form?.degree}
                    required
                />

                <div className="space-y-4 animate-in fade-in duration-300 mt-3">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                        Address Information
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex w-full">
                            <Select
                                label="Region"
                                {...register("region", { required: true })}
                                options={addressData.regions.map((res) => ({
                                    value: res.region_name,
                                    label: res.region_name,
                                }))}
                                error={errors.region}
                                value={selected.region}
                                onChange={(value) => handleRegionChange(value)}
                            />
                        </div>
                        <div className="flex w-full">
                            <Select
                                label="Province"
                                {...register("province", { required: true })}
                                value={selected.province}
                                options={addressData.provinces.map((res) => ({
                                    value: res.province_name,
                                    label: res.province_name,
                                }))}
                                onChange={(value) => handleProvinceChange(value)}
                                error={errors.province}
                            />
                        </div>
                        <div className="flex w-full">
                            <Select
                                label="City"
                                {...register("city", { required: true })}
                                options={addressData.cities.map((res) => ({
                                    value: res.city_name,
                                    label: res.city_name,
                                }))}
                                error={errors.city}
                                value={selected.city}
                                onChange={(value) => handleCityChange(value)}
                            />
                        </div>
                        <div className="flex w-full">
                            <Select
                                label="Barangay"
                                {...register("barangay", { required: true })}
                                options={addressData.barangays.map((res) => ({
                                    value: res.brgy_name,
                                    label: res.brgy_name,
                                }))}
                                error={errors.barangay}
                                value={selected.barangay}
                                onChange={(value) => {
                                    setSelected({ ...selected, barangay: value });
                                    if (setValue)
                                        setValue("barangay", value, {
                                            shouldValidate: true,
                                        });
                                }}
                            />
                        </div>
                        <div className="flex w-full">
                            <Input
                                label="Zip Code"
                                type="text"
                                maxLength={4}
                                {...register("zip_code", {
                                    required: true,
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
                        <div className="flex flex-col">
                            <Input
                                label="House/Lot/Street/ Purok/Sitio etc."
                                {...register("street", { required: true })}
                                error={errors.street}
                            />
                        </div>
                    </div>
                </div>
                <Button
                    type="submit"
                    variant="secondary"
                    loading={isSubmitting}
                >
                    SAVE CHANGES
                </Button>
            </div>
        </form>
    );
}