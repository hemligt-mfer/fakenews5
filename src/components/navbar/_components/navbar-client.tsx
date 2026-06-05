"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import { NewsDropdown, SportPages, NewsPages } from "./dropdown-menus";
import { Button } from "@/components/ui/button";

export interface NavbarClientProps {
  hasPermission: boolean;
}

export default function NavbarClient({ hasPermission }: NavbarClientProps) {
  return (
    <div className="flex">
      <div className="hidden lg:flex w-full items-center gap-2 px-6 bg-[#2d2d2d]">
        <ul className="flex items-center mx-auto">
          <li>
            <NewsDropdown label="News" links={NewsPages} />
          </li>
          <li>
            <NewsDropdown label="Sports" links={SportPages} />
          </li>
          {hasPermission ? (
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white">
                    Editor tools
                    <ChevronDown color="white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/article/add-article">Create article</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </div>
  );
}
