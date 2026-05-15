import Button from '@/app/_components/button'
import Modal from '@/app/_components/modal'
import { setAlert } from '@/app/redux/app-slice';
import { add_documents_service } from '@/app/services/documents-services';
import { accept_employee_change_form_service } from '@/app/services/employee-change-form-service';
import store from '@/app/store/store';
import { router } from '@inertiajs/react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function AcceptChangeForm() {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const { ecf } = useSelector((store) => store.human_resources);
    const { loading, document } = useSelector((store) => store.app);

    console.log('ecfecf', ecf?.employee?.user?.role)

    async function accept_function(params) {
        try {
            setIsLoading(true)
            const fileResponse = await fetch(document.url);
            const fileBlob = await fileResponse.blob();

            const formData = new FormData();
            formData?.append(
                "documents[0][name]", "Employee Change Form.pdf",
            );

            formData?.append("documents[0][status]", "Approved");
            formData?.append(
                "documents[0][file]",
                fileBlob
            );
            // await add_documents_service(formData);
            await accept_employee_change_form_service({
                ...ecf,
                employee_change_form_id: window.location.pathname.split('/')[3]
            })
            // router.visit(`/accounts/${ecf?.employee?.user?.role == 1 ? "administrator" : "employee"}/my_documents`)
            dispatch(
                setAlert({
                    type: "success",
                    title: "Documents added Successfully!",
                    message:
                        "The document has been created and is ready for review.",
                    open: true,
                }),
            );
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)

        }

    }
    return (
        <>
            <div className="fixed bottom-10 right-10 z-50">
                <Button
                    loading={isLoading}
                    disabled={loading || isLoading}
                    onClick={() => setOpen(true)}
                >
                    I Accept
                </Button>
                <Modal
                    width="max-w-3xl"
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    title=""
                >
                    <div className='text-4xl text-center py-12'>
                        Congratulations! 🎊
                    </div>
                    <Button
                        disabled={loading}
                        loading={isLoading}
                        onClick={() => accept_function()}
                        className=" flex-1 w-full py-3"
                    >
                        ACCEPT
                    </Button>
                </Modal>
            </div>
        </>
    )
}
