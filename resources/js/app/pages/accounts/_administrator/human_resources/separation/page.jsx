import React from "react";
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import CardAcknowledgementSection from "./_sections/card-separation-section";

export default function Page() {
    return (
        <Layout>
            <EmployeeRelationLayout>
                <CardAcknowledgementSection />
            </EmployeeRelationLayout>
        </Layout>
    );
}
