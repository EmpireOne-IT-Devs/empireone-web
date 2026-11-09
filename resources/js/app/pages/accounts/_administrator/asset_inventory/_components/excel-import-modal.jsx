import React, { useMemo, useState } from "react";
import {
    FiUpload,
    FiFileText,
    FiCheckCircle,
    FiAlertTriangle,
    FiArrowRight,
    FiArrowLeft,
    FiDownload,
} from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import Select from "@/app/_components/select";
import Badge from "@/app/_components/badge";
import Stepper from "@/app/_components/stepper";
import ProgressBar from "@/app/_components/progressbar";
import {
    autoMapHeader,
    cleanCell,
    readWorkbook,
    scoreSheet,
} from "../_lib/excel-utils";

const STEPS = [
    { key: "upload", label: "Upload" },
    { key: "map", label: "Map columns" },
    { key: "preview", label: "Preview" },
    { key: "import", label: "Import" },
];

const ROW_STATUS_VARIANTS = {
    ready: "success",
    invalid: "danger",
    duplicate: "warning",
    routed: "info",
};

/**
 * Reusable Excel import modal.
 *
 * Props:
 * - isOpen, onClose
 * - title: string
 * - fields: [{ key, label, required, synonyms: [] }]  — target schema
 * - transformRow(mappedRow): { row, errors: [] }      — normalize + validate one row
 * - routeRow(row): null | { key, label }              — row belongs to another module
 * - onImport(rows): Promise<summary>                  — receives ready rows
 * - onDone(summary)                                   — after a successful import
 */
