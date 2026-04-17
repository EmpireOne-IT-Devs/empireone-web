import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import onboarding_documents from "@/app/lib/onboarding-documents";
import {
    UploadCloud,
    Trash2,
    ClipboardCheck,
    ClipboardCheckIcon,
    X,
    Plus,
    Trash,
} from "lucide-react";
import { add_documents_service } from "@/app/services/documents-services";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import { get_documents_by_user_thunk } from "@/app/redux/applicant-thunk";
import store from "@/app/store/store";

export default function AddDocumentSection() {
    const [open, setOpen] = useState(false);
    const { documents } = useSelector((store) => store.applicants);

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
            for (let pair of formData.entries()) {
                console.log(pair[0] + ", " + pair[1]);
            }
            await add_documents_service(formData);
            await store.dispatch(get_documents_by_user_thunk());
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
                title={
                    <div className="flex items-center gap-3 p-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <ClipboardCheckIcon />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                My Documents
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Add Documents
                            </h2>
                        </div>
                    </div>
                }
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
                        {/* HEADER */}
                        <div className="flex items-center justify-between px-5 py-4 border border-border rounded-xl bg-background">
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Upload documents
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Attach required onboarding files below
                                </p>
                            </div>
                            <Button
                                name="button"
                                outlined
                                onClick={() => append({ name: "", file: null })}
                                variant="primary"
                                className="flex items-center gap-1.5 text-sm px-3 py-2  border bor  der-border text-foreground hover:bg-muted rounded-lg"
                            >
                                <Plus size={14} />
                                Add document
                            </Button>
                        </div>

                        {/* EMPTY STATE */}
                        {fields.length === 0 && (
                            <div className="text-center text-sm text-muted-foreground py-8 border border-dashed border-border rounded-xl">
                                No documents added yet. Click "Add document" to
                                begin.
                            </div>
                        )}

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
                                    className="grid grid-cols-[1fr_1fr_36px] gap-3 items-end bg-muted/40 border border-border rounded-xl px-4 py-3"
                                >
                                    {/* SELECT */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                            Document name
                                        </label>
                                        <Select
                                            {...register(
                                                `documents.${index}.name`,
                                                { required: true },
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
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                            Attach file
                                        </label>
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
                                    <div className=" flex mb-2 mr-1   ">
                                        <Button
                                            name="button"
                                            onClick={() => remove(index)}
                                            className="bg-red-500 text-white px-3"
                                        >
                                            <Trash size={16} />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* SUBMIT */}
                        <div className=" overflow-hidden">
                            <Button
                                outlined
                                name="submit"
                                type="submit"
                                loading={isSubmitting}
                                variant="secondary"
                                className="w-full py-3 "
                            >
                                Submit documents
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
}
