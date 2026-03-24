import React from "react";
import ChatMessagesUI from "./sections/message-section";
import HeaderSection from "./sections/header-section";
import Layout from "../layout";

export default function Page() {
    return (
        <Layout>
            <HeaderSection />
            <ChatMessagesUI />
        </Layout>
    );
}
