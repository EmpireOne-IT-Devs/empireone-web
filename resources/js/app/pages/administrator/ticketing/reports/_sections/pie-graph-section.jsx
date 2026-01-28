// PieChart.js
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { FaChartPie } from "react-icons/fa6";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function PieGraphSection() {
  const data = {
    labels: ["High", "Medium", "Low", "None"],
    datasets: [
      {
        label: "Priority",
        data: [42, 28, 18, 12],
        backgroundColor: [
          "#6B9BF5", // Blue - High
          "#6BD98D", // Green - Medium
          "#ECC550", // Yellow - Low
          "#F38989", // Red/Pink - None
        ],
        borderColor: "#FFFFFF",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "rect",
          padding: 15,
          font: {
            size: 13,
            family: "'Inter', 'Helvetica', 'Arial', sans-serif",
          },
          color: "#6b7280",
          boxWidth: 12,
          boxHeight: 12,
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
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FaChartPie className="w-5 h-5 text-blue-600" />
        <h2 className="text-md text-gray-700 ">Priority Distribution</h2>
      </div>

      {/* Chart */}
      <div className="max-w-[300px] mx-auto flex items-center justify-center">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}