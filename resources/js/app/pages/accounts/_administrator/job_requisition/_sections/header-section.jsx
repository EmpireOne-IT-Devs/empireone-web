import React from "react";
import SettingsSection from "./settings-section";

export default function HeaderSection() {
    return (
        <div className="flex ">
            <div className="flex-1 flex flex-col gap-2 my-3">
                <div className="text-2xl font-black">Job Requisition</div>
                <div className="text-gray-600">Manage all job requisitions</div>
            </div>
            <div>
              <SettingsSection />
            </div>
        </div>
    );
}
