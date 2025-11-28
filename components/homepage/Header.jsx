"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { syncUserToDB } from "../../lib/useSyncUser";
import { NavUser } from "../nav-user";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import SearchBar from "../homepage/SearchBar";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { user, isLoaded } = useUser();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef();
  const router = useRouter(); // ✅ Correct usage

  const handleSelect = (item) => {
    console.log("Selected:", item);
    setSearchOpen(false);
  };

  const onDashboardClick = () => {
    router.push("/dashboard"); // Navigate to dashboard
  };

  useEffect(() => {
    if (isLoaded && user) {
      const userData = {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        profileImage: user.imageUrl,
      };
      syncUserToDB(userData);
    }
  }, [isLoaded, user]);

  // Close search if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-16 w-full flex items-center justify-between px-4 border-b border-gray-200">
        {/* Loading skeletons */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gray-200 animate-pulse" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex gap-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-1">
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-2 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const currentUser = {
    name: user.fullName || "Unknown",
    email: user.primaryEmailAddress?.emailAddress || "No email",
    avatar: user.imageUrl || "",
  };

  return (
    <div
      ref={headerRef}
      className="h-16 w-full flex items-center justify-between px-4 border-b border-gray-200 relative z-50"
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 block md:hidden" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                onClick={onDashboardClick}
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 font-medium">
                Explore
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex-1 mx-4 relative">
        {/* Search overlay */}
        {searchOpen && (
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity" />
        )}

        <div id="search-bar">
          <SearchBar
            query={searchQuery}
            setQuery={setSearchQuery}
            isFocused={searchOpen}
            setIsFocused={setSearchOpen}
            onSelect={handleSelect}
          />
        </div>
      </div>

      <div>
        <NavUser user={currentUser} />
      </div>
    </div>
  );
};
