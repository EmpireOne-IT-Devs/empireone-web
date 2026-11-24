import React, { useEffect, useState } from "react";
import PerformanceManagementLayout from "./../layout";
import store from "@/app/store/store";
import CreatePEFSection from "./_sections/create-pef-section";
export default function Page() {
    

    return (
        <PerformanceManagementLayout>
         <CreatePEFSection />
        </PerformanceManagementLayout>
    );
}
