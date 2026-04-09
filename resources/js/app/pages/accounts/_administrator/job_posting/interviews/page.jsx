import React from "react";
import Layout from "../../../layout";
import JobPostingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import CardSection from "./_sections/card-section";
import SearchSection from "./_sections/search-section";

export default function Page() {
    return (
        <Layout>
            <JobPostingLayout>
                <div>
                    <HeaderSection />
                    <div className="mt-6">
                       
                        <CardSection />
                    </div>
                    <SearchSection />
                </div>
            </JobPostingLayout>
        </Layout>
    );
}
