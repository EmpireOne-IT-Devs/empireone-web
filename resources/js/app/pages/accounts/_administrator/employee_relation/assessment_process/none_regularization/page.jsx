import React, { useEffect } from "react";
import Layout from "../../../../layout";
import EmployeeRelationLayout from "../../layout";
import AssessmentProcessLayout from "../layout";
import TableSection from "../_sections/table-section";

export default function page() {
    return (
        <Layout>
            <EmployeeRelationLayout>
                <AssessmentProcessLayout>
                    <TableSection />
                </AssessmentProcessLayout>
            </EmployeeRelationLayout>
        </Layout>
    );
}
