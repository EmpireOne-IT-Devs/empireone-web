import React, { useEffect, useState } from "react";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import Button from "@/app/_components/button";
import { useDispatch, useSelector } from "react-redux";
import { agree_onboarding_service } from "@/app/services/account-contract-service";
import { setAlert } from "@/app/redux/app-slice";
import { router } from "@inertiajs/react";
import moment from "moment";

const StepperSection = ({ steps }) => {
    const { loading, user } = useSelector((store) => store.app);
    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = searchParams.get("page");
    const [currentStep, setCurrentStep] = useState(Number(pageParam) || 1);
    const [complete, setComplete] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (pageParam) {
            const parsedPage = Number(pageParam);
            if (
                !isNaN(parsedPage) &&
                parsedPage >= 1 &&
                parsedPage <= steps.length
            ) {
                setCurrentStep(parsedPage);
            }
        }
    }, [pageParam, steps.length]);

    const nextStep = (value) => {
        if (value < steps.length) {
            const targetStep = value + 1;
            window.location.href = `?page=${targetStep}`;
        } else {
            setComplete(true);
        }
    };
    console.log("useruser", user?.account_employee?.onboarding_agree_on);

    const prevStep = (value) => {
        if (value > 1) {
            const targetStep = value - 1;
            window.location.href = `?page=${targetStep}`;
        }
    };

    async function submit_function(currentStep) {
        if (currentStep === steps.length) {
            try {
                setIsLoading(true);
                await agree_onboarding_service({
                    user_id: window.location.pathname.split("/")[3],
                    onboarding_agree_on: moment().format("LLL"),
                });
                dispatch(
                    setAlert({
                        type: "success",
                        title: "Onboarding is successfully signed!",
                        message: "Thank you for signing",
                        open: true,
                    }),
                );
                setIsLoading(false);
                router.visit(
                    `/accounts/${user?.role == 1 ? "administrator" : user?.role == 2 ? "employee" : "applicant"}/my_documents`,
                );
            } catch (error) {
                setIsLoading(false);
            }
        } else {
            nextStep(currentStep);
        }
    }
    return (
        <div className="flex flex-col md:flex-row w-full h-screen ">
            {/* --- STEPPER SIDEBAR (VERTICAL) --- */}
            <div className="flex-none w-full md:w-1/5 flex flex-col p-5 overflow-auto h-full border-b md:border-b-0 md:border-r border-gray-200">
                {steps.map((step, i) => (
                    <div
                        key={step.id}
                        className="relative flex items-start group pb-10"
                    >
                        {/* Vertical Line Connector */}
                        {i !== steps.length - 1 && (
                            <div
                                className={`absolute left-5 top-10 w-[2px] h-full -translate-x-1/2 transition-colors duration-500
                                ${currentStep > step.id || complete ? "bg-blue-600" : "bg-gray-200"}`}
                            />
                        )}

                        {/* Step Circle */}
                        <div
                            className={`relative  flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 transition-all duration-500
                            ${currentStep > step.id || complete
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

                        {/* Label & Description */}
                        <div className="ml-4 pt-1">
                            <div
                                className={`text-sm font-bold uppercase tracking-wide transition-colors duration-300
                                ${currentStep >= step.id ? "text-blue-600" : "text-gray-400"}`}
                            >
                                {step.title}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- CONTENT & CONTROLS AREA --- */}
            <div className="flex-1 flex flex-col relative pb-24">
                <div className="flex-1 absolute">
                    {!complete ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {steps[currentStep - 1].content}
                        </div>
                    ) : (
                        <div className="text-center animate-bounce mt-10">
                            <h2 className="text-2xl font-bold text-green-600">
                                All Done! 🎉
                            </h2>
                            <p className="text-gray-500">
                                Your information has been successfully
                                submitted.
                            </p>
                        </div>
                    )}
                </div>

                {/* Controls - Fixed to the bottom of the content area */}
                {!user?.account_employee?.onboarding_agree_on && (
                    <div className="fixed bottom-0 left-0 flex p-10 justify-between w-full pt-10">
                        <Button
                            variant="outlined"
                            onClick={() => prevStep(currentStep)}
                            disabled={currentStep === 1 || loading}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Back
                        </Button>

                        <Button
                            loading={isloading}
                            disabled={loading}
                            onClick={() => submit_function(currentStep)}
                        >
                            {currentStep === steps.length
                                ? "I Agree"
                                : "Agree & Continue"}
                            {currentStep !== steps.length && (
                                <ChevronRight className="w-4 h-4 ml-1" />
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StepperSection;
