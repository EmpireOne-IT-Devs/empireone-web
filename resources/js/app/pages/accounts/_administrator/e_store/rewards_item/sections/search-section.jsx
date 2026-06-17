import { TbSearch } from "react-icons/tb";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";

export default function SearchSection() {
    return (
        <div className="bg-white shadow-sm p-4 sm:p-5 border-2 rounded-2xl flex flex-col md:flex-row gap-3 my-3">
            <div className="flex-1 w-full">
                
                    <Input
                        iconLeft={<TbSearch className="text-xl" />}
                        label="Search Items..."
                        name="search"
                    />
              
            </div>

            <div className="w-full md:w-48 shrink-0">
                <Select
                    label="All Types"
                    value={status}
             
                    options={[
                        { value: "all_types", label: "All Types" },
                        { value: "avatar_decoration", label: "Avatar Decoration" },
                        { value: "profile_effect", label: "Profile Effect" },
                        { value: "meal_voucher", label: "Meal Voucher" },
                        { value: "gift_card", label: "Gift Card" },
                        { value: "merchandise", label: "Merchandise" },
                        { value: "voucher", label: "Voucher" },
                        { value: "workplace_perk", label: "Workplace Perk" },
                    ]}
                />
            </div>
             <div className="w-full md:w-48 shrink-0">
                <Select
                    label="All Status"
                    value={status}
             
                    options={[
                        { value: "all_status", label: "All Status" },
                        { value: "active", label: "Active" },
                         { value: "inactive", label: "Inactive" },
                    ]}
                />
            </div>
        </div>
    );
}
