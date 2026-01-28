import React from "react";
import Layout from "../../layout";
import TicketingLayout from "../layout";
import CardSection from "./_sections/card-section";
import LineGraphSection from "./_sections/line-graph-section";
import PieGraphSection from "./_sections/pie-graph-section";
import BarGraphSection from "./_sections/bar-graph-section";
import TableSection from "./_sections/table-section";
import PriorityBreakdownSection from "./_sections/priority-breakdown-section";
import HeaderSection from "./_sections/header-section";

export default function Page() {
    return (
        <Layout>
            <div className="  ">
                 <TicketingLayout>
                <HeaderSection />
                <CardSection />
                <div className="flex gap-3 my-5">
                    <div className="w-3/4">
                        <LineGraphSection />
                    </div>
                    <div className="w-1/4 flex items-center justify-center">
                        <PieGraphSection />
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <BarGraphSection />
                    <TableSection />
                    <PriorityBreakdownSection />
                </div>
            </TicketingLayout>
            </div>
           
        </Layout>
    );
}
