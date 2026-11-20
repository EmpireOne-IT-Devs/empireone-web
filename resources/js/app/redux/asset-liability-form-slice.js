import { createSlice } from "@reduxjs/toolkit";
import {
    act_on_liability_form_thunk,
    get_liability_form_thunk,
    list_liability_forms_thunk,
} from "./asset-liability-form-thunk";

const liabilityForms = createSlice({
    name: "assetLiabilityForms",
    initialState: {
        list: { items: [], meta: null, loading: true, error: null },
        detail: { uuid: null, form: null, loading: true, error: null },
    },
    reducers: {
        clear_liability_form_detail(state, { payload }) {
            if (state.detail.uuid === payload) state.detail = { uuid: null, form: null, loading: true, error: null };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(list_liability_forms_thunk.pending, (state, { meta }) => {
                Object.assign(state.list, { requestId: meta.requestId, loading: true, error: null });
            })
            .addCase(list_liability_forms_thunk.fulfilled, (state, { meta, payload }) => {
                if (state.list.requestId !== meta.requestId) return;
                Object.assign(state.list, { items: payload.data, meta: payload.meta, loading: false });
            })
            .addCase(list_liability_forms_thunk.rejected, (state, { meta, payload }) => {
                if (state.list.requestId !== meta.requestId || meta.aborted) return;
                Object.assign(state.list, { items: [], meta: null, loading: false, error: payload });
            })
            .addCase(get_liability_form_thunk.pending, (state, { meta }) => {
                state.detail = { uuid: meta.arg, requestId: meta.requestId, form: null, loading: true, error: null };
            })
            .addCase(get_liability_form_thunk.fulfilled, (state, { meta, payload }) => {
                if (state.detail.requestId !== meta.requestId) return;
                Object.assign(state.detail, { form: payload.data, loading: false });
            })
            .addCase(get_liability_form_thunk.rejected, (state, { meta, payload }) => {
                if (state.detail.requestId !== meta.requestId || meta.aborted) return;
                Object.assign(state.detail, { loading: false, error: payload });
            })
            .addCase(act_on_liability_form_thunk.fulfilled, (state, { payload, meta }) => {
                if (state.detail.uuid !== meta.arg.uuid) return;
                Object.assign(state.detail, { requestId: null, form: payload.data, loading: false, error: null });
            });
    },
});

export const { clear_liability_form_detail } = liabilityForms.actions;
export default liabilityForms.reducer;
