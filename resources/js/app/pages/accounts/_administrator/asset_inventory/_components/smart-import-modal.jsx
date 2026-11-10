import React, { useMemo, useState } from "react";
import {
    FiUpload,
    FiFileText,
    FiCheckCircle,
    FiAlertTriangle,
    FiArrowRight,
    FiArrowLeft,
    FiCpu,
} from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import Select from "@/app/_components/select";
import Badge from "@/app/_components/badge";
import Stepper from "@/app/_components/stepper";
import ProgressBar from "@/app/_components/progressbar";
import { cleanCell, readWorkbook } from "../_lib/excel-utils";

const STEPS = [
    { key: "upload", label: "Upload" },
    { key: "analyze", label: "Analyze" },
    { key: "preview", label: "Preview" },
    { key: "import", label: "Import" },
];

const MODULE_LABELS = {
    devices: "Devices",
    monitors: "Monitors",
    parts: "Parts & Accessories",
    other_assets: "Other Assets",
    peripherals: "Peripherals",
    unknown: "Needs review",
};

const MODULE_VARIANTS = {
    devices: "primary",
    monitors: "info",
    parts: "purple",
    other_assets: "warning",
    peripherals: "success",
    unknown: "danger",
};

const ROW_STATUS_VARIANTS = {
    ready: "success",
    invalid: "danger",
    unknown: "warning",
};

/**
 * Smart multi-module Excel import modal.
 *
 * Props:
 * - isOpen, onClose
 * - onAnalyze(rows): Promise<analysis>   — POST rows to /import/analyze
 * - onImport(modules): Promise<summary>  — POST routed rows to /import/commit
 * - onDone(summary)
 */
