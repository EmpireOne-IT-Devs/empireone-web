import { usePopper } from "react-popper";
import React from "react";
import { createPortal } from "react-dom"; // <-- Import createPortal
import { FcDown, FcLeft, FcRight, FcUp } from "react-icons/fc";

export default function Tooltip({
    title,
    children,
    position = "right",
    isShow = true,
}) {
    const [show, setShow] = React.useState(false);
    const [referenceElement, setReferenceElement] = React.useState(null);
    const [popperElement, setPopperElement] = React.useState(null);

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: position,
        // Optional: Add a slight offset modifier if the arrow overlaps too much
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 4],
                },
            },
        ],
    });

    // Extract the popper content into a variable
    const tooltipContent = show && isShow ? (
        <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            // Use an ultra-high z-index just to be safe
            className="flex items-center justify-center z-[9999]"
        >
            {position == "right" && <FcLeft className="text-4xl" />}
            {position == "top" && <FcDown className="text-4xl" />}
            {position == "left" && <FcRight className="text-4xl" />}
            {position == "bottom" && <FcUp className="text-4xl" />}
            <div className="bg-gray-800 text-white px-2 py-1 flex items-center justify-center rounded w-full whitespace-nowrap">
                {title?.replace(/ /g, "\u00A0")}
            </div>
        </div>
    ) : null;

    return (
        <>
            <div
                ref={setReferenceElement}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {children}
            </div>

            {/* Render the tooltip using a Portal attached to the document body */}
            {tooltipContent && typeof document !== 'undefined'
                ? createPortal(tooltipContent, document.body)
                : null}
        </>
    );
}