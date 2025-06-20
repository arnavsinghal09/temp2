"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";

import { ChevronDown, LogOut, UserPlus } from "lucide-react";
import {
  UserManager,
  DUMMY_CREDENTIALS,
  type User,
} from "@/lib/user-management";

interface AccountSwitcherProps {
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
}

export function AccountSwitcher({
  currentUser,
  onUserChange,
}: AccountSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowLogin(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const user = UserManager.authenticateUser(
      loginForm.email,
      loginForm.password
    );
    if (user) {
      onUserChange(user);
      setShowLogin(false);
      setIsOpen(false);
      setLoginForm({ email: "", password: "" });
    } else {
      setLoginError("Invalid email or password");
    }
  };

  const handleLogout = () => {
    UserManager.logout();
    onUserChange(null);
    setIsOpen(false);
  };

  const handleQuickSwitch = (credentials: (typeof DUMMY_CREDENTIALS)[0]) => {
    const user = UserManager.authenticateUser(
      credentials.email,
      credentials.password
    );
    if (user) {
      onUserChange(user);
      setIsOpen(false);
    }
  };

  const getCampfireNames = (campfireIds: number[]) => {
    const campfireNames: { [key: number]: string } = {
      1: "Movie Night Squad",
      2: "Binge Busters",
      3: "Weekend Warriors",
    };
    return campfireIds
      .map((id) => campfireNames[id] || `Campfire ${id}`)
      .join(", ");
  };

  if (!currentUser) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-gray-300" />
          </div>
          <span className="text-gray-300 text-sm">Sign In</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-12 w-80 bg-gray-950 border border-gray-800 rounded-lg shadow-2xl z-50 p-4">
            {!showLogin ? (
              <div>
                <h3 className="text-[#ff6404] font-semibold mb-4">
                  Quick Account Switch
                </h3>
                <div className="space-y-2 mb-4">
                  {DUMMY_CREDENTIALS.map((cred) => {
                    const user = UserManager.getUserById(cred.userId);
                    return (
                      <button
                        key={cred.userId}
                        onClick={() => handleQuickSwitch(cred)}
                        className="w-full flex items-center space-x-3 p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-[#ff6404] to-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-xs">
                            {user?.name.charAt(0)}
                          </span>
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-white text-sm font-medium">
                            {user?.name}
                          </p>
                          <p className="text-gray-400 text-xs">{cred.email}</p>
                          {user?.campfires && user.campfires.length > 0 && (
                            <p className="text-[#ff6404] text-xs">
                              {user.campfires.length} campfire
                              {user.campfires.length !== 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                        {user?.isOnline && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setShowLogin(true)}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-[#ff6404] text-black rounded-lg font-medium hover:bg-orange-500 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Custom Login</span>
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-[#ff6404] font-semibold mb-4">Sign In</h3>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#ff6404] focus:outline-none"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#ff6404] focus:outline-none"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  {loginError && (
                    <p className="text-red-400 text-sm">{loginError}</p>
                  )}
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowLogin(false)}
                      className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#ff6404] text-black py-2 rounded-lg font-medium hover:bg-orange-500 transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-xs mb-2">
                    Demo Credentials:
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Email: ashu@example.com</p>
                    <p>Password: password123</p>
                    <p className="text-[#ff6404]">All users use password123</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-[#ff6404] to-orange-600 rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-sm">
            {currentUser.name.charAt(0)}
          </span>
        </div>
        <div className="text-left">
          <p className="text-white text-sm font-medium">{currentUser.name}</p>
          <p className="text-gray-400 text-xs">{currentUser.status}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-gray-950 border border-gray-800 rounded-lg shadow-2xl z-50 p-4">
          <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-800">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff6404] to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">
                {currentUser.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-white font-semibold">{currentUser.name}</h3>
              <p className="text-gray-400 text-sm">{currentUser.email}</p>
              <p className="text-[#ff6404] text-xs">{currentUser.status}</p>
              {currentUser.campfires && currentUser.campfires.length > 0 && (
                <p className="text-gray-400 text-xs">
                  Campfires: {getCampfireNames(currentUser.campfires)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <h4 className="text-gray-400 text-sm font-medium">
              Switch Account
            </h4>
            {DUMMY_CREDENTIALS.filter(
              (cred) => cred.userId !== currentUser.id
            ).map((cred) => {
              const user = UserManager.getUserById(cred.userId);
              return (
                <button
                  key={cred.userId}
                  onClick={() => handleQuickSwitch(cred)}
                  className="w-full flex items-center space-x-3 p-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#ff6404] to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xs">
                      {user?.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-white text-sm">{user?.name}</p>
                    <p className="text-gray-400 text-xs">{user?.status}</p>
                  </div>
                  {user?.isOnline && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
