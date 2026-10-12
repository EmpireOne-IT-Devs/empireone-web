import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import Module from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(import.meta.url);
const axios = require("axios");

async function load(relativePath) {
    const filename = path.join(root, relativePath);
    const result = await build({
        entryPoints: [filename],
        bundle: true,
        write: false,
        platform: "node",
        format: "cjs",
        packages: "external",
        loader: { ".js": "jsx" },
        jsx: "automatic",
        alias: { "@": path.join(root, "resources", "js") },
    });
    const compiled = new Module(filename);
    compiled.filename = filename;
    compiled.require = require;
    compiled._compile(result.outputFiles[0].text, filename);
    return compiled.exports;
}

const slice = await load("resources/js/app/redux/location-employee-slice.js");
const Component = (await load(
    "resources/js/app/pages/accounts/_employee/rnr/my_profile/sections/employee-test.jsx",
)).default;
const services = await load("resources/js/app/services/location-employee-service.js");

function makeStore(state = {}) {
    return configureStore({
        reducer: { location_employees: slice.default },
        preloadedState: {
            location_employees: {
                locations: [],
                loading: false,
                error: null,
                exporting: false,
                exportError: null,
                ...state,
            },
        },
    });
}

function render(state) {
    return renderToStaticMarkup(React.createElement(
        Provider,
        { store: makeStore(state) },
        React.createElement(Component),
    ));
}

function setAxiosAdapter(handler) {
    axios.defaults.adapter = async (config) => ({
        config,
        status: 200,
        statusText: "OK",
        headers: {},
        data: await handler(config),
    });
}

test("location service requests authenticated count data and a location-scoped CSV blob", async () => {
    const requests = [];
    setAxiosAdapter((config) => {
        requests.push(config);
        return config.responseType === "blob" ? "csv-data" : {
            data: [{ id: 1, name: "San Carlos", employee_count: 3 }],
        };
    });

    assert.deepEqual(await services.get_location_employee_counts_service(), [
        { id: 1, name: "San Carlos", employee_count: 3 },
    ]);
    const exported = await services.export_location_employees_service(1);
    assert.equal(exported.blob, "csv-data");
    assert.equal(requests[0].url, "/api/locations/employee-counts");
    assert.equal(requests[1].url, "/api/locations/1/employees/export");
    assert.equal(requests[1].responseType, "blob");
});

test("location cards show employee totals and export only the selected location", () => {
    const html = render({
        locations: [
            { id: 1, name: "San Carlos", employee_count: 3 },
            { id: 2, name: "Carcar", employee_count: 5 },
        ],
    });

    assert.match(html, /Employees by location/);
    assert.match(html, /Total employees/);
    assert.match(html, /aria-pressed="true"/);
    assert.match(html, /Export San Carlos CSV/);
    assert.match(html, /San Carlos/);
    assert.match(html, /Carcar/);
});

test("location panel reports loading, errors, and empty state accessibly", () => {
    assert.match(render({ loading: true }), /aria-busy="true"/);
    assert.match(render({ error: "Could not load locations." }), /role="alert"/);
    assert.match(render({ error: "Could not load locations." }), /Try again/);
    assert.match(render(), /No locations found/);
    assert.match(render(), /Refresh locations/);
});
