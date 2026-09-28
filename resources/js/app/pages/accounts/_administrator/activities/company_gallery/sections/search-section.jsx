import React, { useState } from "react";
import Input from "@/app/_components/input";
import { TbSearch } from "react-icons/tb";
import UploadImageSection from "./upload-image-section";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";

export default function SearchSection({ onUploadSuccess }) {
    const [search, setSearch] = useState("");
    const { isReady, isContentManager: canUpload } = useCurrentEmployee();

    return (
        <div className="bg-white p-5 border-2 rounded-2xl flex flex-col sm:flex-row gap-2 my-3">
            <div className="flex-1 w-full">
                <Input
                    iconLeft={<TbSearch className="text-xl" />}
                    label="Search gallery..."
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {!isReady ? (
                <div className="w-full shrink-0 sm:w-40">
                    <div className="h-11 animate-pulse rounded-lg bg-gray-200" />
                </div>
            ) : (
                canUpload && (
                    <div className="w-full shrink-0 sm:w-auto">
                        <UploadImageSection onUploadSuccess={onUploadSuccess} />
                    </div>
                )
            )}
        </div>
    );
}