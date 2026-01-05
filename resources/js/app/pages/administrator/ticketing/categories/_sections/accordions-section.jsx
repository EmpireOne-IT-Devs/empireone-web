import Accordion from "@/app/_components/accordion";
import React from "react";
import { TbBuildingCog, TbTags } from "react-icons/tb";
import CreateCategorySection from "./create-category-section";
import EditCategorySection from "./edit-category-section";
import DeleteCategorySection from "./delete-category-section";

export default function AccordionsSection() {
    return (
        <div className="flex flex-col gap-3">
            {[1, 2, 3].map((res) => {
                return (
                    <Accordion
                        items={[
                            {
                                title: (
                                    <div className="w-full flex items-center  justify-between">
                                        <div className="flex  w-full flex-1 gap-1 items-center">
                                            <TbBuildingCog className="text-xl" />{" "}
                                            What is a Category?
                                        </div>
                                        <div>
                                            <CreateCategorySection />
                                        </div>
                                    </div>
                                ),
                                content: (
                                    <div className="flex flex-col gap-3">
                                        {[1, 2, 3].map((res, i) => {
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex gap-2 border p-3 rounded-xl"
                                                >
                                                    <div className="p-3 rounded-lg bg-blue-200">
                                                        <TbTags className="text-3xl text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-lg font-black">
                                                            Hardware Issue
                                                        </div>
                                                        <div>
                                                            Computer, laptop, or
                                                            peripheral hardware
                                                            problems
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-3">
                                                        <EditCategorySection />
                                                        <DeleteCategorySection />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ),
                            },
                        ]}
                    />
                );
            })}
        </div>
    );
}
