import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import Module from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("../../", import.meta.url));
const filename = path.join(root, "resources/js/app/pages/accounts/_employee/rnr/challenge_event/page.jsx");
const stubs = {
    "@inertiajs/react": "export const usePage = () => ({ url: globalThis.challengeTestUrl });",
    "react-redux": "export const useDispatch = () => () => {};",
    "@/app/_hooks/use-current-employee": "export default () => globalThis.challengeTestEmployee;",
    "@/app/redux/engagement-thunk": "export const get_my_engagement_reward_challenges_thunk = () => {};",
    "@/app/pages/accounts/layout": "export default ({ children }) => children;",
    "../layout": "export default ({ children }) => children;",
    "./sections/challenge-event-section": "export default () => 'CHALLENGE_LIST';",
    "./sections/manager-view-section": "export default () => 'MANAGER_DASHBOARD';",
};

const result = await build({
    entryPoints: [filename],
    bundle: true,
    write: false,
    platform: "node",
    format: "cjs",
    packages: "external",
    plugins: [{
        name: "stub-page-dependencies",
        setup(build) {
            build.onResolve({ filter: /.*/ }, ({ path: name }) => (
                Object.hasOwn(stubs, name) ? { path: name, namespace: "stub" } : null
            ));
            build.onLoad({ filter: /.*/, namespace: "stub" }, ({ path: name }) => ({
                contents: stubs[name],
                loader: "js",
            }));
        },
    }],
});

const compiled = new Module(filename);
compiled.filename = filename;
compiled.require = createRequire(import.meta.url);
compiled._compile(result.outputFiles[0].text, filename);
const Page = compiled.exports.default;

test("shared challenge links show the challenge list for employee managers", () => {
    globalThis.challengeTestEmployee = { isReady: true, isContentManager: true };
    globalThis.challengeTestUrl = "/accounts/employee/rnr/challenge_event?challenge=6";
    assert.match(renderToStaticMarkup(React.createElement(Page)), /CHALLENGE_LIST/);

    globalThis.challengeTestUrl = "/accounts/employee/rnr/challenge_event";
    assert.match(renderToStaticMarkup(React.createElement(Page)), /MANAGER_DASHBOARD/);
});

test("ordinary employees see the challenge list on shared and ordinary URLs", () => {
    globalThis.challengeTestEmployee = { isReady: true, isContentManager: false };
    for (const url of [
        "/accounts/employee/rnr/challenge_event?challenge=6",
        "/accounts/employee/rnr/challenge_event",
    ]) {
        globalThis.challengeTestUrl = url;
        assert.match(renderToStaticMarkup(React.createElement(Page)), /CHALLENGE_LIST/);
    }
});
