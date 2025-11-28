// layout.jsx
"use client";
import { AppSidebar } from "../../components/app-sidebar";
import { SidebarProvider } from "../../components/ui/sidebar";
import { Header } from "../../components/homepage/Header";
import NotificationPanel from "../../components/notifications/NotificationPanel";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        <div className="flex-shrink-0">
          <AppSidebar />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <NotificationPanel />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}