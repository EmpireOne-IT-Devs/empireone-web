import Button from '@/app/_components/button'
import Modal from '@/app/_components/modal'
import { setAlert } from '@/app/redux/app-slice';
import { add_documents_service } from '@/app/services/documents-services';
import { accept_employee_change_form_service } from '@/app/services/employee-change-form-service';
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

    async function accept_function() {
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
            await accept_employee_change_form_service({
                ...ecf,
                employee_change_form_id: window.location.pathname.split('/')[3]
            })
            await add_documents_service(formData);
            router.visit(`/accounts/${ecf?.employee?.user?.role == 1 ? "administrator" : "employee"}/my_documents`)
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
            <div className="fixed z-50 bottom-10 right-10">
                <Button
                    loading={isLoading}
                    disabled={loading || isLoading}
                    onClick={() => setOpen(true)}
                    className="shadow-lg"
                >
                    I Accept
                </Button>
                <Modal
                    width="max-w-2xl"
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    title=""
                >
                    {/* --- STATEMENT DESIGN START --- */}
                    <div className="flex flex-col gap-5 p-2 text-gray-800">
                        <div className="pb-4 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                Acknowledgment and Acceptance
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Please review the following statement before accepting the changes.
                            </p>
                        </div>

                        <div className="space-y-4 text-sm leading-relaxed text-gray-700">
                            <p>
                                By clicking <strong>"ACCEPT"</strong>, I acknowledge that I have carefully reviewed the attached Employee Change Form. I confirm that all the information provided is accurate, complete, and reflects the agreed-upon modifications to my employment records.
                            </p>
                            <p>
                                I understand that this constitutes a formal change to my employment profile and I agree to any updated terms, conditions, compensation adjustments, or policy updates associated with this change.
                            </p>
                        </div>

                        <div className="p-4 mt-2 border border-blue-200 rounded-lg bg-blue-50">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-xs text-blue-800">
                                    <strong>Electronic Signature Notice:</strong> Proceeding with this action is legally binding and will serve as your official electronic signature for this document.
                                </p>
                            </div>
                        </div>

                        {/* --- ACTION BUTTONS --- */}
                        <div className="flex gap-4 pt-6 mt-2 border-t border-gray-200">
                            <Button
                                disabled={loading || isLoading}
                                onClick={() => setOpen(false)}
                                className="flex-1 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200"
                            >
                                CANCEL
                            </Button>
                            <Button
                                disabled={loading}
                                loading={isLoading}
                                onClick={() => accept_function()}
                                className="flex-1 py-3"
                            >
                                ACCEPT
                            </Button>
                        </div>
                    </div>
                    {/* --- STATEMENT DESIGN END --- */}
                </Modal>
            </div>
        </>
    )
}