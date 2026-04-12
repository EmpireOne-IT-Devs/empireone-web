import React, { useEffect } from "react";
import Layout from "../../../layout";
import JobPostingLayout from "../layout";
import QrcodeSection from "./_sections/qrcode-section";

export default function Page() {


    return (
        <Layout>
            <JobPostingLayout>
                <QrcodeSection />
            </JobPostingLayout>
        </Layout>
    );
}
