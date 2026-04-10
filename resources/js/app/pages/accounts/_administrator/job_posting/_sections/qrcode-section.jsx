import { QRCode, Typography, Space } from "antd";
import React from "react";

const { Text } = Typography;

export default function QrcodeSection() {
    return (
        <div className="flex gap-3">
            <Space direction="vertical" size="middle">
                <QRCode
                    errorLevel="H"
                    value="https://empireone-bpo.com/talent/application?source=facebook"
                    icon="/images/empireone.png"
                    // Optional: add status="active" if you want to use statusRender
                />
                {/* The Label */}
                <div className="text-center w-full">
                    Facebook
                </div>
            </Space>

            <Space direction="vertical" size="middle">
                <QRCode
                    errorLevel="H"
                    value="https://empireone-bpo.com/talent/application?source=linkedin"
                    icon="/images/empireone.png"
                    // Optional: add status="active" if you want to use statusRender
                />
                {/* The Label */}
                <div className="text-center w-full">
                    Linkedin
                </div>
            </Space>
        </div>
    );
}
