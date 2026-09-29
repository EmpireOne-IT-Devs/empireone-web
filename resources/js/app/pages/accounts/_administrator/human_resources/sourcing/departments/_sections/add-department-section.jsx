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
import { update_or_create_department_service } from '@/app/services/human-resources-service'

export default function AddDepartmentSection() {
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
        }
    })

    const handleClose = () => {
        reset()
        setOpen(false)
    }

    const onSubmit = async (formData) => {
        setLoading(true)
        try {
            await update_or_create_department_service(formData)
            await store.dispatch(get_app_data_thunk())
            dispatch(
                setAlert({
                    type: "success",
                    title: "Department Created Successfully!",
                    message: "The department has been created and is ready for review.",
                    open: true,
                })
            );

            handleClose()
        } catch (error) {
            console.error('Failed to add department:', error)
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
                ADD DEPARTMENT
            </Button>

            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={handleClose}
                title="ADD DEPARTMENT"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                    <div>
                        <Input
                            label="Name of Department"
                            name="name"
                            {...register('name', { required: 'Department name is required' })}
                            iconLeft={<FaUser size={14} />}
                            error={errors?.name?.message}
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
                            {loading ? 'Saving...' : 'Save Department'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}