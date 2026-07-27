import React, { useState } from "react";

import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import CardUploadedImageSection from "./sections/card-uploaded-image-section";

export default function Page() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <Layout>
            <ActivitiesLayout>
                <HeaderSection />
                <SearchSection onUploadSuccess={() => setRefreshKey((prev) => prev + 1)} />
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
                    <CardUploadedImageSection refreshKey={refreshKey} />
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
