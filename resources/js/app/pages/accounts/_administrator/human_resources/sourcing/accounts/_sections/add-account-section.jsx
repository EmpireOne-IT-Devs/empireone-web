import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { FaUser, FaAlignLeft } from 'react-icons/fa'
import Button from '@/app/_components/button'
import Input from '@/app/_components/input'
import Modal from '@/app/_components/modal'
import { get_app_data_thunk } from '@/app/redux/app-thunk'
import store from '@/app/store/store'
import { setAlert } from '@/app/redux/app-slice'
import { update_or_create_account_service } from '@/app/services/human-resources-service'

export default function AddAccountSection() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            description: ''
        }
    })

    const handleClose = () => {
        reset()
        setOpen(false)
    }

    const onSubmit = async (formData) => {
        setLoading(true)
        try {
            await update_or_create_account_service(formData)
            await store.dispatch(get_app_data_thunk())
            dispatch(
                setAlert({
                    type: "success",
                    title: "Account Created Successfully!",
                    message: "The account has been created and is ready for review.",
                    open: true,
                })
            );

            handleClose()
        } catch (error) {
            console.error('Failed to add account:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Button
                variant="secondary"
                onClick={() => setOpen(true)}
            >
                ADD ACCOUNT
            </Button>

            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={handleClose}
                title="ADD ACCOUNT"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
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
                            {...register('description', { required: 'Description name is required' })}
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
                            {loading ? 'Saving...' : 'Save Account'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}