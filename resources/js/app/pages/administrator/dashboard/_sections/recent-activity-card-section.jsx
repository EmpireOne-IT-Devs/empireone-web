import Card from "@/app/_components/card";
import { Bell, Calendar, Clipboard, Megaphone, Newspaper, Ticket } from "lucide-react";
import React from "react";

export default function RecentActivityCardSection() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg p-2">
          <Newspaper className="w-10 h-10 flex-shrink-0 p-2 rounded-full text-indigo-600 bg-blue-100" />
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-900">Company Achieves Major Milestone</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
              <span>CEO Office</span>
              <span>• 2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg p-2">
          <Ticket className="w-10 h-10 flex-shrink-0 p-2 rounded-full text-red-600 bg-red-100" />
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-900">Your ticket #TKT-1045 was resolved</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
              <span>IT Support</span>
              <span>• 4 hours ago</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg p-2">
          <Clipboard className="w-10 h-10 flex-shrink-0 p-2 rounded-full text-green-600 bg-green-100" />
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-900">Application update for Senior Developer</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
              <span>HR Team</span>
              <span>• 1 day ago</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg p-2">
          <Calendar className="w-10 h-10 flex-shrink-0 p-2 rounded-full text-orange-600 bg-orange-100" />
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-900">New event: Tech Innovation Showcase</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
              <span>Events Team</span>
              <span>• 2 days ago</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg p-2">
          <Megaphone className="w-10 h-10 flex-shrink-0 p-2 rounded-full text-purple-600 bg-purple-100" />
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-900">Q1 Performance Review Cycle Begins</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
              <span>HR Central</span>
              <span>• 3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
    