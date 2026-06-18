import React from 'react';
import { Crown, Utensils, CreditCard, Shirt, Laptop, Pencil, Trash2 } from 'lucide-react';
import Table from '@/app/_components/table';
import Badge from '@/app/_components/badge';

const iconConfig = {
    crown: { bg: 'bg-amber-50 text-amber-500', icon: Crown },
    meal:  { bg: 'bg-orange-50 text-orange-500', icon: Utensils },
    card:  { bg: 'bg-amber-50 text-amber-500', icon: CreditCard },
    shirt: { bg: 'bg-indigo-50 text-indigo-500', icon: Shirt },
    perk:  { bg: 'bg-purple-50 text-purple-500', icon: Laptop },
};

const ItemCell = ({ title, sub, typeKey }) => {
    const { bg, icon: Icon } = iconConfig[typeKey];
    return (
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${bg}`}>
                <Icon size={18} />
            </div>
            <div className="flex flex-col">
                <span className="font-semibold text-gray-900 text-sm">{title}</span>
                <span className="text-xs text-gray-400">{sub}</span>
            </div>
        </div>
    );
};

const Actions = () => (
    <div className="flex items-center gap-3 text-gray-400">
        <button className="hover:text-gray-600 transition-colors"><Pencil size={16} /></button>
        <button className="hover:text-red-500 transition-colors"><Trash2 size={16} className="text-red-500" /></button>
    </div>
);

const columns = [
    { header: 'Item', accessor: 'item' },
    { header: 'Type', accessor: 'type' },
    { header: 'Points', accessor: 'points' },
    { header: 'Stock', accessor: 'stock' },
    { header: 'Redemptions', accessor: 'redemptions' },
    { header: 'Status', accessor: 'status' },
    { header: 'Actions', accessor: 'actions' },
];

const data = [
    { item: <ItemCell title="Golden Crown" sub="Avatar Decoration" typeKey="crown" />, type: 'Decoration', points: 500, stock: '∞', redemptions: 45, status: <Badge outlined label="Active" variant="success" showDot />, actions: <Actions /> },
    { item: <ItemCell title="Lunch Voucher - $10" sub="Meal Voucher" typeKey="meal" />, type: 'Meal', points: 180, stock: 40, redemptions: 128, status: <Badge outlined label="Active" variant="success" showDot />, actions: <Actions /> },
    { item: <ItemCell title="Amazon Gift Card - $25" sub="Gift Card" typeKey="card" />, type: 'Gift Card', points: 500, stock: 100, redemptions: 67, status: <Badge outlined label="Active" variant="success" showDot />, actions: <Actions /> },
    { item: <ItemCell title="Company Hoodie" sub="Merchandise" typeKey="shirt" />, type: 'Merchandise', points: 400, stock: 80, redemptions: 34, status: <Badge outlined label="Active" variant="success" showDot />, actions: <Actions /> },
    { item: <ItemCell title="Extra WFH Day" sub="Workplace Perk" typeKey="perk" />, type: 'Perk', points: 150, stock: 100, redemptions: 203, status: <Badge outlined label="Active" variant="success" showDot />, actions: <Actions /> },
];

export default function RewardTableSection() {
    return <Table columns={columns} data={data} />;
}