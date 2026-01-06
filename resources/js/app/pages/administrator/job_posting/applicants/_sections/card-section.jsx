import Card from "@/app/_components/card";
import React from "react";
export default function CardSection() {
    return (
        <div className=" flex gap-5 ">
            <Card className="w-full flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-gray-500 ">New</div>
                    <div className="font-bold text-lg" > 6</div>
                </div>
            </Card>

            <Card className="w-full flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-gray-500">Reviewing</div>
                    <div className="font-bold text-lg"> 1</div>
                </div>
            </Card>

            <Card className="w-full flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-gray-500">Shortlisted</div>
                    <div className="font-bold text-lg"> 1</div>
                </div>
            </Card>

            <Card className="w-full flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-gray-500" >Interview</div>
                    <div className="font-bold text-lg"> 1</div>
                </div>
            </Card>

            <Card className="w-full flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-gray-500">Rejected</div>
                    <div className="font-bold text-lg"> 1</div>
                </div>
            </Card>

            <Card className="w-full flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-gray-500">Hired</div>
                    <div className="font-bold text-lg"> 1</div>
                </div>
            </Card>
        </div>
    );
}
