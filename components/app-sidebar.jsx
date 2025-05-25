"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  BrainCircuit,
  Briefcase,
  ChartNoAxesCombinedIcon,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  Newspaper,
  PieChart,
  Settings2,
  SquareTerminal,
  Trophy,
  User2Icon,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { LogoSidebar } from "./logo-sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar"

const data = {
  logo: [
    {
      name: "BharatTades",
      logo: ChartNoAxesCombinedIcon,
      plan: "Enterprise",
    },
  ],
  teams: [
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        { title: "Overview", url: "#" },
        { title: "Market Watch", url: "#" },
      ],
    },
    {
      title: "Portfolio",
      url: "#",
      icon: Briefcase,
      items: [
        { title: "My Holdings", url: "#" },
        { title: "P&L Report", url: "#" },
      ],
    },
    {
      title: "AI Analyst", 
      url: "#",
      icon: BrainCircuit, 
      items: [
        { title: "AI Suggestions", url: "#" },
        { title: "Trade Analysis", url: "#" },
        { title: "Mistake Review", url: "#" },
      ],
    },
    {
      title: "News",
      url: "#",
      icon: Newspaper,
      items: [
        { title: "Market News", url: "#" },
        { title: "Stock Alerts", url: "#" },
      ],
    },
    {
      title: "Leaderboard",
      url: "#",
      icon: Trophy,
      items: [
        { title: "Top Traders", url: "#" },
        { title: "My Rank", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "Profile", url: "#" },
        { title: "Preferences", url: "#" },
        { title: "Notifications", url: "#" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const LogoIcon = data.logo[0].logo;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex flex-col items-center gap-2 p-1">
          <LogoSidebar />
        </div>
      </SidebarHeader>
      <hr className="border-t border-sidebar-border mx-4" />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <TeamSwitcher teams={data.teams} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}