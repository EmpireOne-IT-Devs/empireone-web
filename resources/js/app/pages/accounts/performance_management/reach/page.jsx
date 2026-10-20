import React, { useEffect, useState } from 'react'
import PerformanceManagementLayout from './../layout'
import store from '@/app/store/store'
import { get_leader_thunk, get_reach_specific_leader_thunk } from '@/app/redux/employee-relation-thunk'
import TableSection from './_sections/table-section'
import CreateREACHSection from './_sections/create-reach-section'
export default function Page() {
    const [isloading, setIsloading] = useState(true)
    useEffect(() => {
        async function get_data(params) {
            await store.dispatch(get_reach_specific_leader_thunk())
            await store.dispatch(get_leader_thunk())
            setIsloading(false)

        }
        get_data()
    }, [])
    return (
        <PerformanceManagementLayout>
            <div className='flex w-full items-center justify-end'>
                <CreateREACHSection />
            </div>
            <TableSection isloading={isloading} />
        </PerformanceManagementLayout>
    )
}
