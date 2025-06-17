import type { Metadata } from "next"
import { User, Settings, CreditCard, Bell, Shield, HelpCircle, LogOut, Edit3, Camera } from "lucide-react"

export const metadata: Metadata = {
  title: "Account Settings - Manage Your Profile",
  description: "Manage your Prime Video account settings, profile, and preferences",
}

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#0F171E] pt-20 page-transition">
      {/* Header Section */}
      <div className="px-8 md:px-16 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight leading-none mb-8">ACCOUNT</h1>

          {/* Profile Section */}
          <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center hover:bg-[#FF8C42] transition-colors duration-200">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h2 className="text-white text-3xl font-bold">John Doe</h2>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-400 text-lg mb-4">john.doe@email.com</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">prime</span>
                    </div>
                    <span className="text-white font-semibold">Prime Member</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">Member since 2020</span>
                </div>
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
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Sign Out</h3>
                  <p className="text-gray-400 text-sm">Sign out of your account</p>
                </div>
              </div>
              <div className="text-sm text-gray-300">
                <div>• Sign out from all devices</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-gradient-to-r from-[#00A8E1]/10 to-[#1FB6FF]/10 border border-[#00A8E1]/20 rounded-xl p-8">
            <h3 className="text-white font-bold text-2xl mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
