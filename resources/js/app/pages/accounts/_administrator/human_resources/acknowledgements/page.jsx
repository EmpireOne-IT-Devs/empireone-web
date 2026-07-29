import React from 'react'
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import AddAcknowledgementSection from './_sections/add-acknowledgement-section';
import CardAcknowledgementSection from './_sections/card-acknowledgement-section';

export default function Page() {
    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className='p-3'>
                    <AddAcknowledgementSection />
                    <div className='flex-1 py-3'> 
                        {/* <CardAcknowledgementSection /> */}
                    </div>
                </div>
            </EmployeeRelationLayout>
        </Layout>
    )
}
