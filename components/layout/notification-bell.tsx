"use client"
import { useState } from "react"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { notifications } from "@/lib/data"

export function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = notifications.filter((n) => n.isNew).length

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-400 hover:text-[#ff6404] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ff6404] rounded-lg"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#ff6404] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 bg-gray-950 border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-[#ff6404] font-semibold">Notifications</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 border-b border-gray-900 hover:bg-gray-900 cursor-pointer transition-colors duration-300",
                  notification.isNew && "bg-[#ff6404]/10",
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#ff6404] rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="font-semibold text-[#ff6404]">{notification.sender}</span> {notification.message}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {notification.campfire && `${notification.campfire} • `}
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
