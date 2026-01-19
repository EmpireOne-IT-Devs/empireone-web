import Tooltip from "@/app/_components/tooltip";
import React from "react";
import { TbEye } from "react-icons/tb";

export default function ViewJobPostingDetailsSection() {
    return (
        <div>
            {/* <Tooltip title={"View Job Posting Details"}> */}
                <button>
                    <TbEye className="cursor-pointer text-blue-500 hover:text-blue-600" />
                </button>
            {/* </Tooltip> */}
        </div>
    );
}
