import { QRCode, Space, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";

export default function QrcodeSection() {
    // State to handle responsive QR size
    const [qrSize, setQrSize] = useState(300);

    useEffect(() => {
        const handleResize = () => {
            // If screen is small (less than 640px), shrink QR code to 250px
            setQrSize(window.innerWidth < 640 ? 350 : 500);
        };

        handleResize(); // Set initial size
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const downloadQRCode = (id, fileName) => {
        const canvas = document.getElementById(id)?.querySelector("canvas");
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.download = `${fileName}.png`;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        // flex-col for mobile, md:flex-row for desktop
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 p-6 md:p-10">
            
            {/* Facebook Section */}
            <Space direction="vertical" size="middle" align="center" className="w-full">
                <div id="fb-qr" className=" p-2">
                    <QRCode
                        errorLevel="H"
                        size={qrSize}
                        iconSize={qrSize / 4}
                        value="https://empireone-bpo.com/talent/application?source=facebook"
                        icon="/images/empireone.png"
                    />
                </div>
                <div className="text-center w-full font-bold text-lg">
                    Facebook
                </div>
                <Button
                    type="primary"
                    block // Makes button full width on mobile within the Space container
                    icon={<DownloadOutlined />}
                    onClick={() => downloadQRCode("fb-qr", "facebook-qr")}
                >
                    Download
                </Button>
            </Space>

            {/* LinkedIn Section */}
            <Space direction="vertical" size="middle" align="center" className="w-full">
                <div id="li-qr" className=" p-2">
                    <QRCode
                        errorLevel="H"
                        size={qrSize}
                        iconSize={qrSize / 4}
                        value="https://empireone-bpo.com/talent/application?source=linkedin"
                        icon="/images/empireone.png"
                    />
                </div>
                <div className="text-center w-full font-bold text-lg">
                    LinkedIn
                </div>
                <Button
                    type="primary"
                    block
                    icon={<DownloadOutlined />}
                    onClick={() => downloadQRCode("li-qr", "linkedin-qr")}
                >
                    Download
                </Button>
            </Space>
        </div>
    );
}