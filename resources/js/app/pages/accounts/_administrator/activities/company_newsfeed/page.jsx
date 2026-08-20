import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import NewsSectionCard from "./sections/news-section-card";
import CompanyFeaturesSection from "./sections/company-features-section";
import PoolCardSection from "../poll_analytics/sections/pool-card-section";
import { Newspaper } from "lucide-react";
export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <div className="h-full overflow-y-auto pr-1">
                    <div className="mb-5">
                        <CompanyFeaturesSection />
                    </div>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                        {/* News — 60% (3/5) */}
                        <div className="xl:col-span-3">
                            <div className="flex items-center gap-2 mb-5">
                                <Newspaper
                                    className="text-[#0f172a]"
                                    size={22}
                                />
                                <h2 className="text-lg font-bold text-[#0f172a] tracking-tight">
                                    Latest News
                                </h2>
                            </div>

                            <NewsSectionCard />
                        </div>

                        {/* Announcements — 40% (2/5) */}
                        <div className="flex flex-col gap-5 pb-5 xl:col-span-2">
                            <PoolCardSection />
                        </div>
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
