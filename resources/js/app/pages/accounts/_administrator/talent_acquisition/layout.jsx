
import React, { useState } from "react";
import TATabsSection from "./_sections/tabs-section";
import HeaderSection from "./_sections/header-section";

export default function JobPostingLayout({ children }) {
    const path = typeof window !== "undefined" ? window.location.pathname.split("/")[4] : "";


    return (

        <>
            <div className="flex flex-col md:flex-row h-[87vh] bg-gray-50 overflow-hidden w-full">
                <TATabsSection />
                <div className="p-3 overflow-auto w-full">
                    <div className="mb-2">
                        <HeaderSection />
                    </div>

                    {children}
                </div>
            </div>
        </>
    );
}