"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./lib/stores/auth";

export default function NetflixHomePage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    // Always redirect to browse page - auth is handled by FireStories
    router.push("/netflix/browse");
  }, [router]);

  // Loading screen while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-netflix-red mb-8">NETFLIX</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mx-auto mb-4"></div>
        <p className="text-white">Loading Netflix...</p>
      </div>
    </div>
  );
}
