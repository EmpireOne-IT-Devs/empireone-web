import Card from "@/app/_components/card";
import { Newspaper } from "lucide-react";
import React from "react";
import { FcDocument } from "react-icons/fc";

export default function TopNewsCardSection() {
    return (
        <div>
            <Card>
                <div className="flex items-center gap-2 mb-6">
                    <FcDocument className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                        Top News
                    </h2>
                </div>
            </Card>
        </div>
    );
}
