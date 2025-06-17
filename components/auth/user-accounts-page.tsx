"use client"
import { useState } from "react"
import { Users, Eye, EyeOff, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { DUMMY_CREDENTIALS, DUMMY_USERS, UserManager, type User } from "@/lib/user-management"

interface UserAccountsPageProps {
  onUserSelect: (user: User) => void
  currentUser: User | null
}

export function UserAccountsPage({ onUserSelect, currentUser }: UserAccountsPageProps) {
  const [showPasswords, setShowPasswords] = useState(false)
  const [copiedCredential, setCopiedCredential] = useState<string | null>(null)

  const handleCopyCredentials = async (email: string, password: string) => {
    const credentials = `Email: ${email}\nPassword: ${password}`
    try {
      await navigator.clipboard.writeText(credentials)
      setCopiedCredential(email)
      setTimeout(() => setCopiedCredential(null), 2000)
    } catch (error) {
      console.error("Failed to copy credentials:", error)
    }
  }

  const handleUserLogin = (credentials: (typeof DUMMY_CREDENTIALS)[0]) => {
    const user = UserManager.authenticateUser(credentials.email, credentials.password)
    if (user) {
      onUserSelect(user)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#ff6404] flex items-center">
          <Users className="w-8 h-8 mr-3" />
          User Accounts
        </h1>
        <button
          onClick={() => setShowPasswords(!showPasswords)}
          className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showPasswords ? "Hide" : "Show"} Passwords</span>
        </button>
      </div>

      <div className="bg-gray-950 rounded-lg p-6 border border-gray-800">
        <h2 className="text-[#ff6404] font-semibold text-lg mb-4">Demo User Accounts</h2>
        <p className="text-gray-400 text-sm mb-6">
          These are the available demo accounts. All passwords are "password123" for simplicity. Click on any user to
          switch to their account.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DUMMY_CREDENTIALS.map((credentials) => {
            const user = DUMMY_USERS.find((u) => u.id === credentials.userId)
            if (!user) return null

            const isCurrentUser = currentUser?.id === user.id

            return (
              <div
                key={user.id}
                className={cn(
                  "bg-gray-900 rounded-lg p-4 border transition-all duration-300 hover:scale-105 cursor-pointer",
                  isCurrentUser ? "border-[#ff6404] bg-[#ff6404]/10" : "border-gray-800 hover:border-[#ff6404]/30",
                )}
                onClick={() => !isCurrentUser && handleUserLogin(credentials)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ff6404] to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-lg">{user.name.charAt(0)}</span>
                    </div>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                    )}
                    {isCurrentUser && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff6404] rounded-full border-2 border-gray-900" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold flex items-center space-x-2">
                      <span>{user.name}</span>
                      {isCurrentUser && <span className="text-[#ff6404] text-xs">(Current)</span>}
                    </h3>
                    <p className="text-gray-400 text-sm">{user.bio}</p>
                    <p className="text-gray-500 text-xs">{user.location}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Email:</span>
                    <span className="text-white text-sm font-mono">{credentials.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Password:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm font-mono">
                        {showPasswords ? credentials.password : "••••••••••"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyCredentials(credentials.email, credentials.password)
                        }}
                        className="p-1 text-gray-400 hover:text-[#ff6404] transition-colors"
                        title="Copy credentials"
                      >
                        {copiedCredential === credentials.email ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className={cn("text-sm", user.isOnline ? "text-green-400" : "text-gray-400")}>
                      {user.status}
                    </span>
                  </div>
                  {user.currentShow && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Watching:</span>
                      <span className="text-[#ff6404] text-sm">{user.currentShow}</span>
                    </div>
                  )}
                </div>

                {!isCurrentUser && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <button className="w-full bg-[#ff6404] text-black py-2 rounded-lg font-medium hover:bg-orange-500 transition-colors">
                      Switch to {user.name.split(" ")[0]}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-gray-950 rounded-lg p-6 border border-gray-800">
        <h2 className="text-[#ff6404] font-semibold text-lg mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="text-white font-medium mb-2">Total Users</h3>
            <p className="text-[#ff6404] text-2xl font-bold">{DUMMY_USERS.length}</p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Online Users</h3>
            <p className="text-green-400 text-2xl font-bold">{DUMMY_USERS.filter((u) => u.isOnline).length}</p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Current User</h3>
            <p className="text-[#ff6404] text-lg font-semibold">{currentUser?.name || "None"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
