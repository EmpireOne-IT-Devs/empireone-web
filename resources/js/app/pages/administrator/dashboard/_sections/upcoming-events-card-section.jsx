import Button from "@/app/_components/button";
import Card from "@/app/_components/card";
import { CalendarIcon, MapPin, Calendar } from "lucide-react";
import React from "react";

export default function UpcomingEventsSection() {
    return (
            <Card className="flex-1 flex flex-col bg-white  mt-6 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <CalendarIcon className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                        Upcoming Events
                    </h2>
                </div>

                <div className="space-y-4">
                    <div className=" bg-blue-50 flex gap-0 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg">
                        <div className="w-1 bg-blue-600 rounded-l-lg flex-shrink-0"></div>
                        <div className="flex-1 p-4 pl-4">
                            <div className="text-sm font-medium text-gray-900 mb-2">
                                Annual Holiday Party 2024
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Dec 22 • 6:00 PM</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Grand Ballroom</span>
                            </div>
                        </div>
                    </div>

                    <div className=" bg-purple-50 flex gap-0 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg">
                        <div className="w-1 bg-purple-600 rounded-l-lg flex-shrink-0"></div>
                        <div className="flex-1 p-4 pl-4">
                            <div className="text-sm font-medium text-gray-900 mb-2">
                                Leadership Summit 2025
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Jan 5 • 9:00 AM</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Conference Center</span>
                            </div>
                        </div>
                    </div>

                    <div className=" bg-green-50 flex gap-0 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg">
                        <div className="w-1 bg-green-500 rounded-l-lg flex-shrink-0"></div>
                        <div className="flex-1 p-4 pl-4">
                            <div className="text-sm font-medium text-gray-900 mb-2">
                                Wellness Week: Yoga
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Jan 8 • 7:00 AM</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Wellness Center</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className=" pt-4 border-gray-100">
                    <Button 
                    outlined
                    className="w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                        View All Events
                    </Button>
                </div>
            </Card>
       
    );
}
