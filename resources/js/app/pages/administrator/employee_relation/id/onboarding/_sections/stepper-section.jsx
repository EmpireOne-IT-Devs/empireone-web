import React, { useEffect, useState } from "react";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { router } from "@inertiajs/react";
import { MenuButton } from "@headlessui/react";
import Button from "@/app/_components/button";

const StepperSection = ({ steps }) => {
    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = searchParams.get("page");
    const [currentStep, setCurrentStep] = useState(pageParam ?? 1);
    const [complete, setComplete] = useState(false);

    // --- NEW: Read URL parameters on component mount ---
    useEffect(() => {
        if (pageParam) {
            const parsedPage = Number(pageParam);
            // Ensure the URL param is a valid number within your step range
            if (
                !isNaN(parsedPage) &&
                parsedPage >= 1 &&
                parsedPage <= steps.length
            ) {
                setCurrentStep(parsedPage);
            }
        }
    }, []);
    // ---------------------------------------------------

    const nextStep = (value) => {
        if (value < steps.length) {
            const targetStep = value + 1;
            window.location.href = `?page=${targetStep}`;
        } else {
            setComplete(true);
        }
    };

    const prevStep = (value) => {
        if (value > 1) {
            const targetStep = value - 1;
            window.location.href = `?page=${targetStep}`;
        }
    };

    return (
        <div className="w-full">
            {/* StepperSection Header */}
            <div className="flex justify-between items-center py-5">
                {steps.map((step, i) => (
                    <div
                        key={step.id}
                        className="relative flex flex-col items-center flex-1 group"
                    >
                        {/* Line connector */}
                        {i !== 0 && (
                            <div
                                className={`absolute w-full h-[2px] right-1/2 top-5 -translate-y-1/2 transition-colors duration-500
                ${currentStep > step.id || complete ? "bg-blue-600" : "bg-gray-200"}`}
                            />
                        )}

                        {/* Step Circle */}
                        <div
                            className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500
              ${
                  currentStep > step.id || complete
                      ? "bg-blue-600 border-blue-600"
                      : currentStep === step.id
                        ? "border-blue-600 bg-white text-blue-600"
                        : "bg-white border-gray-200 text-gray-400"
              }`}
                        >
                            {currentStep > step.id || complete ? (
                                <Check className="w-6 h-6 text-white" />
                            ) : (
                                <span className="font-semibold">{step.id}</span>
                            )}
                        </div>

                        {/* Label */}
                        <div
                            className={`mt-2 text-xs font-medium transition-colors duration-300
              ${currentStep >= step.id ? "text-blue-600" : "text-gray-400"}`}
                        >
                            {step.title}
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div>
                {!complete ? (
                    <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500 ">
                        {/* <h2 className="text-2xl font-bold text-gray-800 mb-2">{steps[currentStep - 1].title}</h2> */}
                        <div className="text-gray-500">
                            {steps[currentStep - 1].content}
                        </div>
                    </div>
                ) : (
                    <div className="text-center animate-bounce">
                        <h2 className="text-2xl font-bold text-green-600">
                            All Done! 🎉
                        </h2>
                        <div className="text-gray-500">
                            Your information has been successfully submitted.
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            {!complete && (
                <div className="absolute bottom-0 flex justify-between w-full p-20">
                    <Button
                    variant="outlined"
                        onClick={() => prevStep(currentStep)}
                        disabled={currentStep === 1}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </Button>

                    <Button onClick={() => nextStep(currentStep)}>
                        {currentStep === steps.length ? "Finish" : "Agree & Continue"}
                        {currentStep !== steps.length && (
                            <ChevronRight className="w-4 h-4 ml-1" />
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default StepperSection;
