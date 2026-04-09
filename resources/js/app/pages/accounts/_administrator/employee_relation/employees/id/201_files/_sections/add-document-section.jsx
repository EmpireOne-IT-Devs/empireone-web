import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import onboarding_documents from "@/app/lib/onboarding-documents";
import { UploadCloud, Trash2 } from "lucide-react";
import { add_documents_service } from "@/app/services/documents-services";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import { get_documents_by_user_thunk } from "@/app/redux/applicant-thunk";
import store from "@/app/store/store";
import { get_user_by_id_thunk } from "@/app/redux/app-thunk";

export default function AddDocumentSection() {
    const [open, setOpen] = useState(false);
    const { user } = useSelector((store) => store.app);

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            documents: [{ name: "", file: null }],
        },
    });
    const dispatch = useDispatch();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "documents",
    });

    const selectedDocs = watch("documents");
    console.log("selectedDocs", selectedDocs);
    console.log("selectedDocs");
    const watchValues = watch();

    // useEffect(()=>{
    // setValue(
    //         "documents",""
    //     );
    // },[])
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            data.documents.forEach((doc, index) => {
                formData.append(`documents[${index}][name]`, doc.name);
                formData.append(`documents[${index}][file]`, doc.file[0]);
            });

            formData.append(`user_id`, window.location.pathname.split("/")[3]);
            for (let pair of formData.entries()) {
                console.log(pair[0] + ", " + pair[1]);
            }
            await add_documents_service(formData);
            await store.dispatch(
                get_user_by_id_thunk(window.location.pathname.split("/")[3]),
            );
            await dispatch(
                setAlert({
                    type: "success",
                    title: "Documents added Successfully!",
                    message:
                        "The documents has been created and is ready for review.",
                    open: true,
                }),
            );
            setOpen(false);
            reset();
        } catch (error) {
            console.error("Failed to upload documents:", error);
        }
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg"
            >
                <UploadCloud size={20} />
                Upload New Document
            </Button>

            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Add Documents"
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
                        {/* ADD BUTTON */}
                        <div className="flex justify-end">
                            <Button
                                name="button"
                                onClick={() => append({ name: "", file: null })}
                                className="bg-blue-500 text-white"
                            >
                                + Add Another Document
                            </Button>
                        </div>

                        {/* FIELDS */}
                        {fields.map((field, index) => {
                            const filteredOptions = onboarding_documents.filter(
                                (option) => {
                                    const isSelectedInForm = selectedDocs?.some(
                                        (doc, i) =>
                                            doc?.name === option.value &&
                                            i !== index,
                                    );
                                    const isAlreadyUploaded = (
                                        user?.documents || []
                                    ).some(
                                        (uploadedDoc) =>
                                            uploadedDoc.name === option.value,
                                    );
                                    return (
                                        !isSelectedInForm && !isAlreadyUploaded
                                    );
                                },
                            );
                            return (
                                <div
                                    key={field.id}
                                    className="flex gap-3 items-center"
                                >
                                    <div className="flex-1">
                                        <Select
                                            {...register(
                                                `documents.${index}.name`,
                                                {
                                                    required: true,
                                                },
                                            )}
                                            value={
                                                watchValues.documents?.[index]
                                                    ?.name
                                            }
                                            name={`documents.${index}.name`}
                                            label="Name of Document"
                                            options={filteredOptions}
                                            error={
                                                errors?.documents?.[index]?.name
                                            }
                                        />
                                    </div>

                                    {/* FILE INPUT */}
                                    <div className="flex-1">
                                        <Input
                                            name={`documents.${index}.file`}
                                            type="file"
                                            label="File"
                                            {...register(
                                                `documents.${index}.file`,
                                                { required: true },
                                            )}
                                            error={
                                                errors?.documents?.[index]?.file
                                            }
                                        />
                                    </div>

                                    {/* REMOVE */}
                                    <Button
                                        name="button"
                                        onClick={() => remove(index)}
                                        className="bg-red-500 text-white px-3"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            );
                        })}

                        {/* SUBMIT */}
                        <Button
                            name="submit"
                            type="submit"
                            loading={isSubmitting}
                            className="w-full bg-blue-600 text-white"
                        >
                            SUBMIT
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
