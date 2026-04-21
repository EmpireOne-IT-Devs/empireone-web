import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React, { useState, useEffect } from "react";
import {
    regions,
    provinces,
    cities,
    barangays,
} from "select-philippines-address";

const AddressInformationSection = ({
    register,
    errors,
    watchedValues,
    setValue,
}) => {
    const [data, setData] = useState({
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
        regions().then((res) => setData((prev) => ({ ...prev, regions: res })));
    }, []);

    // 2. Handle Default Values (Cascading Load)
    useEffect(() => {
        const loadDefaultData = async () => {
            setSelected({
                region: watchedValues?.region || "",
                province: watchedValues?.province || "",
                city: watchedValues?.city || "",
                barangay: watchedValues?.barangay || "",
            });

            if (watchedValues?.region) {
                // Find the region code based on the region name
                const regionObj = data.regions.find(
                    (r) => r.region_name === watchedValues.region,
                );

                if (regionObj) {
                    const provRes = await provinces(regionObj.region_code);
                    setData((prev) => ({ ...prev, provinces: provRes }));

                    if (watchedValues?.province) {
                        // Find the province code based on the province name
                        const provObj = provRes.find(
                            (p) => p.province_name === watchedValues.province,
                        );

                        if (provObj) {
                            const cityRes = await cities(provObj.province_code);
                            setData((prev) => ({ ...prev, cities: cityRes }));

                            if (watchedValues?.city) {
                                // Find the city code based on the city name
                                const cityObj = cityRes.find(
                                    (c) => c.city_name === watchedValues.city,
                                );

                                if (cityObj) {
                                    const brgyRes = await barangays(
                                        cityObj.city_code,
                                    );
                                    setData((prev) => ({
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

        // Run only if we have a region, haven't loaded yet, AND regions array is populated
        if (
            watchedValues?.region &&
            !isInitialLoaded &&
            data.regions.length > 0
        ) {
            loadDefaultData();
            setIsInitialLoaded(true);
        }
    }, [watchedValues, isInitialLoaded, data.regions]);

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

        setData((prev) => ({
            ...prev,
            provinces: [],
            cities: [],
            barangays: [],
        }));

        // Look up the code to fetch provinces
        const regionObj = data.regions.find(
            (r) => r.region_name === regionName,
        );
        if (regionObj) {
            provinces(regionObj.region_code).then((res) =>
                setData((prev) => ({ ...prev, provinces: res })),
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

        setData((prev) => ({ ...prev, cities: [], barangays: [] }));

        // Look up the code to fetch cities
        const provObj = data.provinces.find(
            (p) => p.province_name === provinceName,
        );
        if (provObj) {
            cities(provObj.province_code).then((res) =>
                setData((prev) => ({ ...prev, cities: res })),
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

        setData((prev) => ({ ...prev, barangays: [] }));

        // Look up the code to fetch barangays
        const cityObj = data.cities.find((c) => c.city_name === cityName);
        if (cityObj) {
            barangays(cityObj.city_code).then((res) =>
                setData((prev) => ({ ...prev, barangays: res })),
            );
        }
    };  

    return (
        <div className="space-y-6 animate-in fade-in duration-300 mt-3">
            <h2 className="text-2xl font-bold text-gray-800  pb-2">
                Address Information
            </h2>
            <div className="flex flex-wrap gap-4">
                <div className="flex flex-col w-full md:flex-1">
                    <Select
                        label="Region"
                        {...register("region", { required: true })}
                        options={data.regions.map((res) => ({
                            value: res.region_name, // Changed to name
                            label: res.region_name,
                        }))}
                        error={errors.region}
                        value={selected.region}
                        onChange={(value) => handleRegionChange(value)}
                    />
                </div>
                <div className="flex flex-col w-full md:flex-1">
                    <Select
                        label="Province"
                        {...register("province", { required: true })}
                        value={selected.province}
                        options={data.provinces.map((res) => ({
                            value: res.province_name, // Changed to name
                            label: res.province_name,
                        }))}
                        onChange={(value) => handleProvinceChange(value)}
                        error={errors.province}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="flex flex-col w-full md:flex-1">
                    <Select
                        label="City"
                        {...register("city", { required: true })}
                        options={data.cities.map((res) => ({
                            value: res.city_name, // Changed to name
                            label: res.city_name,
                        }))}
                        error={errors.city}
                        value={selected.city}
                        onChange={(value) => handleCityChange(value)}
                    />
                </div>
                <div className="flex flex-col w-full md:flex-1">
                    <Select
                        label="Barangay"
                        {...register("barangay", { required: true })}
                        options={data.barangays.map((res) => ({
                            value: res.brgy_name, // Changed to name
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
                <div className="flex flex-col w-full md:flex-1">
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
                        placeholder="e.g. 6127"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                    <Input
                        label="House/Lot/Street/ Purok/Sitio etc."
                        {...register("street", { required: true })}
                        error={errors.street}
                        placeholder="Blk 1 Lot 2"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddressInformationSection;
