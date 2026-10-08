import React, { useState } from "react";
import Table from "@/app/_components/Table"; // Adjust path as needed
import { FiSearch } from "react-icons/fi";

export default function StockTableSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Sample data extracted directly from the image
  const stockData = [
    {
      id: 1,
      initials: "T",
      avatarBg: "bg-purple-100 text-purple-700",
      reward: "TimeTravel",
      description: "Goback to Past 5 years ago (Limited Edition)",
      category: "Experience",
      points: "1,000",
      stock: 2,
      isStockLow: true,
      reorderAt: 5,
      status: "Low Stock",
      statusBg: "bg-amber-100 text-amber-800",
    },
    {
      id: 2,
      initials: "CM",
      avatarBg: "bg-teal-100 text-teal-800",
      reward: "Coffee Map Gift Card",
      description: "$10 digital gift card",
      category: "Gift Card",
      points: "100",
      stock: 48,
      isStockLow: false,
      reorderAt: 10,
      status: "In Stock",
      statusBg: "bg-emerald-100 text-emerald-800",
    },
    {
      id: 3,
      initials: "SC",
      avatarBg: "bg-teal-100 text-teal-800",
      reward: "Sole Club Gift Card",
      description: "$25 digital gift card",
      category: "Gift Card",
      points: "240",
      stock: 31,
      isStockLow: false,
      reorderAt: 10,
      status: "In Stock",
      statusBg: "bg-emerald-100 text-emerald-800",
    },
    {
      id: 4,
      initials: "PP",
      avatarBg: "bg-teal-100 text-teal-800",
      reward: "Pizza Pop Gift Card",
      description: "$10 digital gift card",
      category: "Gift Card",
      points: "100",
      stock: 55,
      isStockLow: false,
      reorderAt: 10,
      status: "In Stock",
      statusBg: "bg-emerald-100 text-emerald-800",
    },
  ];

  // Table Column Definitions
  const columns = [
    {
      header: "Reward",
      accessor: "reward",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${row.avatarBg}`}
          >
            {row.initials}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.reward}</div>
            <div className="text-xs text-gray-400 font-normal">
              {row.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      render: (row) => (
        <span className="font-semibold text-gray-800">{row.category}</span>
      ),
    },
    {
      header: "Points",
      accessor: "points",
      render: (row) => (
        <span className="font-medium text-orange-600">{row.points}</span>
      ),
    },
    {
      header: "Stock",
      accessor: "stock",
      render: (row) => (
        <span
          className={`font-semibold ${
            row.isStockLow ? "text-amber-600" : "text-gray-800"
          }`}
        >
          {row.stock}
        </span>
      ),
    },
    {
      header: "Reorder At",
      accessor: "reorderAt",
      render: (row) => (
        <span className="text-gray-400">{row.reorderAt}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${row.statusBg}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {row.status}
        </span>
      ),
    },
  ];

  // Simple Filtering Logic
  const filteredData = stockData.filter((item) => {
    const matchesSearch =
      item.reward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search reward or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="w-full md:w-36">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-700"
            >
              <option value="All">All Categories</option>
              <option value="Experience">Experience</option>
              <option value="Gift Card">Gift Card</option>
            </select>
          </div>

          <div className="w-full md:w-36">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-700"
            >
              <option value="All">All Statuses</option>
              <option value="Low Stock">Low Stock</option>
              <option value="In Stock">In Stock</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-1">
        <Table columns={columns} data={filteredData} isloading={false} />
      </div>
    </div>
  );
}