"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NewsDropdownSM, NewsPages, SportPages } from "./dropdown-menus";
import { SidebarLink } from "./sidebar-link";

export default function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarLink href="/">Home</SidebarLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Dropdown components */}
        <SidebarGroup>
          <SidebarMenu>
            <NewsDropdownSM label="News" links={NewsPages} />
            <NewsDropdownSM label="Sports" links={SportPages} />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
