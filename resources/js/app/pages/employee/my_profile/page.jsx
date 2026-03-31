import React, { useState } from "react";
import HeaderSection from "./sections/header-section";
import InfoTabsSection from "./sections/info-tabs-section";
import Layout from "../layout";

export default function Page() {
    const [editing, setEditing] = useState(false);

    return (
        <Layout>
            <HeaderSection editing={editing} setEditing={setEditing} />
            <div className="mt-4">
                <InfoTabsSection editing={editing} setEditing={setEditing} />
            </div>
        </Layout>
    );
}
