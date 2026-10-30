import React, { useEffect, useState } from 'react'
import PerformanceManagementLayout from './../layout'
import CreateCorrectiveActionSection from './_sections/create-corrective-action-section'
import store from '@/app/store/store'
import TableSection from './_sections/table-section'
import { get_corrective_actions_specific_leader_thunk } from '@/app/redux/employee-relation-thunk'
export default function Page() {

    const [loading, setLoading] = useState(true)
    useEffect(() => {
        // 
        async function get_data(params) {
            try {
                setLoading(true)
                await store.dispatch(get_corrective_actions_specific_leader_thunk())
                setLoading(false)
            } catch (error) {
                setLoading(false)
            }
        }
        get_data()
    }, [])
    return (
        <PerformanceManagementLayout>
            <div className='w-full flex items-center justify-end'>
                <CreateCorrectiveActionSection />
            </div>
            <TableSection isloading={loading}/>
        </PerformanceManagementLayout>
    )
}
