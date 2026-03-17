import axios from "axios";
import React, { useEffect, useState } from "react";

export default function AddressInformationSection({
    register,
    errors,
    nextStep,
    prevStep,
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
                .get(`${API_BASE}/regions/${selectedRegion}/provinces`)
                .then((res) => {
                    setProvinces(res.data);
                });
        }
    }, [selectedRegion, setValue]);

    // 3. Fetch Cities when Province changes
    useEffect(() => {
        if (selectedProvince) {
            axios
                .get(
                    `${API_BASE}/provinces/${selectedProvince}/cities-municipalities`,
                )
                .then((res) => {
                    setCities(res.data);
                });
        }
    }, [selectedProvince, setValue]);

    // 4. Fetch Barangays when City changes
    useEffect(() => {
        if (selectedCity) {
            axios
                .get(
                    `${API_BASE}/cities-municipalities/${selectedCity}/barangays`,
                )
                .then((res) => {
                    setBarangays(res.data);
                });
        }
    }, [selectedCity, setValue]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Address Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Region Select */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        Region
                    </label>
                    <select
                        value={selectedRegion}
                        {...register("region", {
                            required: "Required",
                        })}
                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${errors.region ? "border-red-400 ring-red-100" : "focus:ring-blue-400"}`}
                    >
                        <option value="">Select Region</option>
                        {regions.map((r) => (
                            <option key={r.code} value={r.code}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Province Select */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        Province
                        {/* {`${selectedProvince}`} */}
                    </label>
                    <select
                        {...register("province", {
                            required: "Required",
                        })}
                        value={selectedProvince}
                        disabled={!selectedRegion}
                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${errors.province ? "border-red-400 ring-red-100" : "focus:ring-blue-400"}`}
                    >
                        <option value="">Select Province</option>
                        {provinces.map((p) => (
                            <option key={p.code} value={p.code}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                {/* City Select */}
                <div className="flex flex-col w-full flex-1">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        City / Municipality
                    </label>
                    <select
                        {...register("city", {
                            required: "Required",
                        })}
                        value={selectedCity}
                        disabled={!selectedProvince}
                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${errors.city ? "border-red-400 ring-red-100" : "focus:ring-blue-400"}`}
                    >
                        <option value="">Select City</option>
                        {cities.map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col w-full flex-1">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        Zip Code
                    </label>
                    <input
                        type="text"
                        maxLength="4"
                        {...register("zip_code", {
                            required: "Required",
                            pattern: {
                                value: /^\d{4}$/,
                                message: "Must be 4 digits",
                            },
                        })}
                        placeholder="e.g. 6127"
                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${errors.zip_code ? "border-red-400 ring-red-100" : "focus:ring-blue-400"}`}
                        onInput={(e) => {
                            // Interactive: Prevent non-numeric characters
                            e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                "",
                            );
                        }}
                    />
                </div>

                {/* Barangay Select */}
                <div className="flex flex-col w-full flex-1">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        Barangay
                    </label>
                    <select
                        {...register("barangay", {
                            required: "Required",
                        })}
                        value={selectedBarangay}
                        disabled={!selectedCity}
                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${errors.barangay ? "border-red-400 ring-red-100" : "focus:ring-blue-400"}`}
                    >
                        <option value="">Select Barangay</option>
                        {barangays.map((b) => (
                            <option key={b.code} value={b.code}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Manual Entry for Street/House */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        House/Lot/Street/ Purok/Sitio etc.
                    </label>
                    <input
                        {...register("street")}
                        className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Blk 1 Lot 2"
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-2">
                <button
                    type="button"
                    onClick={prevStep}
                    className="w-1/2 text-gray-500 font-bold hover:bg-gray-300 bg-gray-100 py-3 rounded-lg transition"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={nextStep}
                    className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700"
                >
                    Continue To Working Experience
                </button>
            </div>
        </div>
    );
}
