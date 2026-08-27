import React from 'react'
import Layout from '../../../layout'
import RnrLayout from '../layout'
import CreateNewChallenge from './dashboard/create-new-challenge'
import TabsSection from './sections/tabs-section'

export default function Page() {
  return (
    <Layout>
      
      <RnrLayout>
          <TabsSection />
      </RnrLayout>
    </Layout>
  )
}
