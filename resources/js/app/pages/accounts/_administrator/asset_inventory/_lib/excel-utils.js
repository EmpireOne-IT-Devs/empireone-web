import * as XLSX from "xlsx";

// Reads a File into a workbook. Returns { sheetNames, getRows(sheetName) }.
export async function readWorkbook(file) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array", cellDates: false });

    return {
        sheetNames: workbook.SheetNames,
        getRows(sheetName) {
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) return { headers: [], rows: [] };
            const grid = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
            const headers = (grid[0] || []).map((h) => String(h ?? "").trim());
            const rows = grid
                .slice(1)
                .map((cells) => {
                    const row = {};
                    headers.forEach((header, i) => {
                        if (header) row[header] = cells[i];
                    });
                    return row;
                })
                .filter((row) =>
                    Object.values(row).some((v) => String(v ?? "").trim() !== ""),
                );
            return { headers: headers.filter(Boolean), rows };
        },
    };
}

// Normalizes a header for matching: lowercase, strip non-alphanumerics.
export function normalizeHeader(value) {
    return String(value ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
}

// Picks the best-matching header for a target field from a synonym list.
export function autoMapHeader(headers, synonyms) {
    const normalized = headers.map((h) => ({ raw: h, norm: normalizeHeader(h) }));
    for (const synonym of synonyms) {
        const target = normalizeHeader(synonym);
        const exact = normalized.find((h) => h.norm === target);
        if (exact) return exact.raw;
    }
    for (const synonym of synonyms) {
        const target = normalizeHeader(synonym);
        const partial = normalized.find(
            (h) => h.norm.includes(target) || target.includes(h.norm),
        );
        if (partial) return partial.raw;
    }
    return "";
}

// Scores a sheet by how many target fields auto-map onto its headers.
export function scoreSheet(headers, fields) {
    return fields.reduce(
        (score, field) => score + (autoMapHeader(headers, field.synonyms) ? 1 : 0),
        0,
    );
}

// Converts an Excel serial date (or string) to YYYY-MM-DD. Returns null when empty/invalid.
export function excelDateToISO(value) {
    if (value === null || value === undefined || value === "") return null;

    // cleanCell() stringifies cells, so accept numeric strings too.
    const num = typeof value === "number" ? value : Number(String(value).trim());
    if (Number.isFinite(num) && num > 20000 && num < 80000) {
        // Excel serial date (1900 date system).
        const epoch = new Date(Date.UTC(1899, 11, 30));
        const date = new Date(epoch.getTime() + num * 86400000);
        return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

// Strips invisible characters Excel exports sometimes carry (LRM, NBSP, etc.).
export function cleanCell(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/[‎‏​﻿]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
