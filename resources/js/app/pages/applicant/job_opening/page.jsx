import React from "react";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import JobPostingCardSection from "./sections/job-posting-card-section";

export default function Page() {
    return (
        <div>
            <HeaderSection />
            <SearchSection />
            <JobPostingCardSection />
        </div>
    );
}
