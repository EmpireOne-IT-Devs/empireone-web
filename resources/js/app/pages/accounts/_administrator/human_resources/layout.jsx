import React from "react";
import HRModuleLayout from "./_section/tabs-section";

export default function EmployeeRelationLayout({ children }) {
    return (
        <>
            <HRModuleLayout>
                {children}
            </HRModuleLayout>

        </>
    );
}
