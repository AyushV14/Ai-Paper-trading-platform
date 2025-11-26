"use client";
import { AppSidebar } from "../../../components/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../../components/ui/sidebar";

export default function leaderboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="w-screen h-screen overflow-hidden">
        {/* Sidebar on the left */}
        <div className="">
          <AppSidebar />
        </div>

        {/* Main content area */}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
