"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import { NewsDropdownSM, NewsPages, SportPages } from "./dropdown-menus";
import { SidebarLink } from "./sidebar-link";
import { NavbarClientProps } from "./navbar-client";

export default function SidebarClient({ hasPermission }: NavbarClientProps) {
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
        {/* User section */}
        {hasPermission && (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="text-lg">
                      Editor tools
                      <ChevronDown color="black" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <SidebarLink href="/article/add-article">
                        Create article
                      </SidebarLink>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
