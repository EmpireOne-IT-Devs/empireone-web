import React from "react";
import { FaClock } from "react-icons/fa6";

export default function CorrectionSection() {
    return (
        <div>
            <button
                title="Correction"
                className="p-1 rounded-md hover:bg-green-500 text-white bg-green-400"
            >
                <FaClock />
            </button>
        </div>
    );
}
