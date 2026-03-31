import Input from "@/app/_components/input";
import React from "react";

export default function SearchSection() {
    return (
        <div className="bg-white shadow p-4 rounded-xl flex my-3 mt-8">
            <Input label="Search..." name="search" />
        </div>
    );
}