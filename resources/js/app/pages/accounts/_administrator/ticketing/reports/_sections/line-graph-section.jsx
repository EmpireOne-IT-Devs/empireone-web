// LineChart.js
import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FaArrowTrendUp } from "react-icons/fa6";

// Register components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

export default function LineGraphSection() {
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Resolved",
                data: [140, 168, 152, 188, 218, 195],
                borderColor: "#10b981",
                backgroundColor: "#10b981",
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "#10b981",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                borderWidth: 2.5,
            },
            {
                label: "Total Tickets",
                data: [145, 175, 155, 195, 228, 185],
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f6",
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "#3b82f6",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                borderWidth: 2.5,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#6b7280",
                    font: {
                        size: 13,
                        family: "'Inter', 'Helvetica', 'Arial', sans-serif",
                    },
                    usePointStyle: true,
                    pointStyle: "circle",

                    padding: 15,
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: "white",
                titleColor: "#374151",
                bodyColor: "#6b7280",
                borderColor: "#e5e7eb",
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                boxPadding: 6,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 240,
                ticks: {
                    stepSize: 60,
                    color: "#6b7280",
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    color: "#e5e7eb",
                    drawTicks: false,
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
            },
            x: {
                ticks: {
                    color: "#6b7280",
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    color: "#e5e7eb",
                    drawTicks: false,
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border p-6 w-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <FaArrowTrendUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-md  text-gray-700">
                    Ticket Trends{" "}
                    <span className="text-gray-500 text-md font-normal">
                        (Last 6 Months)
                    </span>
                </h2>
            </div>

            {/* Chart */}
            <div className="h-[300px]">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
