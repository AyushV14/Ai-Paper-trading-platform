"use client"

import * as React from "react"
import { ChartNoAxesCombinedIcon } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar"

export function LogoSidebar() {
  const { open } = useSidebar(); 
  const isCollapsed = !open; 
  console.log("Sidebar open:", open, "isCollapsed:", isCollapsed);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className={`
            ${isCollapsed ? "justify-center" : "justify-start gap-3"}
            w-full flex items-center
          `}
        >
          <div
            className={`
              flex aspect-square items-center justify-center rounded-lg 
              bg-sidebar-primary text-sidebar-primary-foreground
              ${isCollapsed ? "size-9 mx-auto p-2" : "size-11"}
            `}
          >
            <ChartNoAxesCombinedIcon
              className={isCollapsed ? "size-7" : "size-8"}
            />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold">BharatlEarns</span>
              <span className="text-xs text-muted-foreground">
                Analyse, Optimise, Grow
              </span>
            </div>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}