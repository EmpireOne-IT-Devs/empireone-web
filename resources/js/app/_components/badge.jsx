export default function Badge({
    label = "Badge",
    variant = "primary",
    outlined = false,
    showDot = false,
    icon: Icon,
    className = "",
    underline = false,
}) {
    const base =
        "inline-flex items-center gap-x-1.5 rounded-x px-2 py-1 text-xs font-medium";

    const variants = {
        primary: {
            solid: "rounded-md border border-blue-500 bg-blue-500 text-white",
            outline: "text-blue-500 inset-ring inset-ring-blue-300",
            dot: "fill-blue-500",
            underline:
                "underline decoration-blue-500 decoration-2 underline-offset-2",
        },
        secondary: {
            solid: "rounded-md border border-gray-500 bg-gray-500 text-white",
            outline: "text-gray-500 inset-ring inset-ring-gray-300",
            dot: "fill-gray-500",
            underline:
                "underline decoration-gray-500 decoration-2 underline-offset-2",
        },
        success: {
            solid: "rounded-md border border-green-500 bg-green-500 text-white",
            outline: "text-green-500 inset-ring inset-ring-green-300",
            dot: "fill-green-500",
            underline:
                "underline decoration-green-500 decoration-2 underline-offset-2",
        },
        warning: {
            solid: "rounded-md border border-yellow-500 bg-yellow-500 text-white",
            outline: "text-yellow-500 inset-ring inset-ring-yellow-300",
            dot: "fill-yellow-500",
            underline:
                "underline decoration-yellow-500 decoration-2 underline-offset-2",
        },
        danger: {
            solid: "rounded-md border border-red-500 bg-red-500 text-white",
            outline: "text-red-500 inset-ring inset-ring-red-300",
            dot: "fill-red-500",
            underline:
                "underline decoration-red-500 decoration-2 underline-offset-2",
        },
        info: {
            solid: "rounded-md border border-orange-500 bg-orange-500 text-white",
            outline: "text-orange-500 inset-ring inset-ring-orange-300",
            dot: "fill-orange-500",
            underline:
                "underline decoration-orange-500 decoration-2 underline-offset-2",
        },
        purple: {
            solid: "rounded-md border border-purple-500 bg-purple-200 text-purple",
            outline: "text-purple-500 inset-ring inset-ring-purple-300",
            dot: "fill-purple-500",
            underline:
                "underline decoration-purple-500 decoration-2 underline-offset-2",
        },
    };

    const style = variants[variant] ?? variants.primary;

    return (
        <span
            className={`capitalize ${base} ${
                outlined ? style.outline : style.solid
            } ${underline ? style.underline : ""} ${className}`}
        >
            {showDot && (
                <svg
                    viewBox="0 0 6 6"
                    aria-hidden="true"
                    className={`size-1.5 ${style.dot}`}
                >
                    <circle r={3} cx={3} cy={3} />
                </svg>
            )}
            {Icon && <Icon size={12} className="shrink-0" />}
            {label}
        </span>
    );
}