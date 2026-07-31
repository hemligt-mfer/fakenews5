
    "use client";

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

type NavLink = { title: string; href: string; children?: NavLink[] };

export function NewsDropdown({ label, links }: { label: string; links: NavLink[] }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:border-b-primary!  border-2 hover:bg-[#f4ede0]! hover:dark:text-background  text-[16px] cursor-pointer">
                    {label}
                    <ChevronDown className="dark:text-white text-black" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="grid grid-cols-2 min-w-sm p-1 gap-x-4 gap-y-2">
                {links.map((parent) => (
                    <div key={parent.title} className="flex flex-col">
                        <DropdownMenuItem asChild>
                            <Link
                                href={parent.href}
                                className="text-xs font-bold uppercase tracking-wide cursor-pointer"
                            >
                                {parent.title}
                            </Link>
                        </DropdownMenuItem>
                        {parent.children?.map((child) => (
                            <DropdownMenuItem key={child.title} asChild>
                                <Link href={child.href} className="pl-4 text-sm text-muted-foreground cursor-pointer">
                                    {child.title}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


export function NewsDropdownSM({ label, links }: { label: string; links: NavLink[] }) {
    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="text-lg">
                        {label}
                        <ChevronDown color="black" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="grid grid-cols-2 w-(--radix-dropdown-menu-trigger-width) p-1 gap-x-4 gap-y-2">
                    {links.map((parent) => (
                        <div key={parent.title} className="flex flex-col">
                            <DropdownMenuItem asChild>
                                <SidebarLink href={parent.href} >
                                    {parent.title}
                                </SidebarLink>
                            </DropdownMenuItem>
                            {parent.children?.map((child) => (
                                <DropdownMenuItem key={child.title} asChild >
                                    <Link href={child.href} className="pl-4 text-sm text-muted-foreground">
                                        {child.title}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}
    



