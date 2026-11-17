export function peso_format(value) {
    if (value === null || value === undefined || value === "") return "";

    // 1. Clean the input (allow numbers AND the decimal point)
    let parsedNumber = value;
    if (typeof value === "string") {
        parsedNumber = parseFloat(value.replace(/[^0-9.]/g, ""));
    }

    // 2. Fallback if the parsing fails
    if (isNaN(parsedNumber)) return "";

    // 3. Format as a clean number with commas and 2 decimals (No symbol)
    return new Intl.NumberFormat("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(parsedNumber);
}
