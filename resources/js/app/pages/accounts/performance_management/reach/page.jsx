import React, { useEffect, useState } from 'react'
import PerformanceManagementLayout from './../layout'
import store from '@/app/store/store'
import { get_reach_specific_leader_thunk } from '@/app/redux/employee-relation-thunk'
import TableSection from './_sections/table-section'
import CreateREACHSection from './_sections/create-reach-section'
import SearchSection from './_sections/search-section'
import PaginationSection from './_sections/pagination-section'
export default function Page() {
    const [isloading, setIsloading] = useState(true)
    useEffect(() => {
        async function get_data(params) {
            try {
                setIsloading(true)
                await store.dispatch(get_reach_specific_leader_thunk())
                // await store.dispatch(get_leader_thunk())
                setIsloading(false)
            } catch (error) {
                setIsloading(false)
            }

        }
        get_data()
    }, [window.location.search])
    return (
        <PerformanceManagementLayout>
            <div className='flex w-full items-center justify-between'>
                <SearchSection />
                <CreateREACHSection />
            </div>
            <div className='flex flex-col gap-3'>
                <TableSection isloading={isloading} />
                <PaginationSection />
            </div>
        </PerformanceManagementLayout>
    )
}
