import React from 'react'
import Layout from '../../../layout'
import RnrLayout from '../layout'
import CreateNewChallenge from './sections/create-new-challenge'

export default function Page() {
  return (
    <Layout>
      
      <RnrLayout>
        <CreateNewChallenge />
      </RnrLayout>
    </Layout>
  )
}
