import assert from "node:assert/strict";
import { createRequire } from "node:module";
import Module from "node:module";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("../../", import.meta.url));
const filename = path.join(root, "resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/proof-section.jsx");
const result = await build({
    entryPoints: [filename],
    bundle: true,
    write: false,
    platform: "node",
    format: "cjs",
    packages: "external",
    alias: { "@": path.join(root, "resources", "js") },
    plugins: [{
        name: "test-modal",
        setup(build) {
            build.onResolve({ filter: /^@\/app\/_components\/modal$/ }, () => ({
                path: "modal",
                namespace: "test",
            }));
            build.onLoad({ filter: /.*/, namespace: "test" }, () => ({
                contents: `
                    import React from "react";
                    export default function Modal({ isOpen, title, width, children }) {
                        return isOpen ? <section data-modal-width={width}>{title}{children}</section> : null;
                    }
                `,
                loader: "jsx",
                resolveDir: root,
            }));
        },
    }],
});

const compiled = new Module(filename);
compiled.filename = filename;
compiled.require = createRequire(import.meta.url);
compiled._compile(result.outputFiles[0].text, filename);
const ProofSection = compiled.exports.default;

function render(media) {
    return renderToStaticMarkup(React.createElement(ProofSection, {
        submission: {
            id: 1,
            status: "submitted",
            submission_media: media,
            employee: { name: "Employee", email: "employee@example.test" },
            challenge: { title: "Challenge", points: 50 },
            submitted_at: "2026-11-12T12:00:00Z",
            challenge_description: "Proof details",
        },
        onClose() {},
        onApprove() {},
        onDecline() {},
    }));
}

test("video uses the full media column with native playback controls", () => {
    const html = render([{ type: "video", url: "/proof.mp4" }]);
    assert.match(html, /data-modal-width="max-w-4xl"/);
    assert.match(html, /aspect-video[^"]*sm:col-span-2/);
    assert.match(html, /<video[^>]*src="\/proof.mp4"[^>]*controls=""/);
    assert.match(html, /<video[^>]*playsinline=""/i);
    assert.match(html, /<video[^>]*object-contain[^>]*aria-label="Submission video proof 1"/);
    assert.match(html, /Review Submission/);
    assert.match(html, /Bonus Points/);
    assert.match(html, /Approve/);
    assert.match(html, /Decline/);
});

test("image proofs retain the existing preview layout", () => {
    const html = render([
        { type: "image", url: "/first.jpg" },
        { type: "image", url: "/second.jpg" },
    ]);
    assert.match(html, /data-modal-width="max-w-2xl"/);
    assert.match(html, /sm:grid-cols-2/);
    assert.doesNotMatch(html, /sm:col-span-2/);
    assert.match(html, /aria-label="Preview submission image 1"/);
    assert.match(html, /aria-label="Preview submission image 2"/);
    assert.doesNotMatch(html, /<video/);
});

test("a video spans the media grid when mixed with images", () => {
    const html = render([
        { type: "image", url: "/first.jpg" },
        { type: "video", url: "/proof.mp4" },
    ]);
    assert.match(html, /data-modal-width="max-w-4xl"/);
    assert.match(html, /sm:col-span-2/);
    assert.match(html, /aria-label="Preview submission image 1"/);
    assert.match(html, /aria-label="Submission video proof 2"/);
});
