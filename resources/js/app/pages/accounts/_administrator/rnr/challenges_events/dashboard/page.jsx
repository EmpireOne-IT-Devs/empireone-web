import React, { useState } from "react";
import HeaderSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/dashboard/sections/header-section";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "@/app/pages/accounts/_administrator/rnr/layout";
import TabsSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/sections/tabs-section";
import AllChallengesSection from "./sections/all-challenges-section";
import ArchiveSection from "./sections/archive-section";
import { LayoutGrid, Archive } from "lucide-react";

export default function Page() {
    const [showArchived, setShowArchived] = useState(false);

    const viewTabs = [
        { label: "All Challenges", icon: LayoutGrid, archived: false },
        { label: "Archive", icon: Archive, archived: true },
    ];

    return (
        <Layout>
            <RnrLayout>
                <TabsSection>
                    <div className="mt-2  bg-slate-200 p-6 rounded-lg font-sans text-slate-800">
                     <HeaderSection />
                     <div className="mt-4 flex items-center gap-2 mb-2">
                        {viewTabs.map((tab) => {
                            const Icon = tab.icon;
                            const active = showArchived === tab.archived;
                            return (
                                <button
                                    key={tab.label}
                                    type="button"
                                    onClick={() => setShowArchived(tab.archived)}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                        active
                                            ? "bg-blue-800 text-white"
                                            : "bg-white text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                     </div>
                     {showArchived ? <ArchiveSection /> : <AllChallengesSection />}
                    </div>
                </TabsSection>
            </RnrLayout>
        </Layout>
    );
}
