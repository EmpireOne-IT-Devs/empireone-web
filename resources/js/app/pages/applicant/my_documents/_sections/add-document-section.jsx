import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import onboarding_documents from "@/app/lib/onboarding-documents";
import { UploadCloud, Trash2 } from "lucide-react";

export default function AddDocumentSection() {
    const [open, setOpen] = useState(false);

    const { control, register, handleSubmit } = useForm({
        defaultValues: {
            documents: [
                {
                    type: "",
                    file: null,
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "documents",
    });

    const onSubmit = (data) => {
        console.log("FORM DATA:", data);
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
                <UploadCloud size={20} />
                Upload New Document
            </Button>

            <Modal
                width="max-w-xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Add Documents"
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="flex gap-3 items-end"
                            >
                                <div className="flex-1">
                                    <Select
                                        label="Type of Document"
                                        options={onboarding_documents}
                                        {...register(
                                            `documents.${index}.type`,
                                            {
                                                required: true,
                                            },
                                        )}
                                    />
                                </div>

                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        label="File"
                                        {...register(
                                            `documents.${index}.file`,
                                            {
                                                required: true,
                                            },
                                        )}
                                    />
                                </div>

                                <Button
                                    className="mb-2"
                                    outlined
                                    type="button"
                                    onClick={() => remove(index)}
                                    variant="danger"
                                >
                                    <Trash2 size={12} />
                                </Button>
                            </div>
                        ))}

                        <Button
                            outlined
                            variant="secondary"
                            type="button"
                            onClick={() => append({ type: "", file: null })}
                        >
                            + Add Another Document
                        </Button>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            SUBMIT
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
