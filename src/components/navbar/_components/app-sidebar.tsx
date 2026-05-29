"use client"
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
// import { auth } from "@/lib/auth";
import { ChevronDown } from "lucide-react";
// import { headers } from "next/headers";
import { NewsDropdownSM, NewsPages, SportPages } from "./dropdown-menus";
import { SidebarLink } from "./sidebar-link";

export default function AppSidebar() {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });
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
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="text-lg">
                    Author/Editor/Admin
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

          <SidebarMenuItem>
            <SidebarLink href="/api/auth/register">Register</SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarLink href="/api/auth/signin">Sign in</SidebarLink>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full">
              <X color="black" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarFooter>
    </Sidebar>
  );
}
