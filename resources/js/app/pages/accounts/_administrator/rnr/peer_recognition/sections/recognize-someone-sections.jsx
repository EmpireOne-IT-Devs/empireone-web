import React from "react";
import { FiStar as SparklesIcon } from "react-icons/fi";
import CreateCertificateSection from "./create-certificate-section";

export default function RecognizeSomeoneSections() {
    return (
        <div>
            <div className="mt-4 flex items-center justify-between gap-4 border-b border-gray-100 p-2 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500">
                        <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Recognize a Colleague
                        </h2>
                        <p className="text-sm text-gray-500">
                            Issue a certificate to someone who made your week
                            better
                        </p>
                    </div>
                </div>
                <CreateCertificateSection />
            </div>
        </div>
    );
}