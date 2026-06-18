import { usePopper } from "react-popper";
import React from "react";
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

    // Set placement to "right"
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: position,
    });

    return (
        <>
            <div
                ref={setReferenceElement}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {children}
            </div>
            {show && isShow && (
                <div
                    ref={setPopperElement}
                    style={styles.popper}
                    {...attributes.popper}
                    className="flex items-center justify-center"
                >
                    {position == "right" && <FcLeft className="text-4xl" />}
                    {position == "top" && <FcDown className="text-4xl" />}
                    {position == "left" && <FcRight className="text-4xl" />}
                    {position == "bottom" && <FcUp className="text-4xl" />}
                    <div className="bg-gray-800 text-white px-2 py-1 flex items-center justify-center rounded w-full">
                        {title?.replace(/ /g, "\u00A0")}
                    </div>
                </div>
            )}
        </>
    );
}
