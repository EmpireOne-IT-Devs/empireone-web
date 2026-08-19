import React, { useEffect } from "react";
import Layout from "../../layout";
import MyTeamLayout from "../layout";
import CardTeamSection from "./_sections/card-team-section";

export default function Page() {

    return (
        <Layout>
            <MyTeamLayout>
                {/* <TableSection /> */}
                <CardTeamSection />
            </MyTeamLayout>
        </Layout>
    );
}
