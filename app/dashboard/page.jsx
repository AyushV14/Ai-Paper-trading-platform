"use client";

import { AppSidebar } from "../../components/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { Header } from "../../components/homepage/Header";
import { PageContent } from "../../components/homepage/PageContent";

export default function Page() {
  return (
    <SidebarProvider>
      {/* AppSidebar: Sidebar component that provides the main navigation */}
      <AppSidebar />

      <SidebarInset>
        {/* Header: Header section with breadcrumbs and user profile */}
        <Header />

        {/* PageContent: Main page body content */}
        <PageContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
