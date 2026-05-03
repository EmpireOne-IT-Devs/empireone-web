import React, { useEffect } from "react";
import Layout from "../../layout";
import TableSection from "./_sections/table-section";
import MyTeamLayout from "../layout";

export default function Page() {

    return (
        <Layout>
            <MyTeamLayout>
                <TableSection />
            </MyTeamLayout>
        </Layout>
    );
}
