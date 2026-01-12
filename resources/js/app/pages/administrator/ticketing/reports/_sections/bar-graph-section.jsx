// BarGraphSection.js
import React from "react";
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

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Sales",
      data: [400, 300, 500, 200, 600, 700],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Monthly Sales Bar Chart",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function BarGraphSection() {
  return <Bar data={data} options={options} />;
}
