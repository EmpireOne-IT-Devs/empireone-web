import Button from "@/app/_components/button";
import {
    AlertCircle,
    Edit2,
    Mail,
    User,
    X,
    Camera,
    PencilLine,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function HeaderSection({ editing, setEditing }) {
    const { data } = useSelector((store) => store.app);
    const profileCompletion = 20;

    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const handleClick = () => {
        if (editing) fileInputRef.current.click();
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };
    const [showESignature, setShowESignature] = useState(false);
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mx-auto">
            <div className="h-28 bg-gradient-to-r from-blue-500 via-purple-600 to-purple-700" />

            <div className="px-6 pb-5">
                <div
                    onClick={handleClick}
                    className={`w-[90px] h-[90px] rounded-full bg-gray-200 border-4 border-white flex items-center justify-center -mt-11 relative z-10 overflow-hidden group ${
                        editing ? "cursor-pointer" : ""
                    }`}
                >
                    <User className="w-10 h-10 text-gray-400" />

                </div>

                <div className="flex justify-between items-end mt-2">
                    {/* Left: Applicant info */}
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {data?.user?.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5 text-gray-500 text-xs">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {data?.user?.email}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="/applicant/my_profile/signature"
                            onClick={() => setShowESignature(true)}
                            target="_blank"
                            className="p-1.5 flex gap-1 border border-purple-500 bg-purple-600 rounded-md items-center justify-center text-white"
                        >
                            <PencilLine className="w-3.5 h-3.5 mr-2" />
                            E-Signature
                        </a>
                    </div>
                </div>

                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-800">
                            Complete Your Profile
                        </span>
                    </div>

                    <p className="text-xs text-gray-600 mb-3">
                        Fill in your First Name, Last Name, Email, Contact
                        Number, and upload your Resume to complete your profile.
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                style={{ width: `${profileCompletion}%` }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                            {profileCompletion}%
                        </span>
                    </div>

                    <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <span>💡</span>
                        <em>
                            Tip: Completing your profile to 100% increases your
                            chances of getting hired!
                        </em>
                    </p>
                </div>
            </div>
        </div>
    );
}
