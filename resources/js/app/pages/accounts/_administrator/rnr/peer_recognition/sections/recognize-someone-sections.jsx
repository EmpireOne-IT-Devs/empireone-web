import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import { HeartIcon } from "lucide-react";
import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import AwardCategorySection from "../award-category-section";

export default function RecognizeSomeoneSections() {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <div className="mt-4 flex items-start justify-between gap-4 p-2">
                <AwardCategorySection />

                <Button
                    variant="engagement"
               
                    onClick={() => setIsOpen(true)}
                    className="shrink-0 rounded-full"
                >
                    <HeartIcon className="mr-2 h-4 w-4" />
                    Recognize Someone
                </Button>
            </div>

            <div className="flex justify-end items-end p-3">
                <Modal
                    isOpen={isOpen}
                    onClose={handleClose}
                    width="max-w-xl"
                    title={
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                    Recognize Someone
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Show appreciation to your colleagues by
                                    recognizing their hard work and
                                    contributions.
                                </p>
                            </div>
                        </div>
                    }
                >
                    <div className="flex flex-col gap-4 pb-2 p-2 mt-4">
                        <Input
                            label="Recognize a colleague "
                            placeholder="Seacrh by name...."
                        />
                        <div className="flex flex-wrap gap-2 text-sm text-black mt-2">
                            Award Category
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200">
                                Employee of the Month
                            </button>

                            <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200">
                                Innovation Award
                            </button>

                            <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200">
                                Rising Star
                            </button>

                            <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200">
                                Team Excellence Award
                            </button>

                            <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200">
                                Customer Champion
                            </button>

                            <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200">
                                Mentor of the Quarter
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-black mt-2">
                            Company Value
                        </div>
                        <div className=" flex flex-wrap gap-2">
                            <button className="rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs font-medium text-yellow-700 transition hover:bg-yellow-100 hover:border-yellow-300">
                                💡 Innovation
                            </button>

                            <button className="rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-medium text-pink-700 transition hover:bg-pink-100 hover:border-pink-300">
                                🤝 Teamwork
                            </button>

                            <button className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100 hover:border-blue-300">
                                ⭐ Excellence
                            </button>

                            <button className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-medium text-orange-700 transition hover:bg-orange-100 hover:border-orange-300">
                                🏆 Leadership
                            </button>

                            <button className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 hover:border-emerald-300">
                                ❤️ Customer Focus
                            </button>

                            <button className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 hover:border-indigo-300">
                                🛡️ Integrity
                            </button>

                            <button className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100 hover:border-red-300">
                                💪 Resilience
                            </button>

                            <button className="rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-medium text-purple-700 transition hover:bg-purple-100 hover:border-purple-300">
                                🎨 Creativity
                            </button>
                        </div>
                        <Input
                            label="Your message"
                            placeholder="Tell them what they did and why it matters...."
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={handleClose} className="w-full">
                            Cancel
                        </Button>
                        <Button onClick={handleClose} className="w-full">
                            <FaPaperPlane className="w-4 h-4 mr-2" />
                            Send Recognition
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
