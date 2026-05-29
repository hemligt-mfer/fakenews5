import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { SidebarLink } from "./sidebar-link";

export const NewsPages: { title: string; href: string }[] = [
  {
    title: "Ekonomi",
    href: "/",
  },
  {
    title: "Inrikes",
    href: "/",
  },
  {
    title: "Väder",
    href: "/",
  },
  {
    title: "Utrikes",
    href: "/",
  },
  {
    title: "Register",
    href: "/api/auth/register",
  },
];

export const SportPages: { title: string; href: string }[] = [
  {
    title: "Football",
    href: "/",
  },
  {
    title: "Icehockey",
    href: "/",
  },
  {
    title: "Tennis",
    href: "/",
  },
  {
    title: "Boule",
    href: "/",
  },
];

type NavLink = { title: string, href: string}

export function NewsDropdown({label, links}:{label: string, links: NavLink[]}){
  return (
   <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-white">
                  {label}
                  <ChevronDown color="white" />
                </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="grid grid-cols-2 min-w-sm p-1">
          {links.map((page) => (
            <DropdownMenuItem key={page.title} asChild>
              <Link
                href={page.href}
                className="text-center border justify-center"
              >
                {page.title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
  );
}

export function NewsDropdownSM({label, links}:{label: string, links: NavLink[]}) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="text-lg">
            {label}
            <ChevronDown color="black" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="grid grid-cols-2 w-(--radix-dropdown-menu-trigger-width)  p-1">
          {links.map((page) => (
            <DropdownMenuItem key={page.title} asChild>
              <SidebarLink
                href={page.href}
              >
                {page.title}
              </SidebarLink>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
