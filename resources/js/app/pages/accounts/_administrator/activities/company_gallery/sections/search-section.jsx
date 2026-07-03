import React, { useState } from "react";
import Input from "@/app/_components/input";
import { TbSearch } from "react-icons/tb";
import UploadImageSection from "./upload-image-section";

export default function SearchSection() {
    const [search, setSearch] = useState("");

    return (
        <div className="bg-white p-5 border-2 rounded-2xl flex flex-col sm:flex-row gap-2 my-3">
            <div className="flex-1 w-full">
                    <Input
                        iconLeft={<TbSearch className="text-xl" />}
                        label="Search event album..."
                        name="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
            </div>

           <UploadImageSection />
        </div>
    );
}