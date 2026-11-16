import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import moment from "moment";

import Button from "@/app/_components/button";
import Select from "@/app/_components/select";
import Modal from "@/app/_components/modal";
import Confirmation from "@/app/_components/confirmation";
import { useCurrentEmployee } from "@/app/_hooks/use-current-employee";
import { setAlert } from "@/app/redux/app-slice";
import {
    create_coe_request_thunk,
    get_coe_status_thunk,
} from "@/app/redux/coe-request-thunk";
import {
    FiCheckSquare as ClipboardCheckIcon,
    FiAlertCircle as AlertCircle,
    FiClock as Clock,
    FiDownload as Download,
} from "react-icons/fi";
import CoeDocument from "./coe-document-section";

const PURPOSE_OPTIONS = [
    "Auto Loan",
    "Salary/Multi-Purpose Loan",
    "Housing Loan",
    "VISA Application",
    "Passport Application",
    "Government Transaction",
    "Educational Requirement (Scholarship/OJT/Graduation)",
    "Insurance Requirement",
    "Phone/Mobile Plan Application",
    "Internet Subscription",
    "Credit Card Application",
].map((item) => ({ label: item, value: item }));

export default function GenerateCoeSection() {
    const [open, setOpen] = useState(false);
    const [purpose, setPurpose] = useState("");
    const [debounced_purpose, setDebouncedPurpose] = useState("");
    const [downloading, setDownloading] = useState(false);
    const [confirm_open, setConfirmOpen] = useState(false);
    const dispatch = useDispatch();
    const { user, employee, isReady } = useCurrentEmployee();
    const sites = useSelector((store) => store.app.data?.sites);
    const { status, status_loading } = useSelector(
        (store) => store.coe_requests,
    );
    const is_limited = status?.can_generate === false;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedPurpose(purpose), 400);
        return () => clearTimeout(timer);
    }, [purpose]);

    useEffect(() => {
        if (open) dispatch(get_coe_status_thunk());
    }, [open, dispatch]);

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

    async function handleDownload() {
        setDownloading(true);
        let recorded = false;
        try {
            // The control number only exists once the request is recorded.
            const result = await dispatch(create_coe_request_thunk({ purpose }));
            if (create_coe_request_thunk.rejected.match(result)) {
                // On 429 the popup stays open and switches to the limit view.
                if (result.payload?.status !== 429) {
                    setConfirmOpen(false);
                    dispatch(
                        setAlert({
                            type: "error",
                            title: "Unable to generate COE",
                            message:
                                result.payload?.errors?.purpose?.[0] ??
                                result.payload?.message ??
                                "Please try again.",
                            open: true,
                        }),
                    );
                }
                return;
            }
            recorded = true;

            const blob = await pdf(
                <CoeDocument
                    {...coe_props}
                    purpose={purpose}
                    control_number={result.payload?.data?.control_no}
                />,
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = file_name;
            link.click();
            URL.revokeObjectURL(url);

            setConfirmOpen(false);
            dispatch(get_coe_status_thunk());
        } catch (error) {
            setConfirmOpen(false);
            if (recorded) dispatch(get_coe_status_thunk());
            dispatch(
                setAlert({
                    type: "error",
                    title: "Unable to generate COE",
                    message: recorded
                        ? "Your request was recorded but the PDF could not be prepared. Please contact HR."
                        : "Something went wrong while preparing the PDF.",
                    open: true,
                }),
            );
        } finally {
            setDownloading(false);
        }
    }

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
                        {is_limited ? (
                            <div
                                role="alert"
                                className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                            >
                                <Clock size={18} className="mt-0.5 shrink-0" />
                                <p>
                                    You can only generate a COE once every 24
                                    hours. Next available on{" "}
                                    <span className="font-medium">
                                        {moment(status.next_available_at).format(
                                            "MMM D, YYYY h:mm A",
                                        )}
                                    </span>
                                    .
                                </p>
                            </div>
                        ) : null}
                        <Select
                            name="coe_purpose"
                            label="Purpose of request"
                            options={PURPOSE_OPTIONS}
                            value={purpose}
                            onChange={setPurpose}
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
                            <Button
                                variant="success"
                                onClick={() => setConfirmOpen(true)}
                                disabled={!purpose || status_loading}
                                className="gap-2 px-5 py-2.5 rounded-lg"
                            >
                                <Download size={16} />
                                Download PDF
                            </Button>
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

            <Confirmation
                isOpen={confirm_open}
                onClose={() => {
                    if (!downloading) setConfirmOpen(false);
                }}
                title={is_limited ? "Daily limit reached" : "Generate your COE?"}
                width="sm:max-w-md"
            >
                <div className="flex flex-col gap-5 pb-1">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            {is_limited ? (
                                <Clock size={20} />
                            ) : (
                                <AlertCircle size={20} />
                            )}
                        </div>
                        {is_limited ? (
                            <p className="text-sm text-gray-600">
                                You can only generate a COE once a day (every
                                24 hours). Your next COE will be available on{" "}
                                <span className="font-medium text-gray-900">
                                    {moment(status?.next_available_at).format(
                                        "MMM D, YYYY h:mm A",
                                    )}
                                </span>
                                .
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600">
                                You can only generate a COE once a day (every
                                24 hours). Generating now will use today&apos;s
                                request for{" "}
                                <span className="font-medium text-gray-900">
                                    {purpose}
                                </span>
                                .
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            outlined
                            variant="secondary"
                            disabled={downloading}
                            onClick={() => setConfirmOpen(false)}
                            className="px-5 py-2.5 rounded-lg"
                        >
                            {is_limited ? "Close" : "Cancel"}
                        </Button>
                        {is_limited ? null : (
                            <Button
                                variant="success"
                                onClick={handleDownload}
                                loading={downloading}
                                className="gap-2 px-5 py-2.5 rounded-lg"
                            >
                                {downloading
                                    ? "Preparing..."
                                    : "Generate & Download"}
                            </Button>
                        )}
                    </div>
                </div>
            </Confirmation>
        </>
    );
}
