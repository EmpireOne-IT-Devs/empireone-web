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

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const data = {
  labels: ["Electronics", "Clothing", "Food", "Others"],
  datasets: [
    {
      label: "Category Distribution",
      data: [40, 25, 20, 15],
      backgroundColor: [
        "rgba(59, 130, 246, 0.7)",
        "rgba(34, 197, 94, 0.7)",
        "rgba(234, 179, 8, 0.7)",
        "rgba(239, 68, 68, 0.7)",
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Sales by Category",
    },
  },
};

export default function PieGraphSection() {
  return <Pie data={data} options={options} />;
}
