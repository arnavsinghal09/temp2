"use client"
import { useStorageListener } from "../../hooks/use-storage-listener"
import Link from "next/link"
import { Search, Grid3X3, User, Bookmark, Menu, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { usePrimeAuthStore } from "../../lib/stores/auth"
import { PrimeUserDataService } from "../../lib/services/user-data"

const navigationItems = [
  { href: "/", label: "HOME" },
  { href: "/movies", label: "MOVIES" },
  { href: "/tv-shows", label: "TV SHOWS" },
]

export default function Header() {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const pathname = usePathname()
  const { user, setUser, logout } = usePrimeAuthStore()

  // Initialize user data on component mount
  // Add storage listener for prime-user changes
  const { timestamp } = useStorageListener("prime-user")

  // Initialize user data on component mount and when storage changes
  useEffect(() => {
    console.log('Prime Header: Storage change detected, reinitializing user data')

    // Clear current user first
    if (user) {
      setUser(null)
    }

    // Try to initialize from FireStories data
    const completeUserData = PrimeUserDataService.initializeFromFireStories()

    if (completeUserData) {
      setUser(completeUserData)
      console.log('Prime Header: User initialized/updated:', {
        user: completeUserData.name,
        friends: completeUserData.friends?.length || 0,
        campfires: completeUserData.campfires?.length || 0
      })
    } else {
      console.log('Prime Header: No user data found, user cleared')
    }
  }, [timestamp, setUser]) // React to storage changes via timestamp

  // Remove the old useEffect that only ran on mount


  const isActive = (path: string) => {
    if (path === "/prime" && pathname === "/prime") return true
    if (path !== "/prime" && pathname.startsWith(path)) return true
    return false
  }

  const handleBackToFireStories = () => {
    router.push("/")
  }

  const handleLogout = () => {
    logout()
    setShowProfileMenu(false)
    router.push("/")
  }

  const handleProfileClick = () => {
    router.push("/prime/account")
    setShowProfileMenu(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#0F171E]/95 via-[#0F171E]/90 to-transparent backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-8">
          <Link href="/prime" className="flex items-center group">
            <div className="flex items-center space-x-1">
              <span className="text-white font-bold text-xl tracking-tight group-hover:text-[#00A8E1] transition-colors">
                prime
              </span>
              <span className="text-white text-xl group-hover:text-[#00A8E1] transition-colors">
                video
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={`/prime${item.href}`}
                className={`font-medium px-4 py-2 rounded-xl uppercase text-sm tracking-wider transition-all duration-300 ${isActive(item.href)
                    ? "text-white nav-active"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1">
            <div className="bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] flex items-center justify-center shadow-lg h-[26px] rounded-full w-[41px]">
              <span className="text-white text-xs font-bold">prime</span>
            </div>
          </div>

          <Link
            href="/prime/subscriptions"
            className={`hidden md:flex items-center text-sm font-medium uppercase tracking-wider transition-all duration-300 hover:bg-white/5 px-3 py-2 rounded-lg ${isActive("/subscriptions")
                ? "text-white nav-active"
                : "text-white/70 hover:text-white"
              }`}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            SUBSCRIPTIONS
          </Link>

          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/prime/bookmarks"
            className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
            aria-label="Watchlist"
          >
            <Bookmark className="w-5 h-5" />
          </Link>

          {/* Back to FireStories Button */}
          <button
            onClick={handleBackToFireStories}
            className="bg-gray-600 bg-opacity-70 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-opacity-60 transition-colors"
          >
            Back to FireStories
          </button>

          {/* User Profile Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#00A8E1] to-[#1FB6FF] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium">{user.name}</p>
                  <p className="text-gray-400 text-xs">{user.status}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-64 bg-[#0F171E] border border-gray-700 rounded-lg shadow-2xl z-50 p-4">
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00A8E1] to-[#1FB6FF] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{user.name}</h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <p className="text-[#00A8E1] text-xs">{user.status}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Account Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/prime/account"
              className="bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              aria-label="Account"
            >
              <User className="w-5 h-5 text-white" />
            </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="px-6 pb-4 bg-[#0F171E]/95 backdrop-blur-xl border-t border-white/5">
          <div className="relative max-w-lg">
            <input
              type="text"
              placeholder="Search movies and TV shows"
              className="w-full bg-white/10 text-white px-4 py-3 pl-12 rounded-xl border border-white/20 focus:border-[#00A8E1] focus:outline-none focus:ring-2 focus:ring-[#00A8E1]/20 placeholder-white/50 backdrop-blur-sm transition-all duration-300"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0F171E]/95 backdrop-blur-xl border-t border-white/5">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={`/prime${item.href}`}
                className={`block font-medium py-3 px-4 rounded-lg uppercase text-sm tracking-wider transition-all duration-300 ${isActive(item.href)
                    ? "text-white bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/prime/subscriptions"
              className={`block font-medium py-3 px-4 rounded-lg uppercase text-sm tracking-wider transition-all duration-300 ${isActive("/subscriptions")
                  ? "text-white bg-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              SUBSCRIPTIONS
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
