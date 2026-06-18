import React, { useState } from "react";
import {
    Gift,
    Crown,
    Utensils,
    CreditCard,
    Shirt,
    Laptop,
    PlusCircle,
    Store,
} from "lucide-react";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Button from "@/app/_components/button";
const ICON_OPTIONS = [
    { label: "Gift", value: "gift", icon: Gift },
    { label: "Crown", value: "crown", icon: Crown },
    { label: "Meal", value: "meal", icon: Utensils },
    { label: "Card", value: "card", icon: CreditCard },
    { label: "Shirt", value: "shirt", icon: Shirt },
    { label: "Laptop", value: "laptop", icon: Laptop },
];

const TYPE_OPTIONS = [
    { label: "Avatar Decoration", value: "Avatar Decoration" },
    { label: "Meal Voucher", value: "Meal Voucher" },
    { label: "Gift Card", value: "Gift Card" },
    { label: "Merchandise", value: "Merchandise" },
    { label: "Workplace Perk", value: "Workplace Perk" },
];
const RARITY_OPTIONS = [
    { label: "Common", value: "Common" },
    { label: "Uncommon", value: "Uncommon" },
    { label: "Rare", value: "Rare" },
    { label: "Epic", value: "Epic" },
    { label: "Legendary", value: "Legendary" },
];

const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

export default function AddRewardSection() {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        type: "Avatar Decoration",
        description: "",
        category: "",
        icon: "gift",
        color: "#3730a3",
        pointsCost: 100,
        rarity: "Common",
        stock: "",
        expiryDays: "",
    });

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    const setVal = (field) => (val) =>
        setForm((prev) => ({ ...prev, [field]: val }));

    const selectedIcon =
        ICON_OPTIONS.find((o) => o.value === form.icon) || ICON_OPTIONS[0];
    const PreviewIcon = selectedIcon.icon;

    return (
        <>
            <div className="flex justify-end ">
                <Button
                outlined
                onClick={() => setIsOpen(true)}>
                    <PlusCircle size={16} />
                    <div className="ml-2">Add New Reward Item</div>
                </Button>
            </div>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <Store />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                E-Store
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Add New Reward Item
                            </h2>
                        </div>
                    </div>
                }
                width="max-w-2xl"
            >
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent p-3 ">
                    <Input
                        label="Name"
                        name="name"
                        placeholder="Enter reward name"
                        value={form.name}
                        onChange={set("name")}
                    />

                    <Select
                        label="Type"
                        name="type"
                        options={TYPE_OPTIONS}
                        value={form.type}
                        onChange={setVal("type")}
                    />

                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea
                            className={inputClass}
                            rows={3}
                            placeholder="Enter description"
                            value={form.description}
                            onChange={set("description")}
                        />
                    </div>

                    <Input
                        label="Category"
                        name="category"
                        value={form.category}
                        onChange={set("category")}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Select
                                label="Icon"
                                name="icon"
                                options={ICON_OPTIONS}
                                value={form.icon}
                                onChange={setVal("icon")}
                            />
                        </div>
                        <div>
                            <Input
                                label="Color"
                                type="color"
                                className="w-full h-[38px] border border-gray-300 rounded-md cursor-pointer px-1"
                                value={form.color}
                                onChange={set("color")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Input
                                label="Points Cost"
                                name="pointsCost"
                                type="number"
                                value={form.pointsCost}
                                onChange={set("pointsCost")}
                                min={0}
                            />
                        </div>
                        <div>
                            <Select
                                label="Rarity (Optional)"
                                name="rarity"
                                options={RARITY_OPTIONS}
                                value={form.rarity}
                                onChange={setVal("rarity")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Input
                                label="Stock (Optional)"
                                name="stock"
                                value={form.stock}
                                onChange={set("stock")}
                            />
                        </div>
                        <div>
                            <Input
                                label="Expiry Days (Optional)"
                                name="expiryDays"
                                value={form.expiryDays}
                                onChange={set("expiryDays")}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Preview:</label>
                        <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <div
                                className="p-2 rounded-xl shrink-0"
                                style={{ backgroundColor: form.color + "22" }}
                            >
                                <PreviewIcon
                                    size={20}
                                    style={{ color: form.color }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 text-sm">
                                    {form.name || "Item Name"}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {form.description || "Description"}
                                </span>
                                <span
                                    className="text-xs font-semibold mt-0.5"
                                    style={{ color: form.color }}
                                >
                                    {form.pointsCost} pts
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 sticky bottom-0 bg-white mt-4">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full border border-gray-300 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <PlusCircle size={16} />
                        Add Reward
                    </button>
                </div>
            </Modal>
        </>
    );
}
