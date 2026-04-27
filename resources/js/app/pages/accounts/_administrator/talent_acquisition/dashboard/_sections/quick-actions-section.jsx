import Button from "@/app/_components/button";
import Card from "@/app/_components/card";
import { CalendarIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { FaFileAlt } from "react-icons/fa";
import CreateJobRequisition from "../../job_requisition/_sections/create-requisition-section";
export default function QuickActionsSection() {
    return (
        <Card className="flex-1 flex flex-col gap-4 p-6">
            <h2 className="text-xl font-bold">Quick Actions</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <CreateJobRequisition />
                </div>

                <Button
                    outlined
                    className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                    <CalendarIcon className="w-5 h-5 text-gray-700" />
                    <span className="font-semibold text-gray-700">
                        Schedule Interview
                    </span>
                </Button>

                <Button
                    outlined
                    className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                    <FaFileAlt className="w-5 h-5 text-gray-700" />
                    <span className="font-semibold text-gray-700">
                        Generate Report
                    </span>
                </Button>
            </div>
        </Card>
    );
}
