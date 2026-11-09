import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import { useCurrentEmployee } from "@/app/_hooks/use-current-employee";
import {
    FiCheckSquare as ClipboardCheckIcon,
    FiAlertCircle as AlertCircle,
    FiDownload as Download,
} from "react-icons/fi";
import CoeDocument from "./coe-document-section";

export default function GenerateCoeSection() {
    const [open, setOpen] = useState(false);
    const [purpose, setPurpose] = useState("");
    const [debounced_purpose, setDebouncedPurpose] = useState("");
    const { user, employee, isReady } = useCurrentEmployee();
    const sites = useSelector((store) => store.app.data?.sites);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedPurpose(purpose), 400);
        return () => clearTimeout(timer);
    }, [purpose]);

    const site = sites?.find((item) => item.id === employee?.site_id);

    const coe_props = {
        name: user?.name ?? "",
        first_name: user?.personal_information?.first_name,
        last_name: user?.personal_information?.last_name,
        middle_name: user?.personal_information?.middle_name,
        gender: user?.personal_information?.gender,
        employee_id: employee?.employee_id,
        position: employee?.position,
        started_at: employee?.started_at,
        office_address: site?.full_address,
        purpose: debounced_purpose,
    };
    const file_name = `COE - ${coe_props.name}.pdf`;

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg"
            >
                <ClipboardCheckIcon size={20} />
                Generate COE(Certificate of Employment)
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
                                Generate COE
                            </h2>
                        </div>
                    </div>
                }
            >
                {isReady && user?.name ? (
                    <div className="flex flex-col gap-4 p-4">
                        <Input
                            name="coe_purpose"
                            label="Purpose of request"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                        />
                        <div className="h-[60vh] w-full overflow-hidden rounded-xl border border-gray-200">
                            <PDFViewer
                                width="100%"
                                height="100%"
                                showToolbar={false}
                                style={{ border: 0 }}
                            >
                                <CoeDocument {...coe_props} />
                            </PDFViewer>
                        </div>
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                outlined
                                variant="secondary"
                                onClick={() => setOpen(false)}
                                className="px-5 py-2.5 rounded-lg"
                            >
                                Close
                            </Button>
                            <PDFDownloadLink
                                document={<CoeDocument {...coe_props} />}
                                fileName={file_name}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                            >
                                {({ loading }) => (
                                    <>
                                        <Download size={16} />
                                        {loading ? "Preparing..." : "Download PDF"}
                                    </>
                                )}
                            </PDFDownloadLink>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                            <AlertCircle size={22} />
                        </div>
                        <h3 className="text-base font-semibold text-gray-800">
                            Employee record not found
                        </h3>
                        <p className="max-w-xs text-sm text-gray-500">
                            Your details could not be loaded. Please try again
                            later.
                        </p>
                        <Button
                            onClick={() => setOpen(false)}
                            className="px-5 py-2.5 rounded-lg"
                        >
                            Close
                        </Button>
                    </div>
                )}
            </Modal>
        </>
    );
}
