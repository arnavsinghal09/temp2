"use client";
import { useState, useRef, useEffect } from "react";
import { dispatchStorageChange } from "@/app/prime/hooks/use-storage-listener"
import { Settings, Search, Home, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { streamingServices } from "@/lib/data";
import { NotificationBell } from "./notification-bell";
import { SearchOverlay } from "./search-overlay";
import { GridOverlay } from "./grid-overlay";
import { AccountSwitcher } from "@/components/auth/account-switcher";
import type { User } from "@/lib/user-management";
import { useRouter } from "next/navigation";
import { UserManager } from "@/lib/user-management";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
}

export function TopNavigation({
  activeTab,
  setActiveTab,
  tabs,
  currentUser,
  onUserChange,
}: NavigationProps) {
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [accountInfoPosition, setAccountInfoPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showSearch, setShowSearch] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const accountButtonRef = useRef<HTMLDivElement>(null);
  const accountPopupRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleNavigateToSettings = () => {
    setActiveTab("Account Settings");
    setShowAccountInfo(false);
  };

  const handleSettingsClick = () => {
    setActiveTab("Account Settings");
  };

  const handleNavigateToAccounts = () => {
    setActiveTab("User Accounts");
  };

  return (
    <>
      <div className="bg-black/95 backdrop-blur-sm border-b border-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Profile and Navigation */}
            <div className="flex items-center space-x-6">
              <AccountSwitcher
                currentUser={currentUser}
                onUserChange={onUserChange}
              />
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 rounded-lg transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-[#ff6404] transform-gpu will-change-transform",
                      activeTab === tab
                        ? "bg-[#ff6404] text-black font-semibold scale-105"
                        : "text-[#ff6404] hover:text-white hover:bg-gray-900 hover:scale-105"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - Notifications and Settings */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNavigateToAccounts}
                className="px-3 py-2 text-gray-400 hover:text-[#ff6404] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ff6404] rounded-lg text-sm"
              >
                Accounts
              </button>
              <NotificationBell />
              <button
                onClick={handleSettingsClick}
                className="p-2 text-gray-400 hover:text-[#ff6404] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ff6404] rounded-lg"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <SearchOverlay
        isVisible={showSearch}
        onClose={() => setShowSearch(false)}
      />
      <GridOverlay isVisible={showGrid} onClose={() => setShowGrid(false)} />
    </>
  );
}

