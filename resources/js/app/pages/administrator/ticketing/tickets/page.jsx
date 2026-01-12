import React from 'react'
import Layout from '../../layout'
import TicketingLayout from '../layout'
import CardsSection from './_sections/cards-section'
import SearchSection from './_sections/search-section'
import TicketCardsSection from './_sections/ticket-cards-section'

export default function Page() {
  return (
    <Layout>
      <TicketingLayout>
        <CardsSection />
        <SearchSection />
        <TicketCardsSection />
      </TicketingLayout>
    </Layout>
  )
}
