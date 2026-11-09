import React, { useEffect, useState } from 'react'
import PerformanceManagementLayout from './../layout'
import store from '@/app/store/store'
import { get_my_team_thunk } from '@/app/redux/department-thunk'
import TableSection from './_sections/table-section'
import SearchSection from './_sections/search-section'
export default function Page() {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function get_data(params) {
            try {
                setLoading(true)
                await store.dispatch(get_my_team_thunk())
                setLoading(false)
            } catch (error) {
                setLoading(false)
            }
        }
        get_data()
    }, [window.location.search])
    
    return (
        <PerformanceManagementLayout>
            <SearchSection />
            <TableSection isloading={loading} />
        </PerformanceManagementLayout>
    )
}
