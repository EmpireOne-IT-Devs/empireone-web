import React from "react";
import Layout from '../../../layout'
import StoreAdminLayout from "../layout";
import RedeemedItemSections from "./sections/redeemed-item-sections";
import ItemTypeCardSection from "./sections/item-type-card-section";

export default function Page() {
    return (
        <Layout>
            <StoreAdminLayout>
                <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                    <div className="min-w-0">
                        <RedeemedItemSections />
                    </div>
                    <div className="min-w-0">
                        <ItemTypeCardSection />
                    </div>
                </div>
            </StoreAdminLayout>
        </Layout>
    );
}
