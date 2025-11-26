"use client";
import { AppSidebar } from "../../../components/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../../components/ui/sidebar";

export default function NewsLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden w-screen">
        {/* Sidebar on the left */}
        <div className="flex-shrink-0">
          <AppSidebar />
        </div>

        {/* Main content area */}
        <div className="overflow-y-auto h-screen  bg-gray-50">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
