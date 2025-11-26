"use client";
import { AppSidebar } from "../../../components/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../../components/ui/sidebar";

export default function AnalyzeLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden border w-screen ">
        {/* Sidebar on the left */}
        <div className="">
          <AppSidebar />
        </div>

        {/* Main content area */}
        <div className="overflow-auto h-screen bg-gray-50">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
