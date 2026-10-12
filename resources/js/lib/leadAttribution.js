const STORAGE_KEY = "lead_attribution";
const EXPIRY_DAYS = 30;
const FALLBACK_SOURCE = "direct/unknown";
const UTM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
];

// In-app browsers (LinkedIn, Instagram, TikTok) can block localStorage, so a cookie mirrors it.
const readCookie = () => {
    try {
        const match = document.cookie
            .split("; ")
            .find((c) => c.startsWith(`${STORAGE_KEY}=`));
        return match
            ? JSON.parse(decodeURIComponent(match.split("=").slice(1).join("=")))
            : null;
    } catch {
        return null;
    }
};

const writeCookie = (value) => {
    try {
        const maxAge = EXPIRY_DAYS * 24 * 60 * 60;
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `${STORAGE_KEY}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
    } catch {
        // Best-effort only.
    }
};

const readStorage = () => {
    try {
        return JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    } catch {
        return null;
    }
};

const writeStorage = (value) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
        // Best-effort only.
    }
};

const isExpired = (record) =>
    !record?.expires_at || Date.now() > record.expires_at;

const readRecord = () => {
    const record = readStorage() ?? readCookie();
    return record && !isExpired(record) ? record : null;
};

const hasUtm = (record) => UTM_KEYS.some((key) => Boolean(record?.[key]));

const clean = (value) => String(value ?? "").trim().slice(0, 255);

const buildRecord = () => {
    const params = new URLSearchParams(window.location.search);
    const record = {
        landing_page: window.location.pathname,
        referrer: clean(document.referrer),
        captured_at: new Date().toISOString(),
        expires_at: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    };
    UTM_KEYS.forEach((key) => {
        const value = clean(params.get(key));
        if (value) record[key] = value;
    });
    return record;
};

/**
 * First-touch capture. UTM data is never overwritten by a later visit;
 * a UTM-less record is only upgraded when UTMs show up.
 */
export function captureLeadAttribution() {
    if (typeof window === "undefined") return null;

    const existing = readRecord();
    const incoming = buildRecord();

    if (existing && (hasUtm(existing) || !hasUtm(incoming))) {
        return existing;
    }

    writeStorage(incoming);
    writeCookie(incoming);
    return incoming;
}

export function getLeadAttributionFields() {
    const record =
        typeof window === "undefined" ? null : readRecord() ?? buildRecord();

    const lead_source = hasUtm(record)
        ? [
              record.utm_source,
              record.utm_medium,
              record.utm_campaign,
              record.utm_content,
          ]
              .filter(Boolean)
              .join(" / ")
        : FALLBACK_SOURCE;

    return {
        lead_source,
        utm_source: record?.utm_source ?? "",
        utm_medium: record?.utm_medium ?? "",
        utm_campaign: record?.utm_campaign ?? "",
        utm_content: record?.utm_content ?? "",
        utm_term: record?.utm_term ?? "",
        lead_referrer: record?.referrer || clean(document.referrer),
        lead_landing_page: record?.landing_page ?? "",
    };
}
