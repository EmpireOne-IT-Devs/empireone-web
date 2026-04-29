import React, { useEffect } from "react";
import Layout from "../../../../layout";
import EmployeeRelationLayout from "../../layout";
import AssessmentProcessLayout from "../layout";

export default function page() {
    return (
        <Layout>
            <EmployeeRelationLayout>
                    <AssessmentProcessLayout>
                        non regularization
                    </AssessmentProcessLayout>
            </EmployeeRelationLayout>
        </Layout>
    );
}
