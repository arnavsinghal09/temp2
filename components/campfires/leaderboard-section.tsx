"use client"
import { useState } from "react"
import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { topSharers, weeklyDigest, achievements } from "@/lib/data"

export function LeaderboardSection() {
  const [activeTab, setActiveTab] = useState("sharers")

  return (
    <div className="bg-gray-950 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#ff6404] font-bold text-xl flex items-center">
          <Trophy className="w-6 h-6 mr-2" />
          Leaderboards
        </h2>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-900 rounded-lg p-1">
        {[
          { id: "sharers", label: "Top Sharers" },
          { id: "digest", label: "Weekly Digest" },
          { id: "badges", label: "Achievements" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300",
              activeTab === tab.id ? "bg-[#ff6404] text-black" : "text-gray-400 hover:text-[#ff6404] hover:bg-gray-800",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "sharers" && (
        <div className="space-y-3">
          {topSharers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  user.rank === 1
                    ? "bg-yellow-500 text-black"
                    : user.rank === 2
                      ? "bg-gray-400 text-black"
                      : user.rank === 3
                        ? "bg-orange-600 text-black"
                        : "bg-gray-700 text-white",
                )}
              >
                {user.rank}
              </div>
              <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-400 text-xs">{user.badge}</p>
              </div>
              <div className="text-right">
                <p className="text-[#ff6404] font-bold">{user.clips}</p>
                <p className="text-gray-400 text-xs">clips</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "digest" && (
        <div className="space-y-3">
          {weeklyDigest.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
              <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-400 text-xs">Engagement: {user.engagement}</p>
              </div>
              <div className="text-right">
                <p className="text-[#ff6404] font-bold">{user.views.toLocaleString()}</p>
                <p className="text-gray-400 text-xs">views</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "badges" && (
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <div
                key={achievement.id}
                className="p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-center"
              >
                <Icon className={cn("w-8 h-8 mx-auto mb-2", achievement.color)} />
                <p className="text-white font-medium text-sm">{achievement.name}</p>
                <p className="text-gray-400 text-xs">{achievement.description}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
