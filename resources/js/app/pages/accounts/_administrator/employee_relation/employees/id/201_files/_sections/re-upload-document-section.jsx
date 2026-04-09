import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import onboarding_documents from "@/app/lib/onboarding-documents";
import { UploadCloud } from "lucide-react";
import { re_upload_documents_service } from "@/app/services/documents-services";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import { get_documents_by_user_thunk } from "@/app/redux/applicant-thunk";
import store from "@/app/store/store";

export default function ReUploadDocumentSection({ data }) {
    const [open, setOpen] = useState(false);
    const { documents } = useSelector((store) => store.applicants);

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        // CHANGE 1: Use 'values' instead of 'defaultValues' so it updates dynamically
        // if the 'data' prop changes after initial render.
        values: {
            documents: [{ name: data?.name || "", file: null }],
        },
    });

    const dispatch = useDispatch();
    const { fields } = useFieldArray({
        control,
        name: "documents",
    });

    const selectedDocs = watch("documents");
    const watchValues = watch();

    const onSubmit = async (formDataParsed) => {
        try {
            const formData = new FormData();
            formData.append(`document_id`, data.id);

            formDataParsed.documents.forEach((doc, index) => {
                formData.append(`documents[${index}][name]`, doc.name);
                formData.append(`documents[${index}][file]`, doc.file[0]);
            });

            await re_upload_documents_service(formData);
            await store.dispatch(get_documents_by_user_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Documents Re-Uploaded Successfully!",
                    message:
                        "The document has been updated and is ready for review.",
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
                Re-Upload
            </Button>

            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Re-Upload Documents"
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
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
                                        documents?.data || []
                                    ).some(
                                        (uploadedDoc) =>
                                            uploadedDoc.name === option.value &&
                                            // CHANGE 2: Ensure we DO NOT filter out the document we are currently trying to re-upload
                                            option.value !== data?.name,
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
                                            disabled
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
