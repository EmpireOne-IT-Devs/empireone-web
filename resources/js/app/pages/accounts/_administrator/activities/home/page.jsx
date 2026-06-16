import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import CreatePostCardSection from "./sections/create-post-card-section";
import PostCardSection from "./sections/post-card-section";

export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <div className="flex flex-col gap-2 mt-2">
                    <CreatePostCardSection />
                    <PostCardSection />
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
