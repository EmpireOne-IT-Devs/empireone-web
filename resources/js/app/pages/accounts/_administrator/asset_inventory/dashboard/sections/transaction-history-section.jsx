import React from 'react'
import Table from '@/app/_components/table' // Update import path if needed

const transactionData = [
  {
    id: 1,
    date: '2026-02-23',
    assetName: 'Jabra Evolve2 40',
    category: 'Peripheral',
    status: 'Received',
    user: 'System',
  },
  {
    id: 2,
    date: '2026-02-21',
    assetName: 'Dell UltraSharp 24"',
    category: 'Monitor',
    status: 'Assigned',
    user: 'M. Santos',
  },
  {
    id: 3,
    date: '2026-02-19',
    assetName: 'OptiPlex 7010 SFF',
    category: 'System Unit',
    status: 'Available',
    user: 'IT Admin',
  },
  {
    id: 4,
    date: '2026-02-18',
    assetName: 'Logitech MX Keys',
    category: 'Peripheral',
    status: 'Assigned',
    user: 'J. Dela Cruz',
  },
  {
    id: 5,
    date: '2026-02-15',
    assetName: 'ThinkPad T14 Gen 4',
    category: 'System Unit',
    status: 'Received',
    user: 'System',
  },
  {
    id: 6,
    date: '2026-02-12',
    assetName: 'APC Back-UPS 650VA',
    category: 'Parts',
    status: 'In Repair',
    user: 'R. Reyes',
  },
  {
    id: 7,
    date: '2026-02-10',
    assetName: 'Samsung 27" IPS',
    category: 'Monitor',
    status: 'Available',
    user: 'System',
  },
  {
    id: 8,
    date: '2026-02-07',
    assetName: 'Cisco IP Phone 8841',
    category: 'Peripheral',
    status: 'Returned',
    user: 'K. Villanueva',
  },
  {
    id: 9,
    date: '2026-02-04',
    assetName: 'HP ProDesk 400 G9',
    category: 'System Unit',
    status: 'Assigned',
    user: 'A. Mendoza',
  },
  {
    id: 10,
    date: '2026-01-30',
    assetName: 'Logitech C920e Cam',
    category: 'Peripheral',
    status: 'Available',
    user: 'IT Admin',
  },
  {
    id: 11,
    date: '2026-01-27',
    assetName: 'Kingston 16GB DDR5',
    category: 'Parts',
    status: 'Received',
    user: 'System',
  },
  {
    id: 12,
    date: '2026-01-24',
    assetName: 'Poly Blackwire 3320',
    category: 'Peripheral',
    status: 'Assigned',
    user: 'C. Bautista',
  },
]

const columns = [
  { header: 'Date', accessor: 'date' },
  { header: 'Asset Name', accessor: 'assetName' },
  { header: 'Category', accessor: 'category' },
  {
    header: 'Status',
    accessor: 'status',
    render: (row) => {
      const statusColors = {
        Received: 'text-emerald-600 font-medium',
        Assigned: 'text-blue-600 font-medium',
        Available: 'text-gray-700',
        'In Repair': 'text-amber-600 font-medium',
        Returned: 'text-purple-600 font-medium',
      }
      return <span className={statusColors[row.status] || 'text-gray-700'}>{row.status}</span>
    },
  },
  { header: 'User', accessor: 'user' },
]

export default function TransactionHistorySection() {
  return (
    <div className=" bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
        <a
          href="#view-all"
          onClick={(e) => {
            e.preventDefault()
          }}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All
        </a>
      </div>

      <Table columns={columns} data={transactionData} isloading={false} skeletonRows={12} />
    </div>
  )
}