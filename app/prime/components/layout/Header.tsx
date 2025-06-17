"use client"

import Link from "next/link"
import { Search, Grid3X3, User, Bookmark, Menu } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

const navigationItems = [
  { href: "/", label: "HOME" },
  { href: "/movies", label: "MOVIES" },
  { href: "/tv-shows", label: "TV SHOWS" },
  { href: "/live-tv", label: "LIVE TV" },
]

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#0F171E]/95 via-[#0F171E]/90 to-transparent backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center group">
            <div className="flex items-center space-x-1">
              <span className="text-white font-bold text-xl tracking-tight group-hover:text-[#00A8E1] transition-colors">
                prime
              </span>
              <span className="text-white text-xl group-hover:text-[#00A8E1] transition-colors">video</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium px-4 py-2 rounded-xl uppercase text-sm tracking-wider transition-all duration-300 ${
                  isActive(item.href) ? "text-white nav-active" : "text-white/70 hover:text-white hover:bg-white/5"
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
            href="/subscriptions"
            className={`hidden md:flex items-center text-sm font-medium uppercase tracking-wider transition-all duration-300 hover:bg-white/5 px-3 py-2 rounded-lg ${
              isActive("/subscriptions") ? "text-white nav-active" : "text-white/70 hover:text-white"
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
            href="/bookmarks"
            className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
            aria-label="Watchlist"
          >
            <Bookmark className="w-5 h-5" />
          </Link>

          <Link
            href="/account"
            className="bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            aria-label="Account"
          >
            <User className="w-5 h-5 text-white" />
          </Link>

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
                href={item.href}
                className={`block font-medium py-3 px-4 rounded-lg uppercase text-sm tracking-wider transition-all duration-300 ${
                  isActive(item.href) ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/subscriptions"
              className={`block font-medium py-3 px-4 rounded-lg uppercase text-sm tracking-wider transition-all duration-300 ${
                isActive("/subscriptions")
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
  )
}
