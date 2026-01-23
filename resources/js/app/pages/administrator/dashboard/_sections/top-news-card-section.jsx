import Button from "@/app/_components/button";
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import { Newspaper } from "lucide-react";
import React from "react";

export default function TopNewsCardSection() {
    return (
        <div>
            <Card>
                <div className="flex items-center gap-2 mb-6">
                    <Newspaper className="w-5 h-5 text-blue-700" />
                    <h2 className="text-lg font-semibold text-gray-900">
                        Top News
                    </h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge
                                label="Business"
                                variant="primary"
                                showDot={false}
                                className="rounded-md text-white bg-blue-600"
                            />
                            <span className="text-xs text-gray-500">
                                5 hours ago
                            </span>
                        </div>
                        <h3 className="text-sm font-normal text-gray-900">
                            Q4 Financial Results Exceed Expectations
                        </h3>
                        <div className="mt-4 border-b border-gray-200"></div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge
                                label="Product"
                                variant="primary"
                                showDot={false}
                                className="rounded-md text-white bg-blue-600"
                            />
                            <span className="text-xs text-gray-500">
                                1 day ago
                            </span>
                        </div>
                        <h3 className="text-sm font-normal text-gray-900">
                            New Product Launch: Innovation at Its Best
                        </h3>
                        <div className="mt-4 border-b border-gray-200"></div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge
                                label="Customer"
                                variant="primary"
                                showDot={false}
                                className="rounded-md text-white bg-blue-600"
                            />
                            <span className="text-xs text-gray-500">
                                2 days ago
                            </span>
                        </div>
                        <h3 className="text-sm font-normal text-gray-900">
                            Customer Success Stories
                        </h3>
                    </div>
                </div>

                <Button outlined className="w-full mt-6  text-sm">
                    Read More News
                </Button>
            </Card>
        </div>
    );
}
