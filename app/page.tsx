"use client"
import { useState, useEffect } from "react"
import { Flame, TrendingUp } from "lucide-react"
import { UserManager, type User } from "@/lib/user-management"
import { MessageSystem } from "@/lib/message-system"

// Components
import { TopNavigation, NavigationBar } from "@/components/layout/navigation"
import { HeroSection } from "@/components/hero/hero-section"
import { ContentRow } from "@/components/content/content-row"
import { FriendsPage } from "@/components/friends/friends-page"
import { CampfireCard } from "@/components/campfires/campfire-card"
import { ClipPreviewCard } from "@/components/campfires/clip-preview-card"
import { LeaderboardSection } from "@/components/campfires/leaderboard-section"
import { ChatPanel } from "@/components/campfires/chat-panel"
import { AccountSettingsPage } from "@/components/settings/account-settings-page"
import { UserAccountsPage } from "@/components/auth/user-accounts-page"

// Data
import { contentRows, mostContactedCampfires, mostSharedClips } from "@/lib/data"
import type { Campfire, ChatParticipant } from "@/lib/types"

export default function FireTVInterface() {
  const [activeTab, setActiveTab] = useState("Home")
  const [selectedCampfire, setSelectedCampfire] = useState<ChatParticipant | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const tabs = ["Home", "Friends", "Campfires", "Account Settings", "User Accounts"]

  // Initialize current user on mount
  useEffect(() => {
    const user = UserManager.getCurrentUser()
    if (user) {
      setCurrentUser(user)
      // Initialize user chats
      MessageSystem.initializeUserChats(user.id)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const currentIndex = tabs.findIndex((tab) => tab === activeTab)
        if (e.key === "ArrowLeft" && currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1])
        } else if (e.key === "ArrowRight" && currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1])
        }
      }
      // Close chat panel with Escape key
      if (e.key === "Escape" && selectedCampfire) {
        setSelectedCampfire(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeTab, selectedCampfire])

  // Close chat panel when switching tabs
  useEffect(() => {
    if (activeTab !== "Campfires") {
      setSelectedCampfire(null)
    }
  }, [activeTab])

  const handleCampfireClick = (campfire: Campfire) => {
    setSelectedCampfire({
      id: campfire.id,
      name: campfire.name,
      avatar: campfire.avatar,
      type: "campfire",
      members: campfire.members,
      messageCount: campfire.messageCount,
      clipCount: campfire.clipCount,
      lastActivity: campfire.lastActivity,
    })
  }

  const handleCloseChatPanel = () => {
    setSelectedCampfire(null)
  }

  const handleNavigateToSettings = () => {
    setActiveTab("Account Settings")
  }

  const handleUserChange = (user: User | null) => {
    setCurrentUser(user)
    if (user) {
      // Initialize chats for the new user
      MessageSystem.initializeUserChats(user.id)
    }
    // Close any open chat panels when switching users
    setSelectedCampfire(null)
  }

  const handleUserSelect = (user: User) => {
    setCurrentUser(user)
    MessageSystem.initializeUserChats(user.id)
    setActiveTab("Home") // Navigate to home after selecting user
  }

  // Calculate main content margin based on chat panel state - only for Campfires
  const getMainContentMargin = () => {
    if (activeTab === "Campfires" && selectedCampfire) {
      return "ml-[600px]" // Only apply margin in Campfires section
    }
    return ""
  }

  // Get user-specific friends data
  const getUserFriends = () => {
    if (!currentUser) return { online: [], all: [] }
    const friends = UserManager.getFriendsForUser(currentUser.id)
    const onlineFriends = friends.filter((friend) => friend.isOnline)
    return { online: onlineFriends, all: friends }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Chat Panel - Only for Campfires section */}
      {selectedCampfire && activeTab === "Campfires" && currentUser && (
        <ChatPanel participant={selectedCampfire} onClose={handleCloseChatPanel} currentUser={currentUser} />
      )}

      {/* Top Navigation */}
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />

      {/* Main Content */}
      <main className={`transition-all duration-300 ${getMainContentMargin()}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          {activeTab === "Home" && (
            <div>
              <HeroSection />
              <NavigationBar onNavigateToSettings={handleNavigateToSettings} currentUser={currentUser} />
              {contentRows.map((row) => (
                <ContentRow key={row.id} row={row} />
              ))}
            </div>
          )}

          {activeTab === "Friends" && currentUser && (
            <FriendsPage currentUser={currentUser} userFriends={getUserFriends()} />
          )}

          {activeTab === "Campfires" && currentUser && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Most Contacted Campfires */}
                <section>
                  <h2 className="text-[#ff6404] font-bold text-2xl mb-6 flex items-center">
                    <Flame className="w-7 h-7 mr-3" />
                    Your Active Campfires
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mostContactedCampfires.map((campfire) => (
                      <CampfireCard key={campfire.id} campfire={campfire} onClick={handleCampfireClick} />
                    ))}
                  </div>
                </section>

                {/* Most Shared Clips */}
                <section>
                  <h2 className="text-[#ff6404] font-bold text-2xl mb-6 flex items-center">
                    <TrendingUp className="w-7 h-7 mr-3" />
                    Trending Clips
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mostSharedClips.map((clip) => (
                      <ClipPreviewCard key={clip.id} clip={clip} />
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column - Leaderboards */}
              <div className="lg:col-span-1">
                <LeaderboardSection />
              </div>
            </div>
          )}

          {activeTab === "Account Settings" && <AccountSettingsPage currentUser={currentUser} />}

          {activeTab === "User Accounts" && (
            <UserAccountsPage onUserSelect={handleUserSelect} currentUser={currentUser} />
          )}

          {/* Show login prompt if no user is logged in */}
          {!currentUser && activeTab !== "User Accounts" && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#ff6404] mb-4">Welcome to Fire TV</h2>
                <p className="text-gray-400 mb-6">Please sign in to access your content and chat with friends.</p>
                <button
                  onClick={() => setActiveTab("User Accounts")}
                  className="bg-[#ff6404] text-black px-6 py-3 rounded-lg font-semibold hover:bg-orange-500 transition-all duration-300 hover:scale-105"
                >
                  View User Accounts
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
