import React, { useRef, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Award } from "lucide-react";

// Register required components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

export default function BarGraphSection() {
    const [currentPage, setCurrentPage] = useState(0);
    const chartRef = useRef(null);

    const teamData = [
        { name: "John", pending: 8, resolved: 142, satisfaction: 96 },
        { name: "Maria", pending: 4, resolved: 175, satisfaction: 98 },
        { name: "Robert", pending: 6, resolved: 128, satisfaction: 92 },
        { name: "Lisa", pending: 5, resolved: 156, satisfaction: 95 },
        { name: "Michael", pending: 7, resolved: 133, satisfaction: 89 },
    ];

    const itemsPerPage = 5;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = teamData.slice(startIndex, endIndex);

    const data = {
        labels: currentData.map((item) => item.name),
        datasets: [
            {
                label: "Resolved Tickets",
                data: currentData.map((item) => item.resolved),
                backgroundColor: "#10B981",
                barThickness: 60,
            },
            {
                label: "Pending Tickets",
                data: currentData.map((item) => item.pending),
                backgroundColor: "#F59E0B",
                barThickness: 60,
            },

            {
                label: "Satisfaction Score",
                data: currentData.map((item) => item.satisfaction),
                backgroundColor: "#3B82F6",
                barThickness: 60,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const chart = chartRef.current;
                if (chart) {
                    chart.tooltip.setActiveElements(elements);
                    chart.setActiveElements(elements);
                    chart.update();
                }
            }
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    pointStyle: "rect",
                    padding: 20,
                    font: {
                        size: 13,
                        family: "'Inter', 'Helvetica', 'Arial', sans-serif",
                        weight: "500",
                    },
                    color: "#9CA3AF",
                    boxWidth: 14,
                    boxHeight: 14,
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                enabled: true,
                mode: "point",
                intersect: true,
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                titleColor: "#1F2937",
                bodyColor: "#6B7280",
                borderColor: "#E5E7EB",
                borderWidth: 1,
                padding: 16,
                displayColors: false,
                bodyFont: {
                    size: 13,
                    family: "'Inter', 'Helvetica', 'Arial', sans-serif",
                },
                titleFont: {
                    size: 15,
                    weight: "600",
                    family: "'Inter', 'Helvetica', 'Arial', sans-serif",
                },
                cornerRadius: 8,
                caretSize: 6,
                bodySpacing: 6,
                callbacks: {
                    title: function (context) {
                        return context[0].label;
                    },
                    label: function (context) {
                        const dataIndex = context.dataIndex;
                        const person = currentData[dataIndex];
                        return [
                            `Pending Tickets : ${person.pending}`,
                            `Resolved Tickets : ${person.resolved}`,
                            `Satisfaction Score : ${person.satisfaction}`,
                        ];
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 180,
                ticks: {
                    stepSize: 45,
                    color: "#9CA3AF",
                    font: {
                        size: 12,
                        family: "'Inter', 'Helvetica', 'Arial', sans-serif",
                    },
                    padding: 8,
                },
                grid: {
                    color: "#E5E7EB",
                    drawTicks: false,
                    drawBorder: false,
                    lineWidth: 1,
                },
                border: {
                    display: false,
                },
            },
            x: {
                ticks: {
                    color: "#9CA3AF",
                    font: {
                        size: 13,
                        family: "'Inter', 'Helvetica', 'Arial', sans-serif",
                    },
                    padding: 8,
                },
                grid: {
                    display: false,
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
            },
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
            },
        },
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border  border-gray-200 p-8 w-full">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                        <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Team Performance Comparison
                    </h2>
                </div>
            </div>

            <div className="h-[340px]">
                <Bar ref={chartRef} data={data} options={options} />
            </div>
        </div>
    );
}
