import React, { useState } from "react";
import { useSelector } from "react-redux";
import Input from "@/app/_components/input";
import { TbSearch } from "react-icons/tb";
import UploadImageSection from "./upload-image-section";

export default function SearchSection({ onUploadSuccess }) {
    const [search, setSearch] = useState("");
    const { data } = useSelector((store) => store.app);

    const canUpload = [1, 11].includes(
        data?.user?.account_employee?.department_id,
    );

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

            {canUpload && (
                <div className="w-full shrink-0 sm:w-auto">
                    <UploadImageSection onUploadSuccess={onUploadSuccess} />
                </div>
            )}
        </div>
    );
}