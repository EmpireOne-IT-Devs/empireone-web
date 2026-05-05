import React from "react";
import TabsSection from "./_sections/tabs-section";

export default function EmployeeMovementsLayout({ children }) {
    return (
        <>
            <TabsSection />
            <div className="py-3">
                {children}
            </div>
        </>
    );
}
