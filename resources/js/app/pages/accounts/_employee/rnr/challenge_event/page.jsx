import React from 'react'
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "../layout";
import ChallengeEventSection from "./sections/challenge-event-section";

export default function Page() {
  return (
    <Layout>
        <RnrLayout>
            <div className="mt-4">
                <ChallengeEventSection />
            </div>
        </RnrLayout>
    </Layout>
  )
}
