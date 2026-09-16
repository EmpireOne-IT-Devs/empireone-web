import React, { useState } from "react";
import { TbSearch } from "react-icons/tb";
import Input from "@/app/_components/input";
import { Download } from "lucide-react";
import Button from "@/app/_components/button";

export default function SearchSection() {
    const [search, setSearch] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="my-3 flex items-center justify-between">
            <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl  ">
                <div className="w-full flex-1">
                    <form onSubmit={handleSubmit}>
                        <Input
                            iconLeft={<TbSearch className="text-xl" />}
                            label="Search employee name, EOID #..."
                            name="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </div>
            </div>
            
            <Button>
                <Download className="w-4 h-4 mr-2" />
                Export
            </Button>
        </div>
    );
}
