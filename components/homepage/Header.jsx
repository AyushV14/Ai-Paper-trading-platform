"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
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

export const Header = () => {
  const { user, isLoaded } = useUser();

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

  if (!isLoaded) {
    return (
      <header className="flex h-16 shrink-0 items-center justify-between px-4">
        {/* Left: Loading breadcrumbs */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gray-200 animate-pulse" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex gap-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Right: Loading user profile */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-1">
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-2 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  const currentUser = {
    name: user.fullName || "Unknown",
    email: user.primaryEmailAddress?.emailAddress || "No email",
    avatar: user.imageUrl || "",
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Explore</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right: User Profile */}
      <div>
        <NavUser user={currentUser} />
      </div>
    </header>
  );
};