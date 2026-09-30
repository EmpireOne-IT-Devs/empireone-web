import React, { useEffect, useState } from 'react'
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import store from '@/app/store/store';
import { get_201_files_thunk } from '@/app/redux/employee-relation-thunk';
import TableSection from './_sections/table-section';
import PaginationSection from './_sections/pagination-section';
import SearchSection from './_sections/search-section';
import LoadingState from '@/app/_components/loading-state';

export default function Page() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function get_data() {
            try {
                await store.dispatch(get_201_files_thunk());
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        get_data();
    }, [window.location.search]);

    return (
        <Layout>
            <EmployeeRelationLayout>
                {loading ? (
                    <LoadingState />
                ) : (
                    <div className='flex gap-3 flex-col'>
                        <SearchSection />
                        <TableSection />
                        <PaginationSection />
                    </div>
                )}
            </EmployeeRelationLayout>
        </Layout>
    )
}