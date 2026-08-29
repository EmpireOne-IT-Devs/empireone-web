import React, { useEffect, useState } from 'react'
import ExitClearanceForm from './_sections/exit-clearance-form'
import store from '@/app/store/store'
import { get_attrition_by_id_thunk } from '@/app/redux/employee-relation-thunk'

export default function ExitClearancePage() {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function get_data(params) {
            await store.dispatch(get_attrition_by_id_thunk(window.location.pathname.split('/')[3]))
            setLoading(false)
        }
        get_data()
    }, [])
    return (
        <>
            {
                !loading ? <ExitClearanceForm /> : "Loading..."
            }
        </>
    )
}
