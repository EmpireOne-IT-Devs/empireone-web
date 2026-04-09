import React from "react";
import Layout from "../../../layout";
import TicketingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import AccordionsSection from "./_sections/accordions-section";

export default function Page() {
    return (
        <Layout>
            <TicketingLayout>
                <HeaderSection />
                <AccordionsSection />
            </TicketingLayout>
        </Layout>
    );
}
