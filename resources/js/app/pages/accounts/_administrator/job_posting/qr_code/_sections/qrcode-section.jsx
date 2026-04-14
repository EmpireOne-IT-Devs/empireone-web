import { QRCode, Space, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";

const SOURCES = [
  {
    id: "fb-qr",
    label: "Facebook",
    fileName: "facebook-qr",
    value: "https://empireone-bpo.com/talent/application?source=facebook",
  },
  {
    id: "li-qr",
    label: "LinkedIn",
    fileName: "linkedin-qr",
    value: "https://empireone-bpo.com/talent/application?source=linkedin",
  },
  {
    id: "indeed-qr",
    label: "Indeed",
    fileName: "indeed-qr",
    value: "https://empireone-bpo.com/talent/application?source=indeed",
  },
];

export default function QrcodeSection() {
  const [qrSize, setQrSize] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      setQrSize(window.innerWidth < 640 ? 250 : 350);
    };
    handleResize();
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
    <div className="flex flex-col sm:flex-row flex-wrap items-start justify-center gap-6 p-6 md:p-10">
      {SOURCES.map(({ id, label, fileName, value }) => (
        <div
          key={id}
          className="flex flex-col items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full sm:w-auto"
        >
          <div id={id} className="rounded-lg overflow-hidden">
            <QRCode
              errorLevel="H"
              size={qrSize}
              iconSize={qrSize / 4}
              value={value}
              icon="/images/empireone.png"
            />
          </div>
          <span className="font-semibold text-base text-gray-800">{label}</span>
          <Button
            type="primary"
            block
            icon={<DownloadOutlined />}
            onClick={() => downloadQRCode(id, fileName)}
          >
            Download
          </Button>
        </div>
      ))}
    </div>
  );
}git