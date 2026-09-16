import React from "react";
import HRTabsSection from "./_section/tabs-section";

export default function EmployeeRelationLayout({ children }) {
    return (
        <>
            <HRTabsSection>
                {children}
            </HRTabsSection>

        </>
    );
}
