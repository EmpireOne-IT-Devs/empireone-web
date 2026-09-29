import React, { useEffect } from 'react'
import Layout from "../../../../layout";
import EmployeeRelationLayout from '../../layout';
import TableSection from './_sections/table-section';
import AddDepartmentSection from './_sections/add-department-section';

export default function Page() {
    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className='w-full flex items-center justify-end py-3'>
                    <AddDepartmentSection />
                </div>
                <TableSection />
            </EmployeeRelationLayout>
        </Layout>
    )
}
