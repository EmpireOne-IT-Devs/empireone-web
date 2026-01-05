import { useState } from "react";

export default function Accordion({ items = [], single = true }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleIndex = (index) => {
        if (single) {
            setOpenIndex(openIndex === index ? null : index);
        } else {
            setOpenIndex((prev = []) =>
                prev.includes(index)
                    ? prev.filter((i) => i !== index)
                    : [...prev, index]
            );
        }
    };

    return (
        <div className="rounded-xl border border-default overflow-hidden shadow-sm">
            {items.map((item, index) => {
                const isOpen = single
                    ? openIndex === index
                    : openIndex?.includes(index);

                return (
                    <div key={index}>
                        <h2 id={`accordion-heading-${index}`}>
                            <button
                                type="button"
                                onClick={() => toggleIndex(index)}
                                aria-expanded={isOpen}
                                aria-controls={`accordion-body-${index}`}
                                className="flex items-center justify-between w-full p-5 font-medium text-body gap-3
                           hover:text-heading hover:bg-neutral-secondary-medium border-b"
                            >
                                <svg
                                    className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                                        isOpen ? "rotate-0" : "rotate-180"
                                    }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 15l7-7 7 7"
                                    />
                                </svg>
                                <div className="flex w-full">{item.title}</div>
                            </button>
                        </h2>

                        {/* Animated content */}
                        <div
                            id={`accordion-body-${index}`}
                            aria-labelledby={`accordion-heading-${index}`}
                            className={`
                grid transition-all duration-300 ease-in-out
                ${
                    isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                }
              `}
                        >
                            <div className="overflow-hidden ">
                                <div className="p-4 md:p-5">{item.content}</div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
