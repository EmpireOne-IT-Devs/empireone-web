import React, { useRef, useState } from "react";
import { User, Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { upload_avatar_service } from "@/app/services/account-service";
import { get_app_data_thunk } from "@/app/redux/app-thunk";

export default function UploadProfileSection() {
    const { data } = useSelector((store) => store.app);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleAvatarClick = () => {
        if (!uploading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const uploadProfilePicture = async (file) => {
        setUploading(true);
        try {
            await upload_avatar_service(file);
            dispatch(get_app_data_thunk());
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadProfilePicture(file);
        }
        e.target.value = "";
    };
    return (
        <div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
            />

            <div
                className="w-[90px] h-[90px] rounded-full bg-gray-200 border-4 border-white flex items-center justify-center -mt-11 relative z-10 overflow-hidden group cursor-pointer shadow-sm"
                onClick={handleAvatarClick}
                title="Change profile picture"
            >
                {/* Avatar image or fallback */}
                {data?.user?.avatar ? (
                    <img
                        src={data.user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <User className="w-10 h-10 text-gray-400" />
                )}

                {/* Hover overlay — pointer-events enabled now */}
                {!uploading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                        <Camera className="w-5 h-5 text-white mb-1" />
                        <span className="text-[10px] text-white font-semibold text-center leading-tight px-1">
                            Update photo
                        </span>
                    </div>
                )}

                {/* Loading spinner overlay */}
                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
                        <svg
                            className="animate-spin h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}
