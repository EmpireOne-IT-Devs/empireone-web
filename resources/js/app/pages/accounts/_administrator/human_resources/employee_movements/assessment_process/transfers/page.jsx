import React, { useEffect } from "react";
import Layout from "@/app/pages/accounts/layout";
import TabsSection from "./../_sections/tabs-section";
import EmployeeRelationLayout from "../../../layout";
import EmployeeMovementsLayout from "../../layout";

export default function Page() {

    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className="py-3">
                    <EmployeeMovementsLayout>
                        <TabsSection />
                    promoitions
                    </EmployeeMovementsLayout>
                </div>
            </EmployeeRelationLayout>
        </Layout>
    );
}
