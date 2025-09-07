"use client";
import { AppSidebar } from "../../components/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { Header } from "../../components/homepage/Header";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* Sidebar on the left */}
        <div style={{ flexShrink: 0 }}>
          <AppSidebar />
        </div>

        {/* Main content area */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
          <Header />
          <main style={{ flexGrow: 1, padding: "1rem", overflowY: "auto" }}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
