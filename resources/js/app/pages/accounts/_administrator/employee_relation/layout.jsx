import React from "react";
import HeaderSection from "./_section/header-section";
import TabsSection from "./_section/tabs-section";

export default function EmployeeRelationLayout({ children }) {
    return (
        <>
            <HeaderSection />
            <TabsSection />
            {children}
        </>
    );
}
