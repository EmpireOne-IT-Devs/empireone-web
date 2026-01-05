import React from "react";
import Layout from "../../layout";
import JobPostingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import SearchSection from "./_sections/search-section";
import JobPostingCardSection from "./_sections/job-posting-card-section";
export default function Page() {
    return (
        <Layout>
            <JobPostingLayout>
                <div>
                    <div className="flex flex-col gap-2 mt-2">
                        <HeaderSection />
                        <SearchSection />
                    </div>
                    <JobPostingCardSection />
                </div>
            </JobPostingLayout>
        </Layout>
    );
}
