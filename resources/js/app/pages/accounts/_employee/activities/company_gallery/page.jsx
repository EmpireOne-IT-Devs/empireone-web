import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import HeaderSection from "@/app/pages/accounts/_administrator/activities/company_gallery/sections/header-section";
import CardUploadedImageSection from "@/app/pages/accounts/_administrator/activities/company_gallery/sections/card-uploaded-image-section";

export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <HeaderSection />
                <div
                    className="
        flex
        max-h-[500px]
        overflow-y-auto
        pr-2
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-400
        [&::-webkit-scrollbar-thumb]:rounded-full
    "
                >
                    <CardUploadedImageSection />
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
