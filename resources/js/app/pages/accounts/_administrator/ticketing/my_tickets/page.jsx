import React, { useEffect } from "react";
import Layout from "../../../layout";
import TicketingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import CardsSection from "./_sections/cards-section";
import SearchSection from "./_sections/search-section";
import TicketCardsSection from "./_sections/ticket-cards-section";
import { get_my_tickets_thunk } from "@/app/redux/tickets-thunk";
import store from "@/app/store/store";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_my_tickets_thunk());
    }, []);

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