export default function SmartImportModal({
    isOpen,
    onClose,
    onAnalyze,
    onImport,
    onDone,
}) {
    const [step, setStep] = useState(0);
    const [workbook, setWorkbook] = useState(null);
    const [fileName, setFileName] = useState("");
    const [sheetName, setSheetName] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
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
        setAnalysis(null);
        setAnalyzing(false);
        setImporting(false);
        setSummary(null);
        setDragOver(false);
    };

    const handleClose = () => {
        if (analyzing || importing) return;
        reset();
        onClose?.();
    };

    const handleFile = async (file) => {
        if (!file) return;
        const wb = await readWorkbook(file);
        setWorkbook(wb);
        setFileName(file.name);
        setSheetName(wb.sheetNames[0]);
        setStep(1);
    };

    // Send raw rows to the analyze endpoint.
    const runAnalysis = async () => {
        setAnalyzing(true);
        try {
            const rawRows = sheetData.rows.map((raw) => {
                const row = {};
                Object.entries(raw).forEach(([header, value]) => {
                    row[cleanCell(header).toLowerCase().replace(/\s+/g, "_")] = cleanCell(value);
                });
                return row;
            });
            const result = await onAnalyze(rawRows);
            setAnalysis(result);
            setStep(2);
        } catch (error) {
            setSummary({ ok: false, message: error?.message || "Analysis failed." });
            setStep(3);
        } finally {
            setAnalyzing(false);
        }
    };

    // Group analyzed rows by module for the preview.
    const grouped = useMemo(() => {
        if (!analysis) return {};
        const map = {};
        analysis.rows.forEach((row, index) => {
            const key = row.module ?? "unknown";
            if (!map[key]) map[key] = [];
            map[key].push({ ...row, index });
        });
        return map;
    }, [analysis]);

    const readyCount = useMemo(() => {
        if (!analysis) return 0;
        return analysis.rows.filter((r) => r.status === "ready").length;
    }, [analysis]);

    const runImport = async () => {
        if (!analysis) return;
        setStep(3);
        setImporting(true);
        try {
            const modules = {};
            analysis.rows.forEach((row) => {
                if (row.status !== "ready" || !row.module || !row.payload) return;
                if (!modules[row.module]) modules[row.module] = { rows: [] };
                modules[row.module].rows.push(row.payload);
            });
            const result = await onImport(modules);
            setSummary({ ok: true, modules: result });
            onDone?.(result);
        } catch (error) {
            setSummary({ ok: false, message: error?.message || "Import failed." });
        } finally {
            setImporting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            width="max-w-4xl"
            title={
                <div>
                    <h2 className="flex items-center gap-2 text-[15px] font-semibold leading-snug text-neutral-800">
                        <FiCpu className="h-4 w-4 text-purple-600" />
                        Smart Import from Excel
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Upload your inventory — rows are routed to the right module automatically.
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
                            .xlsx, .xls, or .csv — PC, Monitor, Laptop, UPS, Cellphone, Mouse, Keyboard, Headset
                        </p>
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                        />
                    </label>
                )}

                {/* Step 2 — Analyze */}
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
                                    onChange={setSheetName}
                                />
                            </div>
                        </div>

                        <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-4">
                            <p className="flex items-center gap-2 text-sm font-medium text-purple-800">
                                <FiCpu className="h-4 w-4" />
                                AI-assisted routing
                            </p>
                            <p className="mt-1 text-xs text-purple-700">
                                Each row is classified into Devices, Monitors, Parts &amp; Accessories,
                                Other Assets, or Peripherals. Rows the rules can't classify are sent to
                                AI for a suggestion, with warnings for data problems.
                            </p>
                        </div>

                        <div className="flex justify-between border-t border-gray-100 pt-4">
                            <Button variant="light" outlined onClick={() => setStep(0)}>
                                <FiArrowLeft className="mr-1.5 h-4 w-4" />
                                Back
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={runAnalysis}
                                loading={analyzing}
                                disabled={analyzing}
                            >
                                Analyze {sheetData.rows.length} rows
                                <FiArrowRight className="ml-1.5 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3 — Preview */}
                {step === 2 && analysis && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(grouped).map(([module, rows]) => (
                                <Badge
                                    key={module}
                                    label={`${MODULE_LABELS[module] ?? module}: ${rows.length}`}
                                    variant={MODULE_VARIANTS[module] ?? "secondary"}
                                />
                            ))}
                            <Badge label={`${readyCount} ready`} variant="success" />
                            {analysis.ai_used && (
                                <Badge outlined label="AI assisted" variant="purple" />
                            )}
                        </div>

                        <div className="max-h-72 space-y-3 overflow-auto">
                            {Object.entries(grouped).map(([module, rows]) => (
                                <div
                                    key={module}
                                    className="rounded-xl border border-gray-200"
                                >
                                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-3 py-2">
                                        <span className="text-xs font-semibold text-gray-700">
                                            {MODULE_LABELS[module] ?? module}
                                        </span>
                                        <Badge
                                            outlined
                                            label={`${rows.filter((r) => r.status === "ready").length} ready`}
                                            variant="success"
                                        />
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {rows.slice(0, 10).map((row) => (
                                            <div
                                                key={row.index}
                                                className="flex items-center justify-between px-3 py-2"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <span className="font-mono text-xs text-gray-900">
                                                        {row.payload?.asset_tag || `Row ${row.index + 2}`}
                                                    </span>
                                                    {row.warnings?.length > 0 && (
                                                        <div className="mt-0.5 text-[11px] text-amber-600">
                                                            {row.warnings[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <Badge
                                                    outlined
                                                    label={row.status}
                                                    variant={ROW_STATUS_VARIANTS[row.status] ?? "secondary"}
                                                />
                                            </div>
                                        ))}
                                        {rows.length > 10 && (
                                            <p className="px-3 py-2 text-xs text-gray-400">
                                                + {rows.length - 10} more
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between border-t border-gray-100 pt-4">
                            <Button variant="light" outlined onClick={() => setStep(1)}>
                                <FiArrowLeft className="mr-1.5 h-4 w-4" />
                                Back
                            </Button>
                            <Button
                                variant="success"
                                disabled={readyCount === 0}
                                onClick={runImport}
                            >
                                <FiCheckCircle className="mr-1.5 h-4 w-4" />
                                Import {readyCount} rows
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4 — Import / summary */}
                {step === 3 && (
                    <div className="space-y-4">
                        {(importing || analyzing) && (
                            <div className="py-8 text-center">
                                <p className="text-sm font-medium text-gray-900">
                                    {analyzing ? "Analyzing rows…" : "Importing rows…"}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Keep this window open.
                                </p>
                                <div className="mx-auto mt-4 max-w-sm">
                                    <ProgressBar value={50} variant="success" />
                                </div>
                            </div>
                        )}

                        {!importing && !analyzing && summary && (
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
                                            <div className="mt-2 space-y-1">
                                                {Object.entries(summary.modules ?? {}).map(
                                                    ([module, result]) => (
                                                        <p
                                                            key={module}
                                                            className="text-sm text-green-700"
                                                        >
                                                            <span className="font-medium">
                                                                {MODULE_LABELS[module] ?? module}:
                                                            </span>{" "}
                                                            {result.imported} imported
                                                            {result.skipped?.length
                                                                ? ` · ${result.skipped.length} skipped`
                                                                : ""}
                                                        </p>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <p className="mt-1 text-sm text-red-700">
                                                {summary.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {!importing && !analyzing && (
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
