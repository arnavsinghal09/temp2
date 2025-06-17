"use client"
import { useState } from "react"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { friendRequests } from "@/lib/data"
import type { FriendRequest, ChatParticipant, User } from "@/lib/types"
import { ChatPanel } from "@/components/campfires/chat-panel"

interface FriendsPageProps {
  currentUser: User
  userFriends: {
    online: User[]
    all: User[]
  }
}

interface FriendCardProps {
  friend: User
  showWatchTogether?: boolean
  onMessageClick?: (friend: User) => void
}

function FriendCard({ friend, showWatchTogether = false, onMessageClick }: FriendCardProps) {
  return (
    <div className="bg-gray-950 rounded-lg p-6 border border-gray-800 hover:border-[#ff6404]/30 transition-all duration-500 hover:scale-105 transform-gpu">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <img src={friend.avatar || "/placeholder.svg"} alt={friend.name} className="w-12 h-12 rounded-full" />
          <div
            className={cn(
              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black",
              friend.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-500",
            )}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">{friend.name}</h3>
          <p className={cn("text-sm", friend.isOnline ? "text-[#ff6404]" : "text-gray-400")}>{friend.status}</p>
          {friend.currentShow && <p className="text-gray-400 text-xs">Currently: {friend.currentShow}</p>}
        </div>
      </div>
      {showWatchTogether ? (
        <div className="flex space-x-2">
          <button className="flex-1 bg-[#ff6404] text-black py-2 rounded-lg font-medium hover:bg-orange-500 transition-all duration-300">
            Watch Together
          </button>
          <button
            onClick={() => onMessageClick?.(friend)}
            className="flex-1 bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300"
          >
            Message
          </button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <button className="flex-1 bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300">
            View Profile
          </button>
          <button
            onClick={() => onMessageClick?.(friend)}
            className="flex-1 bg-[#ff6404] text-black py-2 rounded-lg font-medium hover:bg-orange-500 transition-all duration-300"
          >
            Message
          </button>
        </div>
      )}
    </div>
  )
}

interface FriendRequestCardProps {
  request: FriendRequest
  onAccept: (request: FriendRequest) => void
  onReject: (request: FriendRequest) => void
}

function FriendRequestCard({ request, onAccept, onReject }: FriendRequestCardProps) {
  return (
    <div className="bg-gray-950 rounded-lg p-6 border border-gray-800 hover:border-[#ff6404]/30 transition-all duration-500 hover:scale-105 transform-gpu">
      <div className="flex items-center space-x-4 mb-4">
        <img src={request.avatar || "/placeholder.svg"} alt={request.name} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <h3 className="text-white font-semibold">{request.name}</h3>
          <p className="text-gray-400 text-sm">{request.mutualFriends} mutual friends</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onAccept(request)}
          className="flex-1 bg-[#ff6404] text-black py-2 rounded-lg font-medium hover:bg-orange-500 transition-all duration-300"
        >
          Accept
        </button>
        <button
          onClick={() => onReject(request)}
          className="flex-1 bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300"
        >
          Decline
        </button>
      </div>
    </div>
  )
}

export function FriendsPage({ currentUser, userFriends }: FriendsPageProps) {
  const [activeTab, setActiveTab] = useState("online")
  const [pendingRequests, setPendingRequests] = useState(friendRequests)
  const [selectedFriend, setSelectedFriend] = useState<ChatParticipant | null>(null)

  const handleAcceptRequest = (request: FriendRequest) => {
    setPendingRequests(pendingRequests.filter((req) => req.id !== request.id))
    // In a real app, you would add this friend to your friends list
  }

  const handleRejectRequest = (request: FriendRequest) => {
    setPendingRequests(pendingRequests.filter((req) => req.id !== request.id))
  }

  const handleMessageFriend = (friend: User) => {
    setSelectedFriend({
      id: friend.id,
      name: friend.name,
      avatar: friend.avatar,
      isOnline: friend.isOnline,
      status: friend.status,
      type: "friend",
    })
  }

  const handleCloseChat = () => {
    setSelectedFriend(null)
  }

  return (
    <>
      {/* Chat Panel - Positioned absolutely to not affect layout */}
      {selectedFriend && <ChatPanel participant={selectedFriend} onClose={handleCloseChat} currentUser={currentUser} />}

      {/* Friends Content - No margin adjustment needed */}
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#ff6404] flex items-center">
            <Users className="w-8 h-8 mr-3" />
            Friends
          </h1>
          <button className="bg-[#ff6404] text-black px-6 py-3 rounded-lg font-semibold hover:bg-orange-500 transition-all duration-300 hover:scale-105">
            Add Friend
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-900 rounded-lg p-1 w-fit">
          {[
            { id: "online", label: `Online (${userFriends.online.length})` },
            { id: "all", label: `All Friends (${userFriends.all.length})` },
            { id: "requests", label: `Requests (${pendingRequests.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 rounded-md text-sm font-medium transition-all duration-300",
                activeTab === tab.id
                  ? "bg-[#ff6404] text-black"
                  : "text-gray-400 hover:text-[#ff6404] hover:bg-gray-800",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Friends List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "online" &&
            userFriends.online.map((friend) => (
              <FriendCard key={friend.id} friend={friend} showWatchTogether onMessageClick={handleMessageFriend} />
            ))}

          {activeTab === "all" &&
            userFriends.all.map((friend) => (
              <FriendCard key={friend.id} friend={friend} onMessageClick={handleMessageFriend} />
            ))}

          {activeTab === "requests" &&
            pendingRequests.map((request) => (
              <FriendRequestCard
                key={request.id}
                request={request}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
              />
            ))}
        </div>
      </div>
    </>
  )
}
