import axios from "axios";
import React, { useEffect, useState } from "react";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Button from "@/app/_components/button";
import { useSelector } from "react-redux";

export default function AddressInformationSection({
    register,
    errors,
    setValue,
    watch,
    barangays,
    cities,
    provinces,
    regions,
    setRegions,
    setProvinces,
    setCities,
    setBarangays,
}) {
    // Watch the values of the dropdowns to trigger dependent fetches

    const { data } = useSelector((store) => store.app);
    const getCode = (list, name) =>
        list.find((item) => item.name === name)?.code || name;
    const selectedRegion = watch("region");
    const selectedProvince = watch("province");
    const selectedCity = watch("city");
    const selectedBarangay = watch("barangay");

    const API_BASE = "https://psgc.gitlab.io/api";

    // 1. Fetch Regions on Mount
    useEffect(() => {
        axios.get(`${API_BASE}/regions`).then((res) => setRegions(res.data));
    }, []);
    // console.log('provinces',provinces)
    // 2. Fetch Provinces when Region changes
    useEffect(() => {
        if (selectedRegion) {
            axios
                .get(
                    `${API_BASE}/regions/${getCode(
                        regions,
                        selectedRegion,
                    )}/provinces`,
                )
                .then((res) => {
                    setProvinces(res.data);
                });
        }
    }, [getCode(regions, selectedRegion), setValue]);

    // 3. Fetch Cities when Province changes
    useEffect(() => {
        if (selectedProvince) {
            axios
                .get(
                    `${API_BASE}/provinces/${getCode(
                        provinces,
                        selectedProvince,
                    )}/cities-municipalities`,
                )
                .then((res) => {
                    setCities(res.data);
                });
        }
    }, [getCode(provinces, selectedProvince), setValue]);

    // 4. Fetch Barangays when City changes
    useEffect(() => {
        if (selectedCity) {
            axios
                .get(
                    `${API_BASE}/cities-municipalities/${getCode(
                        cities,
                        selectedCity,
                    )}/barangays`,
                )
                .then((res) => {
                    setBarangays(res.data);
                });
        }
    }, [getCode(cities, selectedCity), setValue]);
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Region Select */}
                <div className="flex flex-col">
                    <Select
                        label="Region"
                        name="region"
                        options={regions.map((r) => ({
                            value: r.code,
                            label: r.name,
                        }))}
                        error={errors.region}
                        value={getCode(regions, selectedRegion)}
                        onChange={(val) => setValue("region", val)}
                    />
                </div>

                {/* Province Select */}
                <div className="flex flex-col">
                    <Select
                        label="Province"
                        name="province"
                        options={provinces.map((p) => ({
                            value: p.code,
                            label: p.name,
                        }))}
                        error={errors.province}
                        value={getCode(provinces, selectedProvince)}
                        onChange={(val) => setValue("province", val)}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                {/* City Select */}
                <div className="flex flex-col w-full flex-1">
                    <Select
                        label="City / Municipality"
                        name="city"
                        options={cities.map((c) => ({
                            value: c.code,
                            label: c.name,
                        }))}
                        error={errors.city}
                        value={getCode(cities, selectedCity)}
                        onChange={(val) => setValue("city", val)}
                        required
                        disabled={!selectedProvince}
                    />
                </div>
                {/* Barangay Select */}
                <div className="flex flex-col w-full flex-1">
                    <Select
                        label="Barangay"
                        name="barangay"
                        options={barangays.map((b) => ({
                            value: b.code,
                            label: b.name,
                        }))}
                        error={errors.barangay}
                        value={getCode(barangays, selectedBarangay)}
                        onChange={(val) => setValue("barangay", val)}
                        required
                        disabled={!selectedCity}
                    />
                </div>
                <div className="flex flex-col w-full flex-1">
                    <Input
                        label="Zip Code"
                        name="zip_code"
                        type="text"
                        maxLength={4}
                        {...register("zip_code", {
                            required: "Required",
                            pattern: {
                                value: /^\d{4}$/,
                                message: "Must be 4 digits",
                            },
                        })}
                        error={errors.zip_code}
                        placeholder="e.g. 6127"
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                "",
                            );
                        }}
                    />
                </div>
            </div>

            {/* Manual Entry for Street/House */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="flex flex-col">
                    <Input
                        label="House/Lot/Street/ Purok/Sitio etc."
                        name="street"
                        {...register("street")}
                        placeholder="Blk 1 Lot 2"
                    />
                </div>
            </div>
        </div>
    );
}
