import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { configureStore } from "@reduxjs/toolkit";
import * as inertia from "@inertiajs/react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(import.meta.url);
const axios = require("axios");
const { outputFiles } = await build({
    stdin: {
        contents: `
            export { default as reducer } from "./resources/js/app/redux/asset-purchase-request-slice";
            export * from "./resources/js/app/redux/asset-purchase-request-thunk";
            export { default as HeaderSection } from "./resources/js/app/pages/accounts/_administrator/asset_inventory/purchase_request/id/sections/header-section.jsx";
        `,
        resolveDir: root,
    },
    bundle: true,
    write: false,
    platform: "node",
    format: "cjs",
    jsx: "automatic",
    packages: "external",
    alias: { "@": path.join(root, "resources", "js") },
});
const loaded = { exports: {} };
// Inertia's CommonJS entry is marked as ESM; use its import entry for the render tests.
const requireForBundle = (id) => id === "@inertiajs/react" ? inertia : require(id);
new Function("require", "module", "exports", outputFiles[0].text)(requireForBundle, loaded, loaded.exports);
const {
    HeaderSection,
    reducer,
    create_asset_purchase_request_thunk,
    decide_asset_purchase_request_thunk,
    get_asset_purchase_request_thunk,
    list_asset_purchase_requests_thunk,
} = loaded.exports;

test("the request header shows only the rejected step's reason and only on a rejected request", () => {
    const approvals = [
        { status: "approved", remarks: "Previous approval note" },
        { status: "rejected", remarks: "Quote exceeds the budget.\nPlease revise it." },
    ];
    const renderHeader = (status) => renderToStaticMarkup(createElement(HeaderSection, {
        request: { id: "PR-202611-0001", status, approvals },
    }));

    const rejected = renderHeader("Rejected");
    assert.match(rejected, /<h2[^>]*>Reason for rejection<\/h2>/);
    assert.ok(rejected.includes(approvals[1].remarks));
    assert.doesNotMatch(rejected, /Previous approval note/);

    for (const status of ["Pending Approval", "In Progress", "Approved"]) {
        assert.doesNotMatch(renderHeader(status), /Reason for rejection|Quote exceeds the budget/);
    }
});

test("the request header explains when a rejected request has no saved reason", () => {
    const html = renderToStaticMarkup(createElement(HeaderSection, {
        request: { status: "Rejected", approvals: [{ status: "rejected", remarks: "  " }] },
    }));

    assert.match(html, /No reason was recorded\./);
});

function respond(config, data) {
    return { config, status: 200, statusText: "OK", headers: {}, data };
}

test("purchase request sends multipart data with or without the optional quotation", async () => {
    const original = axios.defaults.adapter;
    const calls = [];
    axios.defaults.adapter = async (config) => {
        calls.push(config);
        return respond(config, { data: { id: "PR-001" } });
    };
    try {
        const store = configureStore({ reducer });
        const values = { itemName: "Monitor", quantity: 2, unitPrice: 100 };
        await store.dispatch(create_asset_purchase_request_thunk(values)).unwrap();
        await store.dispatch(create_asset_purchase_request_thunk({
            ...values,
            supplierQuotation: new Blob(["quotation"], { type: "application/pdf" }),
        })).unwrap();
        assert.equal(calls[0].url, "/api/asset_inventory/purchase_requests");
        assert.equal(calls[0].data.get("quantity"), "2");
        assert.equal(calls[0].data.has("supplierQuotation"), false);
        assert.equal(calls[1].data.get("supplierQuotation").type, "application/pdf");
    } finally {
        axios.defaults.adapter = original;
    }
});

test("an older search response cannot replace newer purchase request results", async () => {
    const store = configureStore({ reducer });
    const thunk = list_asset_purchase_requests_thunk;
    store.dispatch(thunk.pending("older", { search: "old" }));
    store.dispatch(thunk.pending("newer", { search: "new" }));
    store.dispatch(thunk.fulfilled({ data: [{ id: "PR-002" }], meta: { total: 1 } }, "newer", { search: "new" }));
    store.dispatch(thunk.fulfilled({ data: [{ id: "PR-001" }], meta: { total: 1 } }, "older", { search: "old" }));
    assert.deepEqual(store.getState().list.items, [{ id: "PR-002" }]);
});

test("review submits the chosen step and a rejected decision leaves the displayed request unchanged", async () => {
    const original = axios.defaults.adapter;
    const detail = { uuid: "request-uuid", status: "In Progress", canAct: true };
    axios.defaults.adapter = async (config) => {
        if (config.method === "get") return respond(config, { data: detail });
        assert.equal(config.url, "/api/asset_inventory/purchase_requests/request-uuid/reject");
        assert.deepEqual(JSON.parse(config.data), { step: "finance", remarks: "" });
        throw { response: { status: 422, data: { message: "Invalid remarks.", errors: { remarks: ["Required."] } } } };
    };
    try {
        const store = configureStore({ reducer });
        await store.dispatch(get_asset_purchase_request_thunk(detail.uuid)).unwrap();
        await assert.rejects(
            store.dispatch(decide_asset_purchase_request_thunk({
                uuid: detail.uuid, decision: "reject", step: "finance", remarks: "",
            })).unwrap(),
            (error) => error.status === 422 && error.errors.remarks[0] === "Required.",
        );
        assert.deepEqual(store.getState().detail.request, detail);
    } finally {
        axios.defaults.adapter = original;
    }
});
