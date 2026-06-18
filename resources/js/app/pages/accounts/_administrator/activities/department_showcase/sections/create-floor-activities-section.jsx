import React from "react";
import Button from "@/app/_components/button";
import { FaPaperPlane } from "react-icons/fa";

export default function CreateFloorActivitiesSection() {
    return (
        <div>
            <Button variant="primary">
                <FaPaperPlane size={18} className="mr-2" />
                Create Floor Activity
            </Button>
        </div>
    );
}