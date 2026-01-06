import React from "react";
import Layout from "../../layout";
import JobPostingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import CardSection from "./_sections/card-section";
import SearchSection from "./_sections/search-section";
import ApplicantCardSection from "./_sections/applicant-card-section";

export default function Page() {
    return (
        <Layout>
            <JobPostingLayout>
                <div>
                    <HeaderSection />
                    <CardSection />
                    <div className="mt-6">
                        <SearchSection />
                    </div>

                    <div className="mt-6">
                        <ApplicantCardSection />
                    </div>
                </div>
            </JobPostingLayout>
        </Layout>
    );
}
