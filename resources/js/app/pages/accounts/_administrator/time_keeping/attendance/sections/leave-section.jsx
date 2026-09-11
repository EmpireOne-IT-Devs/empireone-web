import React from "react";
import { FaClock } from "react-icons/fa6";

export default function LeaveSection() {
    return (
        <div>
            <button
                title="Leave"
                className="p-1 rounded-md hover:bg-green-500 text-white bg-green-400"
            >
                <FaClock />
            </button>
        </div>
    );
}
