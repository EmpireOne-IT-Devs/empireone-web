import React from "react";
import HeaderSection from "./_section/header-section";
import TabsSection from "./_section/tabs-section";

export default function EmployeesLayout({ children }) {
    return (
        <>
            <HeaderSection />
            <TabsSection />
            {children}
        </>
    );
}
