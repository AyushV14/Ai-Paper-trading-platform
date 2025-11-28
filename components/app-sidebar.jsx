"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  BrainCircuit,
  Briefcase,
  ChartNoAxesCombinedIcon,
  LayoutDashboard,
  Newspaper,
  Settings2,
  Trophy,
} from "lucide-react";
import TopupComp from "./homepage/TopupComp";

import { NavMain } from "./nav-main";
import { TeamSwitcher } from "./team-switcher";
import { LogoSidebar } from "./logo-sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar";
import { useUser } from "@clerk/nextjs";

export function AppSidebar({ ...props }) {
  const { user } = useUser();

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
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Portfolio", url: `/dashboard/portfolio/${user?.id}`, icon: Briefcase },
      { title: "AI Analyst", url: "/dashboard/analyze", icon: BrainCircuit },
      { title: "News", url: "/dashboard/news", icon: Newspaper },
      { title: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy },
      { title: "Settings", url: "/dashboard/settings", icon: Settings2 },
    ],
  };

  const [userBalance, setUserBalance] = React.useState(0);

  const handleBalanceUpdate = (newBalance) => {
    setUserBalance(newBalance);
  };

  // Fetch user's current balance
  React.useEffect(() => {
    const fetchUserBalance = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/users/${user.id}`);
          const userData = await response.json();
          setUserBalance(userData.virtualBalance || 0);
        } catch (error) {
          console.error("Error fetching user balance:", error);
        }
      }
    };
    fetchUserBalance();
  }, [user]);

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
        <TopupComp
          clerkId={user?.id}
          currentBalance={userBalance}
          onBalanceUpdate={handleBalanceUpdate}
        />
      </SidebarContent>
      <SidebarFooter>
        <TeamSwitcher teams={data.teams} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
