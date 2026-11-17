import { HiOutlineArrowLongLeft, HiOutlineArrowLongRight } from "react-icons/hi2";
import { Link } from "@inertiajs/react";

export default function Pagination({ data, onPageChange, variant = "light" }) {
    const currentPage = data?.current_page;
    const lastPage = data?.last_page;
    const maxVisiblePages = 5; // Maximum number of pages to show
    const isCustomPager = typeof onPageChange === "function";
    const isDark = variant === "dark";

    const navClass = isDark
        ? "inline-flex items-center rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-sm font-medium text-purple-100 transition-colors hover:border-orange-400/50 hover:bg-purple-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        : "inline-flex items-center border-transparent bg-purple-500 p-2 text-white rounded-md text-sm font-medium";
    const iconClass = isDark ? "text-purple-200" : "text-white";
    const pageClass = (page) => {
        if (!isDark) {
            return `inline-flex items-center rounded-md text-center px-4 p-2 text-sm font-medium ${currentPage === page
                ? "text-purple-600 border-purple-600 border-2 text-purple"
                : "bg-purple-500 hover:bg-purple-500 text-white"
                }`;
        }
        const base =
            "inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400";
        if (currentPage === page) {
            return `${base} bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)]`;
        }
        if (typeof page !== "number") {
            return `${base} cursor-default text-purple-300/50`;
        }
        return `${base} border border-purple-500/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/25`;
    };

    // PRO-TIP: This function grabs ALL current URL params and just updates the page.
    // Now you never have to hardcode `search`, `final_status`, etc. again!
    const buildUrl = (pageNumber) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", pageNumber);
        return `?${params.toString()}`;
    };

    const getPageNumbers = () => {
        const pages = [];

        if (lastPage <= maxVisiblePages) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", lastPage);
            } else if (currentPage > lastPage - 3) {
                pages.push(
                    1,
                    "...",
                    lastPage - 3,
                    lastPage - 2,
                    lastPage - 1,
                    lastPage
                );
            } else {
                pages.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    lastPage
                );
            }
        }

        return pages;
    };

    const handlePageClick = (page) => {
        if (!isCustomPager || typeof page !== "number" || page === currentPage) {
            return;
        }
        onPageChange(page);
    };

    return (
        <nav className="flex items-center justify-between px-4 sm:px-0 w-full">
            <div className="-mt-px flex w-0 flex-1">
                {currentPage > 1 && (
                    isCustomPager ? (
                        <button
                            type="button"
                            onClick={() => handlePageClick(currentPage - 1)}
                            className={navClass}
                        >
                            <HiOutlineArrowLongLeft
                                aria-hidden="true"
                                className={`mr-3 h-5 w-5 ${iconClass}`}
                            />
                            Previous
                        </button>
                    ) : (
                        <Link
                            href={buildUrl(currentPage - 1)}
                            className={navClass}
                        >
                            <HiOutlineArrowLongLeft
                                aria-hidden="true"
                                className={`mr-3 h-5 w-5 ${iconClass}`}
                            />
                            Previous
                        </Link>
                    )
                )}
            </div>

            <div className="hidden md:-mt-px md:flex gap-3">
                {getPageNumbers().map((page, index) => (
                    isCustomPager ? (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handlePageClick(page)}
                            disabled={typeof page !== "number"}
                            aria-current={currentPage === page ? "page" : undefined}
                            className={`${pageClass(page)} ${typeof page !== "number" && !isDark ? "cursor-default opacity-80" : ""}`}
                        >
                            {page}
                        </button>
                    ) : (
                        <Link
                            key={index}
                            href={typeof page === "number" ? buildUrl(page) : "#"}
                            className={pageClass(page)}
                        >
                            {page}
                        </Link>
                    )
                ))}
            </div>

            <div className="-mt-px flex flex-1 justify-end w-full">
                {currentPage < lastPage && (
                    isCustomPager ? (
                        <button
                            type="button"
                            onClick={() => handlePageClick(currentPage + 1)}
                            className={navClass}
                        >
                            Next
                            <HiOutlineArrowLongRight
                                aria-hidden="true"
                                className={`ml-3 h-5 w-5 ${iconClass}`}
                            />
                        </button>
                    ) : (
                        <Link
                            href={buildUrl(currentPage + 1)}
                            className={navClass}
                        >
                            Next
                            <HiOutlineArrowLongRight
                                aria-hidden="true"
                                className={`ml-3 h-5 w-5 ${iconClass}`}
                            />
                        </Link>
                    )
                )}
            </div>
        </nav>
    );
}