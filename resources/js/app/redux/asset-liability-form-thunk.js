import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    act_on_liability_form_service,
    get_liability_form_service,
    get_paper_scan_service,
    list_liability_forms_service,
    record_paper_liability_service,
    search_paper_employees_service,
} from "@/app/services/asset-liability-form-service";

function liabilityThunk(name, service, fallback) {
    return createAsyncThunk(`assetLiabilityForms/${name}`, async (input, { rejectWithValue, signal }) => {
        try {
            return await service(input, signal);
        } catch (error) {
            const status = error.response?.status;
            const data = error.response?.data;
            return rejectWithValue({
                status,
                message: status === 413 ? "The scan is too large for the server to accept."
                    : status < 500 && typeof data?.message === "string" ? data.message : fallback,
                errors: status === 422 ? data?.errors ?? {} : {},
            });
        }
    });
}

export const list_liability_forms_thunk = liabilityThunk("list", list_liability_forms_service, "Unable to load forms.");
export const get_liability_form_thunk = liabilityThunk("detail", get_liability_form_service, "Unable to load this form.");
export const act_on_liability_form_thunk = liabilityThunk("action", act_on_liability_form_service, "Unable to complete this action.");
export const search_paper_employees_thunk = liabilityThunk("paperEmployees", search_paper_employees_service, "Unable to search employees.");
export const record_paper_liability_thunk = liabilityThunk("recordPaper", record_paper_liability_service, "Unable to record the paper form.");
export const download_paper_scan_thunk = liabilityThunk("downloadPaperScan", async (uuid) => {
    const { blob, name } = await get_paper_scan_service(uuid);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}, "Unable to download the paper scan.");
