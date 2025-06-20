"use client"

import { useEffect, useState } from "react"
import { useStorageListener } from "../hooks/use-storage-listener"

import { useRouter } from "next/navigation"
import { User, Settings, CreditCard, Bell, Shield, HelpCircle, LogOut, Edit3, Camera, Users, Heart, Crown } from "lucide-react"
import { usePrimeAuthStore } from "../lib/stores/auth"
import { PrimeUserDataService } from "../lib/services/user-data"
import type { Metadata } from "next"
const metadata: Metadata = {
  title: "Account Settings - Manage Your Profile",
  description: "Manage your Prime Video account settings, profile, and preferences",
}

export default function AccountPage() {
  const router = useRouter()
  const { user, setUser, logout } = usePrimeAuthStore()
  const [loading, setLoading] = useState(true)

  // Add storage listener for prime-user changes
const { timestamp } = useStorageListener("prime-user")

useEffect(() => {
  console.log('Prime Account: Storage change detected, reinitializing user data')
  
  // Clear current user and loading state
  setLoading(true)
  if (user) {
    setUser(null)
  }
  
  // Initialize user data from FireStories
  const completeUserData = PrimeUserDataService.initializeFromFireStories()
  
  if (completeUserData) {
    setUser(completeUserData)
    console.log('Prime Account: User initialized/updated:', {
      user: completeUserData.name,
      friends: completeUserData.friends?.length || 0,
      campfires: completeUserData.campfires?.length || 0
    })
  } else {
    // If no user data available, redirect to main app
    console.log('Prime Account: No user data found, redirecting to FireStories')
    router.push("/")
    return
  }
  
  setLoading(false)
}, [timestamp, setUser, router]) // React to storage changes via timestamp


  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleBackToFireStories = () => {
    router.push("/")
  }

  const getCampfireNames = (campfireIds: number[]) => {
    const campfireNames: { [key: number]: string } = {
      1: "Movie Night Squad",
      2: "Binge Busters", 
      3: "Weekend Warriors",
    }
    return campfireIds
      .map((id) => campfireNames[id] || `Campfire ${id}`)
      .join(", ")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F171E] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A8E1] mx-auto mb-4"></div>
          <p className="text-white">Loading account...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F171E] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please sign in through FireStories to access Prime Video</p>
          <button
            onClick={handleBackToFireStories}
            className="bg-[#00A8E1] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#1FB6FF] transition-colors"
          >
            Go to FireStories
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F171E] pt-20 page-transition">
      {/* Header Section */}
      <div className="px-8 md:px-16 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight leading-none">ACCOUNT</h1>
            <button
              onClick={handleBackToFireStories}
              className="bg-gray-600 bg-opacity-70 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-opacity-60 transition-colors"
            >
              Back to FireStories
            </button>
          </div>

          {/* Profile Section */}
          <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">{user.name.charAt(0)}</span>
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center hover:bg-[#FF8C42] transition-colors duration-200">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h2 className="text-white text-3xl font-bold">{user.name}</h2>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-400 text-lg mb-4">{user.email}</p>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">prime</span>
                    </div>
                    <span className="text-white font-semibold">Prime Member</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">Connected via FireStories</span>
                </div>
                
                {/* Display user info from FireStories */}
                {user.bio && (
                  <p className="text-gray-300 text-sm mb-2">{user.bio}</p>
                )}
                {user.location && (
                  <p className="text-gray-400 text-sm mb-3">📍 {user.location}</p>
                )}
                
                {/* Social connections */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#00A8E1]" />
                    <span className="text-white">{user.friends?.length || 0} friends</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-[#FF6B35]" />
                    <span className="text-white">{user.campfires?.length || 0} campfires</span>
                  </div>
                  {user.isOnline && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-400">Online</span>
                    </div>
                  )}
                </div>
                
                {/* Campfires list */}
                {user.campfires && user.campfires.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-800/30 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Active Campfires:</p>
                    <p className="text-[#FF6B35] text-sm">{getCampfireNames(user.campfires.map(c => c.id))}</p>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-white font-bold text-2xl">$12.99</div>
                <div className="text-gray-400">per month</div>
                <button className="text-[#00A8E1] hover:text-[#1FB6FF] text-sm font-semibold mt-2 transition-colors duration-200">
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Account Settings */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Account Settings</h3>
                  <p className="text-gray-400 text-sm">Manage your account details</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div>• Personal information</div>
                <div>• Email preferences</div>
                <div>• Password & security</div>
              </div>
            </div>

            {/* Payment & Billing */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Payment & Billing</h3>
                  <p className="text-gray-400 text-sm">Manage payment methods</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div>• Payment methods</div>
                <div>• Billing history</div>
                <div>• Subscription details</div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Notifications</h3>
                  <p className="text-gray-400 text-sm">Control your notifications</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div>• Email notifications</div>
                <div>• Push notifications</div>
                <div>• Marketing preferences</div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Privacy & Security</h3>
                  <p className="text-gray-400 text-sm">Protect your account</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div>• Two-factor authentication</div>
                <div>• Privacy settings</div>
                <div>• Data management</div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Help & Support</h3>
                  <p className="text-gray-400 text-sm">Get help when you need it</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div>• Contact support</div>
                <div>• FAQ & guides</div>
                <div>• Report an issue</div>
              </div>
            </div>

            {/* Sign Out */}
            <div 
              onClick={handleLogout}
              className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Sign Out</h3>
                  <p className="text-gray-400 text-sm">Sign out and return to FireStories</p>
                </div>
              </div>
              <div className="text-sm text-gray-300">
                <div>• Sign out from Prime Video</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-gradient-to-r from-[#00A8E1]/10 to-[#1FB6FF]/10 border border-[#00A8E1]/20 rounded-xl p-8">
            <h3 className="text-white font-bold text-2xl mb-6">Quick Actions</h3>
            <button className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-lg transition-all duration-300 text-left">
                <div className="font-semibold mb-1">Download for Offline</div>
                <div className="text-gray-400 text-sm">Manage your downloads</div>
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-lg transition-all duration-300 text-left">
                <div className="font-semibold mb-1">Parental Controls</div>
                <div className="text-gray-400 text-sm">Set viewing restrictions</div>
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-lg transition-all duration-300 text-left">
                <div className="font-semibold mb-1">Viewing History</div>
                <div className="text-gray-400 text-sm">See what you've watched</div>
              </button>
            </button>
          </div>

          {/* FireStories Integration Info */}
          <div className="mt-8 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C42]/10 border border-[#FF6B35]/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="w-6 h-6 text-[#FF6B35]" />
              <h3 className="text-white font-bold text-lg">Connected to FireStories</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Your Prime Video account is seamlessly connected to your FireStories profile. 
              Share clips and enjoy content with your friends and campfires.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-[#FF6B35] font-bold text-lg">{user.friends?.length || 0}</div>
                <div className="text-gray-400">Friends</div>
              </div>
              <div className="text-center">
                <div className="text-[#FF6B35] font-bold text-lg">{user.campfires?.length || 0}</div>
                <div className="text-gray-400">Campfires</div>
              </div>
              <div className="text-center">
                <div className="text-[#FF6B35] font-bold text-lg">{user.status === "Watching Prime Video" ? "Active" : "Ready"}</div>
                <div className="text-gray-400">Status</div>
              </div>
              <div className="text-center">
                <div className="text-[#FF6B35] font-bold text-lg">Premium</div>
                <div className="text-gray-400">Account Type</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
