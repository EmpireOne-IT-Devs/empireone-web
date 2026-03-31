import React from "react";
import { MessageCircle } from "lucide-react";

export default function HeaderSection() {
    return (
        <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">
                        The Engagement Floor
                    </h1>
                    <p className="text-sm text-gray-500">
                        Stay connected with company news, events, and celebrate
                        achievements
                    </p>
                </div>
            </div>
        </div>
    );
}
