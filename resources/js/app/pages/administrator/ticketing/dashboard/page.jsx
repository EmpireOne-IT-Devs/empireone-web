import React from "react";
import Layout from "../../layout";
import TicketingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import CardSection from "./_sections/card-section";
import MostCommonIssueSection from "./_sections/most-common-issue-section";
import IssuesByCategorySection from "./_sections/issues-by-category-section";
import RecurringIssueSection from "./_sections/recurring-issue-section";
import RecentsTicketsSection from "./_sections/recents-tickets-section";

export default function Page() {
    return (
        <Layout>
            <TicketingLayout>
                <div className="flex flex-col gap-5">
                    <HeaderSection />
                    <CardSection />
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <MostCommonIssueSection />
                        </div>
                        <div className="flex-1">
                            <IssuesByCategorySection />
                        </div>
                    </div>
                    <RecurringIssueSection />
                    <RecentsTicketsSection />
                </div>
            </TicketingLayout>
        </Layout>
    );
}
