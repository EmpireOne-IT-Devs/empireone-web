import Card from "@/app/_components/card";
import React from "react";
import { ClipboardList, CheckCircle2, XCircle, Clock } from "lucide-react";

function SectionLabel({ title }) {
    return (
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-6 mb-3">
            {title}
        </p>
    );
}

export default function CardEvaluationSection() {
    const eval3Total   = 6;
    const eval3Passed  = 3;
    const eval3Failed  = 1;
    const eval3Pending = 2;
    const eval5Total   = 5;
    const eval5Passed  = 2;
    const eval5Failed  = 1;
    const eval5Pending = 2;

    return (
        <div className="flex flex-col">
            <SectionLabel title="3rd Month Evaluation" />
            <div className="flex gap-3 w-full flex-wrap">
                <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-700"><ClipboardList size={28} /></div>
                        <div className="text-3xl font-bold text-blue-900">{eval3Total}</div>
                    </div>
                    <div className="mt-4 text-sm font-medium text-gray-500">Total Due</div>
                </Card>
                <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-green-50 rounded-lg text-green-600"><CheckCircle2 size={28} /></div>
                        <div className="text-3xl font-bold text-green-700">{eval3Passed}</div>
                    </div>
                    <div className="mt-4 text-sm font-medium text-gray-500">Passed</div>
                </Card>
                <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-red-50 rounded-lg text-red-500"><XCircle size={28} /></div>
                        <div className="text-3xl font-bold text-red-600">{eval3Failed}</div>
                    </div>
                    <div className="mt-4 text-sm font-medium text-gray-500">Failed</div>
                </Card>
                <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-orange-50 rounded-lg text-orange-500"><Clock size={28} /></div>
                        <div className="text-3xl font-bold text-orange-600">{eval3Pending}</div>
                    </div>
                    <div className="mt-4 text-sm font-medium text-gray-500">Pending</div>
                </Card>
            </div>

            <SectionLabel title="5th Month Evaluation" />
            <div className="flex gap-3 w-full flex-wrap">
                <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-700"><ClipboardList size={28} /></div>
                        <div className="text-3xl font-bold text-blue-900">{eval5Total}</div>
                    </div>
                    <div className="mt-4 text-sm font-medium text-gray-500">Total Due</div>
                </Card>
                <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-green-50 rounded-lg text-green-600"><CheckCircle2 size={28} /></div>
                        <div className="text-3xl font-bold text-green-700">{eval5Passed}</div>
                    </div>
                    <div className="mt-4 text-sm font-medium text-gray-500">Passed</div>
                </Card>
                <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-red-50 rounded-lg text-red-500"><XCircle size={28} /></div>
                        <div className="text-3xl font-bold text-red-600">{eval5Failed}</div>
                    </div>
                    <div className="mt-4 text-sm font-medium text-gray-500">Failed</div>
                </Card>
                <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-orange-50 rounded-lg text-orange-500"><Clock size={28} /></div>
                        <div className="text-3xl font-bold text-orange-600">{eval5Pending}</div>
                    </div>
                    <div className="mt-4 text-sm font-medium text-gray-500">Pending</div>
                </Card>
            </div>
        </div>
    );
}
