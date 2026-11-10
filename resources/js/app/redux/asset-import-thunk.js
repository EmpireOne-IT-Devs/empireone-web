import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    analyze_import_service,
    commit_import_service,
} from "@/app/services/asset-import-service";

const toError = (error, fallback) => ({
    message: error.response?.data?.message || fallback,
    errors: error.response?.data?.errors || {},
});

const CHUNK_SIZE = 200;

export const analyze_import_thunk = createAsyncThunk(
    "assetImport/analyze",
    async (rows, { rejectWithValue }) => {
        // Chunk to stay under the 500-row request cap on the analyze endpoint.
        const merged = { rows: [], grouped: {}, ai_used: false };
        try {
            for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
                const chunk = rows.slice(i, i + CHUNK_SIZE);
                const result = await analyze_import_service(chunk);
                merged.rows.push(...(result.rows ?? []));
                Object.entries(result.grouped ?? {}).forEach(([key, count]) => {
                    merged.grouped[key] = (merged.grouped[key] ?? 0) + count;
                });
                merged.ai_used = merged.ai_used || Boolean(result.ai_used);
            }
            return merged;
        } catch (error) {
            return rejectWithValue(toError(error, "Unable to analyze the file."));
        }
    },
);

export const commit_import_thunk = createAsyncThunk(
    "assetImport/commit",
    async (modules, { rejectWithValue }) => {
        // Chunk each module's rows to stay under the 500-row request cap.
        const summary = {};
        try {
            for (const [module, payload] of Object.entries(modules)) {
                const rows = payload.rows || [];
                const moduleSummary = { imported: 0, skipped: [] };
                for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
                    const chunk = rows.slice(i, i + CHUNK_SIZE);
                    const result = await commit_import_service({
                        [module]: { rows: chunk },
                    });
                    const mod = result.modules?.[module];
                    moduleSummary.imported += mod?.imported ?? 0;
                    moduleSummary.skipped.push(...(mod?.skipped ?? []));
                }
                summary[module] = moduleSummary;
            }
            return summary;
        } catch (error) {
            return rejectWithValue(toError(error, "Import failed."));
        }
    },
);
