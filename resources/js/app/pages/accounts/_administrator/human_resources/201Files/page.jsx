import React, { useEffect } from 'react'
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import store from '@/app/store/store';
import { get_201_files_thunk } from '@/app/redux/employee-relation-thunk';
import TableSection from './_sections/table-section';
import PaginationSection from './_sections/pagination-section';
import SearchSection from './_sections/search-section';

export default function Page() {

    useEffect(() => {
        store.dispatch(get_201_files_thunk())
    }, [window.location.search])
    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className='flex gap-3 flex-col'>
                    <SearchSection />
                    <TableSection />
                    <PaginationSection />
                </div>
            </EmployeeRelationLayout>
        </Layout>
    )
}
