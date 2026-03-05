import Card from "@/app/_components/card";
import React from "react";
import { useSelector } from "react-redux";

export default function CardsSection() {
    const { job_applications } = useSelector((store) => store.job_postings);
    console.log("job_applications", job_applications);
    return (
        <div className="flex w-full gap-3">
            <Card className="flex-1 w-full">
                <div>Total</div>
                <div className="font-black text-xl text-black">
                    {job_applications?.stats?.total ?? 0}
                </div>
            </Card>
            <Card className="flex-1 w-full">
                <div>Pending</div>
                <div className="font-black text-xl text-orange-600">
                    {job_applications?.stats?.pending ?? 0}
                </div>
            </Card>
            <Card className="flex-1 w-full">
                <div>Initial Phase</div>
                <div className="font-black text-xl text-purple-600">
                    {job_applications?.stats?.initial ?? 0}
                </div>
            </Card>
            <Card className="flex-1 w-full">
                <div>Final Phase</div>
                <div className="font-black text-xl text-blue-600">
                    {job_applications?.stats?.final ?? 0}
                </div>
            </Card>
            <Card className="flex-1 w-full">
                <div>Passed</div>
                <div className="font-black text-xl text-green-600">
                    {job_applications?.stats?.passed ?? 0}
                </div>
            </Card>
            <Card className="flex-1 w-full">
                <div>Failed</div>
                <div className="font-black text-xl text-red-600">
                    {job_applications?.stats?.failed ?? 0}
                </div>
            </Card>
        </div>
    );
}
