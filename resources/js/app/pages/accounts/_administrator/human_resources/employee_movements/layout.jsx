import React, { useEffect } from "react";
import TabsSection from "./_sections/tabs-section";
import store from "@/app/store/store";
// import { get_employees_thunk } from "@/app/redux/employee-relation-thunk";

export default function EmployeeMovementsLayout({ children }) {

    useEffect(() => {
        // store.dispatch(get_employees_thunk());
    }, [])
    return (
        <>
            <TabsSection />
            <div className="py-3">
                {children}
            </div>
        </>
    );
}
