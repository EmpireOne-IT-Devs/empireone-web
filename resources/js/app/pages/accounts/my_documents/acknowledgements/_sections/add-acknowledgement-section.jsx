import Button from '@/app/_components/button'
import Modal from '@/app/_components/modal'
import { setAlert } from '@/app/redux/app-slice'
import { get_acknowledgement_thunk } from '@/app/redux/employee-relation-thunk'
import { add_acknowledgement_service } from '@/app/services/employee-relation-service'
import store from '@/app/store/store'
import { Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useDispatch } from 'react-redux'

export default function AddAcknowledgementSection() {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    // Initialize react-hook-form
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm({
        defaultValues: {
            title: '',
            file: null,
            items: []
        }
    })

    // Initialize useFieldArray for dynamic acknowledgement items
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    })

    function onClose() {
        setOpen(false)
        reset() // Resets the form to defaultValues when closed
    }

    const onSubmit = async (data) => {
        try {
            const formData = new FormData()

            // Main Acknowledgement
            formData.append('title', data.title)

            // react-hook-form returns a FileList for file inputs
            if (data.file && data.file.length > 0) {
                formData.append('file', data.file[0])
            }

            // Append Dynamic Items
            data.items.forEach((item, index) => {
                formData.append(`items[${index}][title]`, item.title)

                if (item.file && item.file.length > 0) {
                    formData.append(`items[${index}][file]`, item.file[0])
                }
            })

            // TODO: Replace with your actual API endpoint
            // await axios.post('/api/acknowledgements', formData)
            await add_acknowledgement_service(formData)
            await store.dispatch(get_acknowledgement_thunk())
            dispatch(
                setAlert({
                    type: "success",
                    title: "Acknowledgement Added Successfully!",
                    message:
                        "The acknowledgement has been created and is ready for review.",
                    open: true,
                }),
            );
            console.log("Form submitted successfully!")
            onClose()
        } catch (error) {
            console.error("Error submitting form:", error)
        }
    }

    return (
        <>
            <Button
                variant='secondary'
                onClick={() => setOpen(true)}
            >
                <Plus className="w-4 h-4 mr-2" /> Acknowledgements
            </Button>

            <Modal
                title="Create Acknowledgements"
                isOpen={open}
                onClose={onClose}
                width='max-w-2xl'
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Main Acknowledgement Section */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                        <h3 className="font-semibold text-gray-700">Main Acknowledgement</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                {...register('title')}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter main title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                            <input
                                type="file"
                                {...register('file')}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="font-semibold text-gray-700">Acknowledgement Items</h3>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => append({ title: '', file: null })}
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add Item
                            </Button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-start p-4 border rounded-lg relative">
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
                                        <input
                                            type="text"
                                            {...register(`items.${index}.title`)}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="Enter item title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Item File</label>
                                        <input
                                            type="file"
                                            {...register(`items.${index}.file`)}
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                </div>

                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-500 hover:text-red-700 mt-8 p-2"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Acknowledgements'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}