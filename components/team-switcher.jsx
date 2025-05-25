"use client"

import * as React from "react"
import { BookOpen, Info, LifeBuoy, Bug } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { SidebarMenuButton } from "./ui/sidebar"

export function TeamSwitcher({ teams }) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organization
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 p-2 cursor-default" disabled>
              <div className="font-medium text-muted-foreground">
                Teams feature coming soon!
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Services
            </DropdownMenuLabel>

            <DropdownMenuItem className="gap-2 p-2">
              <BookOpen className="size-4" />
              Documentation
            </DropdownMenuItem>

            <DropdownMenuItem className="gap-2 p-2">
              <Info className="size-4" />
              About the App
            </DropdownMenuItem>

            <DropdownMenuItem className="gap-2 p-2">
              <Bug className="size-4" />
              Report a Bug / Feedback
            </DropdownMenuItem>

            <DropdownMenuItem className="gap-2 p-2">
              <LifeBuoy className="size-4" />
              Help & Support
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}