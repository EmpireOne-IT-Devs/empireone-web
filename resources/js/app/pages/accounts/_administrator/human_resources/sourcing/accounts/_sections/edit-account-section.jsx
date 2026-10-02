import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { FaUser, FaAlignLeft, FaPen } from 'react-icons/fa'
import Button from '@/app/_components/button'
import Input from '@/app/_components/input'
import Modal from '@/app/_components/modal'
import { get_app_data_thunk } from '@/app/redux/app-thunk'
import { setAlert } from '@/app/redux/app-slice'
import { update_or_create_account_service } from '@/app/services/human-resources-service'

export default function EditAccountSection({ props_data }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const isEditMode = Boolean(props_data?.id)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            id: props_data?.id || null,
            name: props_data?.name || '',
            description: props_data?.description || ''
        }
    })

    // Sync form values whenever props_data changes or modal opens
    useEffect(() => {
        if (open) {
            reset({
                id: props_data?.id || null,
                name: props_data?.name || '',
                description: props_data?.description || ''
            })
        }
    }, [props_data, open, reset])

    const handleClose = () => {
        reset()
        setOpen(false)
    }

    const onSubmit = async (formData) => {
        setLoading(true)
        try {
            await update_or_create_account_service(formData)
            await dispatch(get_app_data_thunk())

            dispatch(
                setAlert({
                    type: "success",
                    title: `Account ${isEditMode ? 'Updated' : 'Created'} Successfully!`,
                    message: `The account has been ${isEditMode ? 'updated' : 'created'} and saved.`,
                    open: true,
                })
            )

            handleClose()
        } catch (error) {
            console.error(`Failed to ${isEditMode ? 'update' : 'add'} account:`, error)
            dispatch(
                setAlert({
                    type: "error",
                    title: "Operation Failed",
                    message: error?.response?.data?.message || "An error occurred while saving.",
                    open: true,
                })
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Button
                onClick={() => setOpen(true)}
                variant="primary"
                outlined
            >
                <FaPen className='mr-2' /> EDIT ACCOUNT
            </Button>

            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={handleClose}
                title={'EDIT ACCOUNT'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                    {/* Hidden input for Account ID when updating */}
                    {isEditMode && <input type="hidden" {...register('id')} />}

                    <div>
                        <Input
                            label="Name of Account"
                            name="name"
                            {...register('name', { required: 'Account name is required' })}
                            iconLeft={<FaUser size={14} />}
                            error={errors?.name?.message}
                        />
                    </div>

                    <div>
                        <Input
                            label="Description"
                            name="description"
                            {...register('description', { required: 'Description is required' })}
                            iconLeft={<FaAlignLeft size={14} />}
                            error={errors?.description?.message}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : isEditMode ? 'Update Account' : 'Save Account'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}