export function NavigationBar({
  onNavigateToSettings,
  currentUser,
}: {
  onNavigateToSettings: () => void;
  currentUser: User | null;
}) {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const handleAccountClick = () => {
    onNavigateToSettings();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 bg-gray-950 rounded-lg p-4">
        {/* Left side - Profile Avatar and Navigation Icons */}
        <div className="flex items-center space-x-4">
          {currentUser && (
            <div
              onClick={handleAccountClick}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6404] to-orange-600 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
            >
              <span className="text-black font-bold">
                {currentUser.name.charAt(0)}
              </span>
            </div>
          )}

          <button
            onClick={() => setShowGrid(true)}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff6404]"
          >
            <Grid3X3 className="w-6 h-6 text-gray-400" />
          </button>
          <button
            onClick={() => setShowSearch(true)}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff6404]"
          >
            <Search className="w-6 h-6 text-gray-400" />
          </button>
          <button className="p-3 bg-[#ff6404] rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff6404]">
            <Home className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Right side - Streaming Services */}
        <div className="flex items-center space-x-3">
          {streamingServices.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setSelectedService(
                  selectedService === service.id ? null : service.id
                );

                // Special handling for Netflix - pass complete user data
                if (service.redirectUrl === "/netflix") {
                  if (currentUser) {
                    // Get user's friends (all other users)
                    const allUsers = UserManager.getAllUsers();
                    const userFriends = allUsers
                      .filter((u) => u.id !== currentUser.id)
                      .map((u) => ({
                        id: u.id,
                        name: u.name,
                        avatar: u.avatar,
                        isOnline: u.isOnline,
                        status: u.status,
                      }));

                    // Get user's campfires
                    const userCampfires =
                      currentUser.campfires?.map((campfireId) => {
                        const campfireNames: { [key: number]: string } = {
                          1: "Movie Night Squad",
                          2: "Binge Busters",
                          3: "Weekend Warriors",
                        };
                        const campfireMembers: { [key: number]: string[] } = {
                          1: ["Ashu Sharma", "Aryav Gupta", "Divya Sharma"],
                          2: ["Ashu Sharma", "Arnav Nigam"],
                          3: ["Aryav Gupta", "Arnav Nigam"],
                        };
                        return {
                          id: campfireId,
                          name:
                            campfireNames[campfireId] ||
                            `Campfire ${campfireId}`,
                          avatar: "/placeholder.svg?height=60&width=60",
                          members: campfireMembers[campfireId] || [],
                          memberCount: campfireMembers[campfireId]?.length || 0,
                        };
                      }) || [];

                    const netflixUserData = {
                      id: currentUser.id,
                      name: currentUser.name,
                      avatar: currentUser.avatar,
                      email: currentUser.email,
                      friends: userFriends,
                      campfires: userCampfires,
                    };

                    localStorage.setItem(
                      "netflix-user",
                      JSON.stringify(netflixUserData)
                    );
                    console.log("Passing complete user data to Netflix:", {
                      user: netflixUserData.name,
                      friends: netflixUserData.friends.length,
                      campfires: netflixUserData.campfires.length,
                    });
                  }
                }
                // Special handling for Prime Video 
                if (service.redirectUrl === "/prime") {
                  if (currentUser) {
                    // Get user's friends (all other users)
                    const allUsers = UserManager.getAllUsers();
                    const userFriends = allUsers
                      .filter((u) => u.id !== currentUser.id)
                      .map((u) => ({
                        id: u.id,
                        name: u.name,
                        avatar: u.avatar,
                        isOnline: u.isOnline,
                        status: u.status,
                      }));

                    // Get user's campfires
                    const userCampfires =
                      currentUser.campfires?.map((campfireId) => {
                        const campfireNames: { [key: number]: string } = {
                          1: "Movie Night Squad",
                          2: "Binge Busters",
                          3: "Weekend Warriors",
                        };
                        const campfireMembers: { [key: number]: string[] } = {
                          1: ["Ashu Sharma", "Aryav Gupta", "Divya Sharma"],
                          2: ["Ashu Sharma", "Arnav Nigam"],
                          3: ["Aryav Gupta", "Arnav Nigam"],
                        };
                        return {
                          id: campfireId,
                          name:
                            campfireNames[campfireId] ||
                            `Campfire ${campfireId}`,
                          avatar: "/placeholder.svg?height=60&width=60",
                          members: campfireMembers[campfireId] || [],
                          memberCount: campfireMembers[campfireId]?.length || 0,
                        };
                      }) || [];

                    const primeUserData = {
                      id: currentUser.id,
                      name: currentUser.name,
                      avatar: currentUser.avatar,
                      email: currentUser.email,
                      bio: currentUser.bio,
                      location: currentUser.location,
                      isOnline: currentUser.isOnline,
                      status: currentUser.status,
                      friends: userFriends,
                      campfires: userCampfires,
                    };

                    const primeUserDataString = JSON.stringify(primeUserData);
                    localStorage.setItem("prime-user", primeUserDataString);

                    // Dispatch custom event to notify Prime Video of the change
                    dispatchStorageChange("prime-user", primeUserDataString);

                    console.log("Passing complete user data to Prime Video:", {
                      user: primeUserData.name,
                      friends: primeUserData.friends.length,
                      campfires: primeUserData.campfires.length,
                    });
                  } else {
                    // Clear Prime Video user data if no current user
                    localStorage.removeItem("prime-user");
                    dispatchStorageChange("prime-user", null);
                  }
                }



                router.push(service.redirectUrl || "/");
              }}
              className={cn(
                "px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff6404] hover:scale-105",
                selectedService === service.id
                  ? "bg-[#ff6404] text-black"
                  : "bg-black border border-[#ff6404] text-[#ff6404] hover:bg-[#ff6404] hover:text-black"
              )}
            >
              {service.shortName}
            </button>
          ))}
        </div>
      </div>

      <SearchOverlay
        isVisible={showSearch}
        onClose={() => setShowSearch(false)}
      />
      <GridOverlay isVisible={showGrid} onClose={() => setShowGrid(false)} />
    </>
  );
}
