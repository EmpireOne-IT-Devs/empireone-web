
export function peso_format(value) {
    if (!value) return "";
    const number = value.replace(/[^0-9]/g, "");
    return new Intl.NumberFormat("en-PH").format(number);
}