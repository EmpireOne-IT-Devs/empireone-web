import React from 'react'
import Layout from '../layout'
import CardSection from './_sections/card-section'
import HeaderSection from './_sections/header-section'
import SearchSection from './_sections/search-section'
import JobRequisitionCardSection from './_sections/job-requisition-card-section'

export default function page() {
  return (
    <Layout>
        <HeaderSection />
       <CardSection />
       <SearchSection />
       <JobRequisitionCardSection />
    </Layout>
  )
}