export default function ExcelImportModal({
    isOpen,
    onClose,
    title = "Import from Excel",
    fields = [],
    transformRow,
    routeRow,
    onImport,
    onDone,
}) {
    const [step, setStep] = useState(0);
    const [workbook, setWorkbook] = useState(null);
    const [fileName, setFileName] = useState("");
    const [sheetName, setSheetName] = useState("");
    const [mapping, setMapping] = useState({});
    const [importing, setImporting] = useState(false);
    const [summary, setSummary] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const sheetData = useMemo(() => {
        if (!workbook || !sheetName) return { headers: [], rows: [] };
        return workbook.getRows(sheetName);
    }, [workbook, sheetName]);

    const reset = () => {
        setStep(0);
        setWorkbook(null);
        setFileName("");
        setSheetName("");
        setMapping({});
        setImporting(false);
        setSummary(null);
        setDragOver(false);
    };

    const handleClose = () => {
        if (importing) return;
        reset();
        onClose?.();
    };

    const handleFile = async (file) => {
        if (!file) return;
        const wb = await readWorkbook(file);
        setWorkbook(wb);
        setFileName(file.name);

        // Auto-pick the sheet whose headers best match the target fields.
        let best = wb.sheetNames[0];
        let bestScore = -1;
        for (const name of wb.sheetNames) {
            const { headers } = wb.getRows(name);
            const score = scoreSheet(headers, fields);
            if (score > bestScore) {
                bestScore = score;
                best = name;
            }
        }
        setSheetName(best);

        const { headers } = wb.getRows(best);
        const auto = {};
        fields.forEach((field) => {
            auto[field.key] = autoMapHeader(headers, field.synonyms);
        });
        setMapping(auto);
        setStep(1);
    };

    const changeSheet = (name) => {
        setSheetName(name);
        const { headers } = workbook.getRows(name);
        const auto = {};
        fields.forEach((field) => {
            auto[field.key] = autoMapHeader(headers, field.synonyms);
        });
        setMapping(auto);
    };

    // Build normalized + validated rows from the current mapping.
    const prepared = useMemo(() => {
        if (step < 2) return { rows: [], counts: {} };

        const seen = new Set();
        const counts = { ready: 0, invalid: 0, duplicate: 0, routed: 0 };
        const rows = sheetData.rows.map((raw, index) => {
            const mapped = {};
            fields.forEach((field) => {
                const header = mapping[field.key];
                mapped[field.key] = header ? cleanCell(raw[header]) : "";
            });

            const routed = routeRow?.(mapped) ?? null;
            if (routed) {
                counts.routed++;
                return { index, mapped, status: "routed", routed, errors: [] };
            }

            const { row, errors } = transformRow(mapped);
            if (errors.length) {
                counts.invalid++;
                return { index, mapped, status: "invalid", errors };
            }

            const dedupeKey = row.asset_tag || row.serial_number || "";
            if (dedupeKey && seen.has(dedupeKey)) {
                counts.duplicate++;
                return { index, mapped, status: "duplicate", errors: ["Duplicate in file"] };
            }
            if (dedupeKey) seen.add(dedupeKey);

            counts.ready++;
            return { index, mapped, status: "ready", row, errors: [] };
        });

        return { rows, counts };
    }, [step, sheetData, mapping, fields, transformRow, routeRow]);

    const runImport = async () => {
        const readyRows = prepared.rows
            .filter((r) => r.status === "ready")
            .map((r) => r.row);
        setStep(3);
        setImporting(true);
        try {
            const result = await onImport(readyRows);
            setSummary({ ok: true, ...result });
            onDone?.(result);
        } catch (error) {
            setSummary({
                ok: false,
                message: error?.message || "Import failed.",
                failed: error?.failed || [],
                partial: error?.partial || null,
            });
        } finally {
            setImporting(false);
        }
    };

    const downloadErrors = () => {
        const lines = ["row,issue"];
        prepared.rows
            .filter((r) => r.status !== "ready")
            .forEach((r) => {
                const issue =
                    r.status === "routed"
                        ? `Belongs to ${r.routed.label}`
                        : r.errors.join("; ");
                lines.push(`${r.index + 2},"${issue.replace(/"/g, '""')}"`);
            });
        const blob = new Blob([lines.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName.replace(/\.[^.]+$/, "")}-import-issues.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const headerOptions = [
        { label: "— Not mapped —", value: "" },
        ...sheetData.headers.map((h) => ({ label: h, value: h })),
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            width="max-w-3xl"
            title={
                <div>
                    <h2 className="flex items-center gap-2 text-[15px] font-semibold leading-snug text-neutral-800">
                        <FiUpload className="h-4 w-4 text-purple-600" />
                        {title}
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Upload an .xlsx / .xls / .csv file, map its columns, then import.
                    </p>
                </div>
            }
        >
            <div className="mt-4 p-2">
                <Stepper
                    steps={STEPS}
                    currentStep={step}
                    orientation="horizontal"
                    className="mb-6"
                />

                {/* Step 1 — Upload */}
                {step === 0 && (
                    <label
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            handleFile(e.dataTransfer.files?.[0]);
                        }}
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
                            dragOver
                                ? "border-purple-400 bg-purple-50"
                                : "border-gray-300 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/40"
                        }`}
                    >
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                            <FiFileText className="h-7 w-7" />
                        </span>
                        <p className="mt-4 text-sm font-semibold text-gray-900">
                            Drop your Excel file here, or click to browse
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            .xlsx, .xls, or .csv — the best-matching sheet is auto-selected
                        </p>
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                        />
                    </label>
                )}

                {/* Step 2 — Map columns */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-900">{fileName}</span>{" "}
                                — {sheetData.rows.length} rows detected
                            </p>
                            <div className="w-full sm:w-64">
                                <Select
                                    label="Worksheet"
                                    name="import_sheet"
                                    options={workbook.sheetNames.map((n) => ({
                                        label: n,
                                        value: n,
                                    }))}
                                    value={sheetName}
                                    onChange={changeSheet}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {fields.map((field) => (
                                <Select
                                    key={field.key}
                                    label={`${field.label}${field.required ? " *" : ""}`}
                                    name={`map_${field.key}`}
                                    options={headerOptions}
                                    value={mapping[field.key] ?? ""}
                                    onChange={(value) =>
                                        setMapping((prev) => ({ ...prev, [field.key]: value }))
                                    }
                                />
                            ))}
                        </div>

                        <div className="flex justify-between border-t border-gray-100 pt-4">
                            <Button variant="light" outlined onClick={() => setStep(0)}>
                                <FiArrowLeft className="mr-1.5 h-4 w-4" />
                                Back
                            </Button>
                            <Button variant="secondary" onClick={() => setStep(2)}>
                                Preview rows
                                <FiArrowRight className="ml-1.5 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3 — Preview */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Badge label={`${prepared.counts.ready ?? 0} ready`} variant="success" />
                            <Badge
                                label={`${prepared.counts.duplicate ?? 0} duplicate in file`}
                                variant="warning"
                            />
                            <Badge
                                label={`${prepared.counts.invalid ?? 0} invalid`}
                                variant="danger"
                            />
                            <Badge
                                label={`${prepared.counts.routed ?? 0} for other modules`}
                                variant="info"
                            />
                        </div>

                        <div className="max-h-72 overflow-auto rounded-xl border border-gray-200">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-xs font-semibold text-gray-500">#</th>
                                        {fields.slice(0, 4).map((f) => (
                                            <th
                                                key={f.key}
                                                className="px-3 py-2 text-xs font-semibold text-gray-500"
                                            >
                                                {f.label}
                                            </th>
                                        ))}
                                        <th className="px-3 py-2 text-xs font-semibold text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {prepared.rows.slice(0, 50).map((r) => (
                                        <tr key={r.index}>
                                            <td className="px-3 py-2 text-xs text-gray-400">
                                                {r.index + 2}
                                            </td>
                                            {fields.slice(0, 4).map((f) => (
                                                <td key={f.key} className="px-3 py-2 text-xs text-gray-700">
                                                    {r.mapped[f.key] || "—"}
                                                </td>
                                            ))}
                                            <td className="px-3 py-2">
                                                <Badge
                                                    outlined
                                                    label={
                                                        r.status === "routed"
                                                            ? `→ ${r.routed.label}`
                                                            : r.status
                                                    }
                                                    variant={ROW_STATUS_VARIANTS[r.status]}
                                                />
                                                {r.errors.length > 0 && (
                                                    <div className="mt-0.5 text-[11px] text-red-500">
                                                        {r.errors[0]}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {prepared.rows.length > 50 && (
                                <p className="border-t border-gray-100 px-3 py-2 text-xs text-gray-400">
                                    Showing first 50 of {prepared.rows.length} rows
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col justify-between gap-2 border-t border-gray-100 pt-4 sm:flex-row">
                            <div className="flex gap-2">
                                <Button variant="light" outlined onClick={() => setStep(1)}>
                                    <FiArrowLeft className="mr-1.5 h-4 w-4" />
                                    Back
                                </Button>
                                {(prepared.counts.invalid > 0 ||
                                    prepared.counts.duplicate > 0 ||
                                    prepared.counts.routed > 0) && (
                                    <Button variant="light" outlined onClick={downloadErrors}>
                                        <FiDownload className="mr-1.5 h-4 w-4" />
                                        Issues CSV
                                    </Button>
                                )}
                            </div>
                            <Button
                                variant="success"
                                disabled={(prepared.counts.ready ?? 0) === 0}
                                onClick={runImport}
                            >
                                <FiCheckCircle className="mr-1.5 h-4 w-4" />
                                Import {prepared.counts.ready ?? 0} rows
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4 — Import / summary */}
                {step === 3 && (
                    <div className="space-y-4">
                        {importing && (
                            <div className="py-8 text-center">
                                <p className="text-sm font-medium text-gray-900">
                                    Importing rows…
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Rows are sent in chunks — keep this window open.
                                </p>
                                <div className="mx-auto mt-4 max-w-sm">
                                    <ProgressBar value={50} variant="success" />
                                </div>
                            </div>
                        )}

                        {!importing && summary && (
                            <div
                                className={`rounded-2xl border p-5 ${
                                    summary.ok
                                        ? "border-green-200 bg-green-50/60"
                                        : "border-red-200 bg-red-50/60"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {summary.ok ? (
                                        <FiCheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                                    ) : (
                                        <FiAlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
                                    )}
                                    <div className="flex-1">
                                        <h3
                                            className={`text-sm font-semibold ${
                                                summary.ok ? "text-green-800" : "text-red-800"
                                            }`}
                                        >
                                            {summary.ok ? "Import complete" : "Import failed"}
                                        </h3>
                                        {summary.ok ? (
                                            <p className="mt-1 text-sm text-green-700">
                                                {summary.imported} imported
                                                {summary.skipped?.length
                                                    ? ` · ${summary.skipped.length} skipped (duplicates)`
                                                    : ""}
                                            </p>
                                        ) : (
                                            <p className="mt-1 text-sm text-red-700">
                                                {summary.message}
                                                {summary.partial?.imported
                                                    ? ` ${summary.partial.imported} rows were imported before the failure.`
                                                    : ""}
                                            </p>
                                        )}
                                        {summary.skipped?.length > 0 && (
                                            <p className="mt-1 text-xs text-green-600">
                                                First skipped:{" "}
                                                {summary.skipped
                                                    .slice(0, 3)
                                                    .map((s) => `${s.asset_tag} (${s.reason})`)
                                                    .join(", ")}
                                                {summary.skipped.length > 3 ? "…" : ""}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {!importing && (
                            <div className="flex justify-end border-t border-gray-100 pt-4">
                                <Button variant="secondary" onClick={handleClose}>
                                    Done
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}
