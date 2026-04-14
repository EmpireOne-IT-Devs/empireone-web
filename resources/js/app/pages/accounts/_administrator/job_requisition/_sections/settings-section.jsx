import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { add_account_access_service } from "@/app/services/job-requisition-service";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FcSettings } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";

export default function SettingsSection() {
    const [open, setOpen] = useState(false);
    const { users } = useSelector((state) => state.job_requisitions);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            first_approval: {
                user_id: "",
                order: 1,
                type: "Job Requisition Approval",
            },
            second_approval: {
                user_id: "",
                order: 2,
                type: "Job Requisition Approval",
            },
        },
    });

    // Watch the specific nested user_id values
    const firstUserId = watch("first_approval.user_id");
    const secondUserId = watch("second_approval.user_id");

    const onSubmit = (data) => {
        try {
            // Data will now be structured with your objects
            add_account_access_service(data);
            setOpen(false);
            dispatch(
                setAlert({
                    type: "success",
                    title: "Job Requisition Settings Updated!",
                    message:
                        "The job requisition settings has been updated and is ready for review.",
                    open: true,
                }),
            );
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        users?.access?.forEach((element) => {
            if (element.order == '1') {
                setValue("first_approval.user_id", element.user_id);
            } else if (element.order == '2') {
                setValue("second_approval.user_id", element.user_id);
            }
        });
    }, [users?.access, setValue]);

    const allOptions =
        users?.users?.map((res) => ({
            ...res,
            label: res.name,
            value: res.id,
        })) || [];

    // Filter logic based on the nested user_id
    const firstApprovalOptions = allOptions.filter(
        (opt) => String(opt.value) !== String(secondUserId),
    );

    const secondApprovalOptions = allOptions.filter(
        (opt) => String(opt.value) !== String(firstUserId),
    );

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="flex gap-2 items-center justify-center font-black"
            >
                <FcSettings className="text-3xl" />
                Settings
            </button>

            <Modal
                width="max-w-xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Job Requisition Settings"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="m-3 flex flex-col gap-3"
                >
                    <Select
                        className="w-full"
                        label="First Approval"
                        value={firstUserId}
                        options={firstApprovalOptions}
                        onChange={(val) =>
                            setValue("first_approval.user_id", val)
                        }
                    />

                    <Select
                        className="w-full"
                        label="Second Approval"
                        value={secondUserId}
                        options={secondApprovalOptions}
                        onChange={(val) =>
                            setValue("second_approval.user_id", val)
                        }
                    />

                    <Button loading={isSubmitting} type="submit">
                        SAVE
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
