import { get_attrition_by_id_thunk } from '@/app/redux/employee-relation-thunk'
import store from '@/app/store/store'
import React, { useEffect, useState } from 'react'
import ExitInterviewForm from './_sections/exit-interview-form'

export default function ExitInterviewPage() {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function get_data(params) {
            await store.dispatch(get_attrition_by_id_thunk(window.location.pathname.split('/')[3]))
            setLoading(false)
        }
        get_data()
    }, [])
    return (
        <div>
            <ExitInterviewForm />
        </div>
    )
}
