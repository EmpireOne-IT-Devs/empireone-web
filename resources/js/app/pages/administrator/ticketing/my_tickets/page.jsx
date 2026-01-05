import React from "react";
import Layout from "../../layout";
import TicketingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import CardsSection from "./_sections/cards-section";
import SearchSection from "./_sections/search-section";
import TicketCardsSection from "./_sections/ticket-cards-section";

export default function Page() {
    return (
        <Layout>
            <TicketingLayout>
                <div className="flex flex-col gap-3">
                    <HeaderSection />
                    <CardsSection />
                    <SearchSection />
                    <TicketCardsSection />
                </div>
            </TicketingLayout>
        </Layout>
    );
}
