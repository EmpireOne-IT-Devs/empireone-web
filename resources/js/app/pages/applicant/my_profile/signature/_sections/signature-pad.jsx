import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Trash2, PenTool, MousePointer2, Upload, Pen } from "lucide-react";
import { FaRegSave } from "react-icons/fa";
import { save_signature_service } from "@/app/services/account-service";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";

const SignaturePad = () => {
    const sigCanvas = useRef({});
    const [imageURL, setImageURL] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [loading, setLoading] = useState(false);
    const { data } = useSelector((store) => store.app);
    const dispatch = useDispatch();
    // Fixed professional settings
    const PEN_COLOR = "#000000";
    const PEN_WEIGHT = 3;

    useEffect(() => {
        const updateSize = () => {
            setDimensions({
                width:
                    window.innerWidth > 800
                        ? window.innerWidth
                        : window.innerWidth,
                height: window.innerHeight,
            });
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const defaultSignature = data?.user?.account_employee?.signature ?? null;

    useEffect(() => {
        if (sigCanvas.current && defaultSignature) {
            const canvas = sigCanvas.current.getCanvas();
            const ctx = canvas.getContext("2d");
            const img = new Image();

            img.onload = () => {
                // Calculate aspect ratio
                const imgAspect = img.width / img.height;
                const canvasAspect = canvas.width / canvas.height;

                let drawWidth, drawHeight;
                if (imgAspect > canvasAspect) {
                    drawWidth = canvas.width * 0.8; // 80% of canvas width
                    drawHeight = drawWidth / imgAspect;
                } else {
                    drawHeight = canvas.height * 0.8; // 80% of canvas height
                    drawWidth = drawHeight * imgAspect;
                }

                const offsetX = (canvas.width - drawWidth) / 2;
                const offsetY = (canvas.height - drawHeight) / 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

                setImageURL(defaultSignature); // hide placeholder
            };

            img.src = defaultSignature; // Base64 PNG from DB
        }
    }, [defaultSignature]);

    const clear = () => {
        sigCanvas.current.clear();
        setImageURL(null);
    };
    const handleSubmit = async () => {
        if (sigCanvas.current.isEmpty()) {
            alert(
                "Please provide a signature first. or please click the clear button.",
            );
            return;
        }

        const signatureData = sigCanvas.current.toDataURL("image/png");
        try {
            setLoading(true);
            await save_signature_service({
                signature: signatureData,
            });
            await dispatch(
                setAlert({
                    type: "success",
                    title: "Signature save successfully!",
                }),
            );
            setLoading(false);
            console.log("Signature Value:", signatureData);
        } catch (error) {}
    };

    return (
        <div className="h-screen w-full flex flex-col items-center font-sans bg-slate-50">
            {/* Ultra-Minimalist Header */}
            <div className="fixed w-full flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <PenTool className="text-blue-600" size={24} />
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                        E-Signature
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={clear}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={18} /> Clear
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`flex items-center gap-2 px-8 py-2 text-sm font-bold text-white rounded-full shadow-lg transition-all active:scale-95 ${
                            loading
                                ? "bg-slate-400"
                                : "bg-slate-900 hover:bg-black shadow-slate-200"
                        }`}
                    >
                        {loading ? (
                            "Submitting..."
                        ) : (
                            <>
                                <FaRegSave size={18} /> Save
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="bg-gray-100 border ">
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor={PEN_COLOR}
                    minWidth={PEN_WEIGHT}
                    maxWidth={PEN_WEIGHT + 1}
                    canvasProps={{  
                        width: dimensions.width,
                        height: dimensions.height,
                        className: "cursor-crosshair w-full",
                    }}
                    onBegin={() => {
                        // Remove the placeholder immediately when user starts signing
                        if (!imageURL) setImageURL("signed"); // temporary value just to hide placeholder
                    }}
                />

                {!imageURL && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <Pen size={60} className="opacity-5 mb-4" />
                        <p className="text-slate-300 font-medium text-lg">
                            Sign Here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignaturePad;
