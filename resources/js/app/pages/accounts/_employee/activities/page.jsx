import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import Layout from "../../layout";
import HeaderSection from "./sections/header-section";
import Tabs from "@/app/_components/tabs";
import CompanyNewsfeedSection from "./sections/company-newsfeed-section";
import EventCalendarSection from "./sections/event-calendar-section";
import DepartmentShowcaseSection from "./sections/department-showcase-section";

const tabList = [
    { label: "Company Newsfeed" },
    { label: "Event Calendar" },
    { label: "Department Showcase" },
];

export default function Page() {
    const { url } = usePage();
    const [activeTab, setActiveTab] = useState(0);

    const tabs = tabList.map((tab, idx) => ({
        ...tab,
        onClick: () => setActiveTab(idx),
        active: activeTab === idx,
    }));

    let SectionComponent = null;
    if (activeTab === 0) SectionComponent = CompanyNewsfeedSection;
    else if (activeTab === 1) SectionComponent = EventCalendarSection;
    else if (activeTab === 2) SectionComponent = DepartmentShowcaseSection;

    return (
        <Layout>
            <HeaderSection />
            <Tabs tabs={tabs} />
            <div style={{ marginTop: 24 }}>
                {SectionComponent && <SectionComponent />}
            </div>
        </Layout>
    );
}
