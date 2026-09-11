import React from "react";
import { FaClock } from "react-icons/fa6";

export default function OvertimeSection() {
    return (
        <div>
            <button
                title="Overtime"
                className="p-1 rounded-md hover:bg-blue-500 text-white bg-blue-400"
            >
                <FaClock />
            </button>
        </div>
    );
}
