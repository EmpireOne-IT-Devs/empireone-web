const ALLOWED_TAGS = new Set([
    "P", "BR", "STRONG", "B", "EM", "I", "U", "S", "DEL", "INS", "SUB", "SUP",
    "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "LI", "A", "SPAN",
    "BLOCKQUOTE", "PRE", "CODE", "DIV", "HR",
]);

// Removed together with their content; any other unknown tag is unwrapped.
const DROPPED_TAGS = new Set([
    "SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "SVG", "MATH", "TEMPLATE",
    "NOSCRIPT", "LINK", "META", "FORM", "INPUT", "BUTTON", "TEXTAREA", "SELECT",
]);

const SAFE_HREF = /^(https?:|mailto:|tel:|#|\/)/i;
const UNSAFE_STYLE = /url\s*\(|expression|javascript:|behavior/i;

export const RICH_TEXT_CLASSES =
    "break-words text-sm leading-relaxed text-gray-600 " +
    "[&_p]:mb-2 [&_p:last-child]:mb-0 [&_div]:mb-2 " +
    "[&_ul]:mb-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 " +
    "[&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 " +
    "[&_li]:pl-0.5 [&_li::marker]:text-indigo-400 " +
    "[&_h1]:mb-2 [&_h1]:mt-3 [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-gray-900 " +
    "[&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-[15px] [&_h2]:font-bold [&_h2]:text-gray-900 " +
    "[&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-800 " +
    "[&_h4]:mb-1.5 [&_h4]:mt-2 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-gray-800 " +
    "[&>*:first-child]:mt-0 " +
    "[&_strong]:font-semibold [&_strong]:text-gray-800 [&_b]:font-semibold [&_b]:text-gray-800 " +
    "[&_a]:font-medium [&_a]:text-indigo-600 [&_a]:underline " +
    "[&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-200 [&_blockquote]:pl-3 [&_blockquote]:italic " +
    "[&_pre]:my-2 [&_pre]:whitespace-pre-wrap [&_pre]:rounded-lg [&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:text-xs " +
    "[&_hr]:my-3 [&_hr]:border-gray-200";

export function isHtml(value) {
    return /<\/?[a-z][^>]*>/i.test(value ?? "");
}

function parse(html) {
    return new DOMParser().parseFromString(html, "text/html").body;
}

export function sanitizeHtml(html) {
    if (!html) return "";
    const body = parse(html);

    Array.from(body.querySelectorAll("*")).forEach((el) => {
        if (!ALLOWED_TAGS.has(el.tagName)) {
            if (DROPPED_TAGS.has(el.tagName)) el.remove();
            else el.replaceWith(...el.childNodes);
            return;
        }

        Array.from(el.attributes).forEach(({ name, value }) => {
            const keep =
                (name === "style" && !UNSAFE_STYLE.test(value)) ||
                (name === "href" && el.tagName === "A" && SAFE_HREF.test(value.trim()));
            if (!keep) el.removeAttribute(name);
        });

        if (el.tagName === "A") {
            el.setAttribute("target", "_blank");
            el.setAttribute("rel", "noopener noreferrer");
        }
    });

    return body.innerHTML;
}

export function htmlToPlainText(value) {
    if (!value) return "";
    if (!isHtml(value)) return value.replace(/\s+/g, " ").trim();

    const spaced = value.replace(/<(br|hr)[^>]*>|<\/(p|li|h[1-6]|div|blockquote|pre)>/gi, " ");
    return (parse(spaced).textContent ?? "").replace(/\s+/g, " ").trim();
}
