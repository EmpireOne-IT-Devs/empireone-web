import React, { useRef } from "react";
import ActivitiesLayout from "../layout";
import Layout from "../../../layout";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import CardSection from "./sections/card-section";
import TableSection from "./sections/table-section";
export default function Page() {
    const createSurveyRef = useRef(null);

    return (
        <Layout>
            <ActivitiesLayout>
                <div className="flex flex-col  h-full min-h-0 overflow-y-auto">
                    <HeaderSection />
                    <div className="flex-1  min-h-0 flex flex-col ">
                        <CardSection />
                        <SearchSection createSurveyRef={createSurveyRef} />
                        <TableSection createSurveyRef={createSurveyRef} />
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
