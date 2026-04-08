import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

export default function ImportCsv() {
    const [data, setData] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setData(results.data);
                setStatus(
                    `Loaded ${results.data.length} rows. Ready to upload.`,
                );
            },
        });
    };

    const sendDataToApi = async () => {
        if (data.length === 0) return;

        setIsUploading(true);
        setStatus("Uploading...");

        try {
            axios.post("/api/merge_account", { items: data });
            setIsUploading(false);
        } catch (error) {
            setStatus("Upload failed: " + error.message);
            setIsUploading(false);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>CSV to API Upload</h2>

            <input type="file" accept=".csv" onChange={handleFileUpload} />

            <div style={{ margin: "20px 0" }}>
                <button
                    onClick={sendDataToApi}
                    disabled={data.length === 0 || isUploading}
                    style={{ padding: "10px 20px", cursor: "pointer" }}
                >
                    {isUploading ? "Uploading..." : "Send to API"}
                </button>
            </div>

            {status && (
                <p>
                    <strong>Status:</strong> {status}
                </p>
            )}
        </div>
    );
}
