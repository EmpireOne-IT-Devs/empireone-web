import React, { Children } from "react";
import Layout from "../../layout";
import ActivitiesLayout from "../layout";
import ManageContentLayout from "./layout";

export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <ManageContentLayout></ManageContentLayout>
            </ActivitiesLayout>
        </Layout>
    );
}
