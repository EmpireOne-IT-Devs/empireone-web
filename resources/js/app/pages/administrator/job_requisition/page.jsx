import Layout from "../layout";
import HeaderSection from "./_sections/header-section";
import CardSection from "./_sections/card-section";
import SearchSection from "./_sections/search-section";
import JobRequisitionCardSection from "./_sections/job-requisition-card-section";

export default function Page() {
    return (
        <Layout>
            <div className="space-y-6">
                <HeaderSection />
                <CardSection />
                <SearchSection />
                <JobRequisitionCardSection />
            </div>
        </Layout>
    );
}
