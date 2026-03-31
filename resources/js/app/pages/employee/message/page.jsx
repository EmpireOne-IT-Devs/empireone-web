import React from "react";
import Layout from "../layout";
import HeaderSection from "./sections/header-section";
import ChatMessagesUI from "./sections/message-section";

export default function Page() {
    return (
        <Layout>
            <HeaderSection />
            <ChatMessagesUI />
        </Layout>
    );
}
