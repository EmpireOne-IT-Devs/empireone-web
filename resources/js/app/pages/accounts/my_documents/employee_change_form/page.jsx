import React, { useEffect } from 'react'
import EmployeeChangeFormSection from './_sections/change-form-section'
import store from '@/app/store/store'
import { get_employee_change_form_by_id_thunk } from '@/app/redux/employee-relation-thunk'

export default function Page() {

    useEffect(() => {
        store.dispatch(get_employee_change_form_by_id_thunk(window.location.pathname.split('/')[3]))
    }, [])
    return (
        <div>
            <EmployeeChangeFormSection />
        </div>
    )
}
