"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChatStorage } from "@/lib/chat-storage"
import { MessageSystem } from "@/lib/message-system"
import { UserManager, type User } from "@/lib/user-management"

interface AccountSettingsPageProps {
  currentUser: User | null
}

function ProfileSettings({ currentUser }: { currentUser: User | null }) {
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    bio: currentUser?.bio || "",
    location: currentUser?.location || "",
  })

  const handleSave = () => {
    if (currentUser) {
      UserManager.updateUserStatus(currentUser.id, {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
      })
      alert("Profile updated successfully!")
    }
  }

  return (
    <div className="space-y-6 animate-slide-in-right">
      <h2 className="text-2xl font-bold text-[#ff6404] mb-6">Profile Settings</h2>

      <div className="bg-gray-950 rounded-lg p-6 border border-gray-800">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff6404] to-orange-600 flex items-center justify-center">
            <span className="text-black font-bold text-2xl">{currentUser?.name.charAt(0) || "U"}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{currentUser?.name || "Unknown User"}</h3>
            <p className="text-gray-400">{currentUser?.status || "User"}</p>
            <button className="text-[#ff6404] text-sm hover:underline mt-1">Change Avatar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Display Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#ff6404] focus:outline-none transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#ff6404] focus:outline-none transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#ff6404] focus:outline-none transition-colors duration-300 h-24 resize-none"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#ff6404] focus:outline-none transition-colors duration-300"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 bg-[#ff6404] text-black px-6 py-3 rounded-lg font-semibold hover:bg-orange-500 transition-all duration-300 hover:scale-105"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

function PrivacySettings() {
  const settings = [
    {
      title: "Profile Visibility",
      description: "Who can see your profile",
      options: ["Everyone", "Friends Only", "Private"],
    },
    { title: "Activity Status", description: "Show when you're online", options: ["On", "Off"] },
    {
      title: "Watch History",
      description: "Allow friends to see what you're watching",
      options: ["Public", "Friends", "Private"],
    },
    {
      title: "Clip Sharing",
      description: "Who can share clips with you",
      options: ["Everyone", "Friends Only", "Off"],
    },
  ]

  return (
    <div className="space-y-6 animate-slide-in-right">
      <h2 className="text-2xl font-bold text-[#ff6404] mb-6">Privacy & Security</h2>

      <div className="bg-gray-950 rounded-lg p-6 border border-gray-800 space-y-6">
        {settings.map((setting, index) => (
          <div key={index} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-b-0">
            <div>
              <h3 className="text-white font-medium">{setting.title}</h3>
              <p className="text-gray-400 text-sm">{setting.description}</p>
            </div>
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#ff6404] focus:outline-none">
              {setting.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

function NotificationSettings() {
  const notificationSettings = [
    { title: "New Clips", description: "When friends share clips with you" },
    { title: "Friend Requests", description: "When someone sends you a friend request" },
    { title: "Campfire Invites", description: "When you're invited to join a campfire" },
    { title: "Achievement Unlocked", description: "When you earn new badges or achievements" },
    { title: "Weekly Digest", description: "Summary of your weekly activity" },
    { title: "New Content", description: "When new shows/movies are added to your services" },
  ]

  return (
    <div className="space-y-6 animate-slide-in-right">
      <h2 className="text-2xl font-bold text-[#ff6404] mb-6">Notifications</h2>

      <div className="bg-gray-950 rounded-lg p-6 border border-gray-800 space-y-6">
        {notificationSettings.map((setting, index) => (
          <div key={index} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-b-0">
            <div>
              <h3 className="text-white font-medium">{setting.title}</h3>
              <p className="text-gray-400 text-sm">{setting.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6404]"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

function DataSettings({ currentUser }: { currentUser: User | null }) {
  const handleClearAllChats = () => {
    if (window.confirm("Are you sure you want to clear all chat history? This action cannot be undone.")) {
      ChatStorage.clearAllChats()
      if (currentUser) {
        MessageSystem.clearUserMessages(currentUser.id)
      }
      alert("All chat history has been cleared.")
    }
  }

  const handleClearUserMessages = () => {
    if (currentUser && window.confirm(`Clear all messages for ${currentUser.name}? This action cannot be undone.`)) {
      MessageSystem.clearUserMessages(currentUser.id)
      alert("User messages have been cleared.")
    }
  }

  const getStorageUsage = () => {
    try {
      const chats = localStorage.getItem("firetv_chats")
      const messages = localStorage.getItem("firetv_messages")
      let totalSize = 0

      if (chats) totalSize += new Blob([chats]).size
      if (messages) totalSize += new Blob([messages]).size

      const sizeInKB = (totalSize / 1024).toFixed(2)
      return `${sizeInKB} KB`
    } catch {
      return "Unknown"
    }
  }

  return (
    <div className="space-y-6 animate-slide-in-right">
      <h2 className="text-2xl font-bold text-[#ff6404] mb-6">Data & Storage</h2>

      <div className="bg-gray-950 rounded-lg p-6 border border-gray-800 space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-gray-800">
          <div>
            <h3 className="text-white font-medium">Total Storage Usage</h3>
            <p className="text-gray-400 text-sm">Local storage used for all data</p>
          </div>
          <span className="text-[#ff6404] font-semibold">{getStorageUsage()}</span>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-800">
          <div>
            <h3 className="text-white font-medium">Clear User Messages</h3>
            <p className="text-gray-400 text-sm">Clear messages for current user only</p>
          </div>
          <button
            onClick={handleClearUserMessages}
            disabled={!currentUser}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear User Data
          </button>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <h3 className="text-white font-medium">Clear All Data</h3>
            <p className="text-gray-400 text-sm">Permanently delete all stored data</p>
          </div>
          <button
            onClick={handleClearAllChats}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all duration-300"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  )
}

export function AccountSettingsPage({ currentUser }: AccountSettingsPageProps) {
  const [activeSection, setActiveSection] = useState("profile")

  const sections = [
    { id: "profile", label: "Profile", component: () => <ProfileSettings currentUser={currentUser} /> },
    { id: "privacy", label: "Privacy & Security", component: PrivacySettings },
    { id: "notifications", label: "Notifications", component: NotificationSettings },
    { id: "data", label: "Data & Storage", component: () => <DataSettings currentUser={currentUser} /> },
  ]

  const ActiveComponent =
    sections.find((s) => s.id === activeSection)?.component || (() => <ProfileSettings currentUser={currentUser} />)

  return (
    <div className="flex gap-8 animate-fade-in">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 sticky top-24">
          <h2 className="text-[#ff6404] font-bold text-lg mb-4">Settings</h2>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-all duration-300",
                  activeSection === section.id
                    ? "bg-[#ff6404] text-black font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                )}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <ActiveComponent />
      </div>
    </div>
  )
}
