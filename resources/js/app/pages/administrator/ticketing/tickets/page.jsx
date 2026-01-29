import Layout from "../../layout";
import TicketingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import CardsSection from "./_sections/cards-section";
import SearchSection from "./_sections/search-section";
import TicketTableSection from "./_sections/ticket-table-section";

export default function Page() {
    return (
        <Layout>
            <TicketingLayout>
                <div className="flex flex-col gap-2">
                    <HeaderSection />
                    <CardsSection />
                    <SearchSection />
                    <TicketTableSection />
                </div>
            </TicketingLayout>
        </Layout>
    );
}
