import React, { useEffect } from 'react'
import Layout from "../../../../layout";
import EmployeeRelationLayout from '../../layout';
import { useSelector } from 'react-redux';
import TableSection from './_sections/table-section';
import AddAccountSection from './_sections/add-account-section';

export default function Page() {
    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className='w-full flex items-center justify-end py-3'>
                    <AddAccountSection />
                </div>
                <TableSection  loading={loading} />
            </EmployeeRelationLayout>
        </Layout>
    )
}
